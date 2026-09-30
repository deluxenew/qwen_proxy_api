import type { QwenAccount } from './core/accounts.js';
import { addAccount, removeAccount, listAccounts, getAccountCredentials } from './core/accounts.js'
import type { BrowserType} from './services/playwright.js';
import { initPlaywrightForAccount, closePlaywrightForAccount, launchManualLoginAccount, extractAccountInfoFromContext } from './services/playwright.js'
import * as readline from 'readline'
import * as dotenv from 'dotenv'

dotenv.config()

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function askQuestion(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      resolve(answer.trim())
    })
  })
}

function clear() {
  process.stdout.write('\x1Bc')
}

async function showMenu() {
  let browserType: BrowserType = 'chromium'
  const browserArg = process.argv.find(arg => arg.startsWith('--browser='))
  if (browserArg) {
    browserType = browserArg.split('=')[1] as BrowserType
  } else if (process.env.BROWSER) {
    browserType = process.env.BROWSER as BrowserType
  }

  while (true) {
    const accounts = listAccounts()
    clear()
    console.log('=== QwenProxy — менеджер аккаунтов ===\n')

    if (accounts.length > 0) {
      console.log(`Настроенные аккаунты (${accounts.length}):\n`)
      for (let i = 0; i < accounts.length; i++) {
        console.log(`  [${i + 1}] ${accounts[i].email} (ID: ${accounts[i].id})`)
      }
    } else {
      console.log('Аккаунты пока не настроены.\n')
    }

    console.log('\nОпции:')
    console.log('  [A] Добавить аккаунт (с учётными данными)')
    console.log('  [M] Добавить аккаунт (вход вручную в браузере)')
    if (accounts.length > 0) {
      console.log('  [R] Удалить аккаунт')
      console.log('  [L] Войти во все аккаунты')
    }
    console.log('  [Q] Выход\n')

    const choice = (await askQuestion('Выберите опцию: ')).toUpperCase()

    if (choice === 'Q') {
      rl.close()
      process.exit(0)
    }

    if (choice === 'A') {
      await addAccountFlow()
      continue
    }

    if (choice === 'M') {
      await addAccountManualFlow(browserType)
      continue
    }

    if (choice === 'R' && accounts.length > 0) {
      await removeAccountFlow()
      continue
    }

    if (choice === 'L' && accounts.length > 0) {
      await loginAllAccounts(browserType)
      rl.close()
      return
    }
  }
}

async function addAccountFlow() {
  clear()
  console.log('=== Добавление аккаунта ===\n')
  const email = await askQuestion('E-mail: ')
  if (!email) {
    console.log('Укажите e-mail.')
    await askQuestion('Нажмите Enter, чтобы продолжить...')
    return
  }
  const password = await askQuestion('Пароль: ')
  if (!password) {
    console.log('Укажите пароль.')
    await askQuestion('Нажмите Enter, чтобы продолжить...')
    return
  }

  try {
    const account = addAccount(email, password)
    console.log(`\nАккаунт добавлен: ${account.email} (${account.id})`)
  } catch (err: any) {
    console.log(`\nОшибка: ${err.message}`)
  }

  await askQuestion('Нажмите Enter, чтобы продолжить...')
}

async function removeAccountFlow() {
  const accounts = listAccounts()
  if (accounts.length === 0) return

  clear()
  console.log('=== Удаление аккаунта ===\n')

  for (let i = 0; i < accounts.length; i++) {
    console.log(`  [${i + 1}] ${accounts[i].email} (ID: ${accounts[i].id})`)
  }

  const input = await askQuestion('\nВведите номер аккаунта для удаления (или 0 для отмены): ')
  const idx = parseInt(input) - 1

  if (isNaN(idx) || idx < 0 || idx >= accounts.length) {
    console.log(input !== '0' ? 'Некорректный выбор.' : 'Отменено.')
    await askQuestion('Нажмите Enter, чтобы продолжить...')
    return
  }

  const account = accounts[idx]
  const confirm = await askQuestion(`\nУдалить ${account.email}? (y/N): `)
  if (confirm.toLowerCase() === 'y') {
    if (removeAccount(account.id)) {
      console.log(`Аккаунт ${account.email} удалён.`)
    } else {
      console.log('Не удалось удалить аккаунт.')
    }
  } else {
    console.log('Отменено.')
  }

  await askQuestion('Нажмите Enter, чтобы продолжить...')
}

async function loginAllAccounts(browserType: BrowserType) {
  const accounts = listAccounts()
  if (accounts.length === 0) return

  clear()
  console.log(`Выполняется вход в ${accounts.length} акк. через ${browserType}...\n`)

  for (let i = 0; i < accounts.length; i++) {
    const account = accounts[i]
    const creds = getAccountCredentials(account.id)
    if (!creds || creds.password === '***') {
      console.log(`[Вход] Пропуск ${account.email} — нет учётных данных`)
      continue
    }
    console.log(`[Вход] Обработка аккаунта: ${account.email}`)
    try {
      const fullAccount: QwenAccount = {
        id: creds.id,
        email: creds.email,
        password: creds.password,
      }
      await initPlaywrightForAccount(fullAccount, true, browserType)
      console.log(`[Вход] Сессия аккаунта ${account.email} сохранена.`)
      await closePlaywrightForAccount(account.id)
    } catch (err: any) {
      console.error(`[Вход] Не удалось войти в ${account.email}: ${err.message}`)
    }
  }

  console.log('\n[Вход] Все аккаунты обработаны.')
  await askQuestion('Нажмите Enter, чтобы продолжить...')
}

async function addAccountManualFlow(browserType: BrowserType) {
  clear()
  console.log('=== Добавление аккаунта (вход вручную) ===\n')
  console.log('Откроется окно браузера. Войдите в Qwen вручную.')
  console.log('После входа закройте окно браузера или нажмите Ctrl+C здесь.\n')
  await askQuestion('Нажмите Enter, чтобы открыть браузер...')

  const crypto = await import('crypto')
  const accountId = crypto.randomUUID()

  const { context, page } = await launchManualLoginAccount(accountId, browserType)

  console.log('\nБраузер открыт. Ожидание входа...')
  
  let loggedIn = false
  while (!loggedIn) {
    await new Promise(resolve => setTimeout(resolve, 2000))
    const { hasSession } = await extractAccountInfoFromContext(page)
    if (hasSession) {
      loggedIn = true
    }
  }

  console.log('\nВход обнаружен! Извлечение данных аккаунта...')
  
  const extractedEmail = await askQuestion('Введите e-mail этого аккаунта: ')
  if (!extractedEmail) {
    console.log('Укажите e-mail.')
    await context.close()
    await askQuestion('Нажмите Enter, чтобы продолжить...')
    return
  }

  try {
    const account = addAccount(extractedEmail, '', accountId)
    console.log(`\nАккаунт добавлен: ${account.email} (${account.id})`)
  } catch (err: any) {
    console.log(`\nОшибка: ${err.message}`)
  }

  await context.close()
  await askQuestion('Нажмите Enter, чтобы продолжить...')
}

showMenu().catch(err => {
  console.error(err)
  process.exit(1)
})
