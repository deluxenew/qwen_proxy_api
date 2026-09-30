import { config } from '../core/config.js';
import { getActiveAccountCount, markAccountReady } from '../core/account-manager.js';
import { getBaseAccountId } from '../core/account-lanes.js';
import {
  CHROME_UA,
  COOKIE_CACHE_TTL,
  REFRESH_THRESHOLD,
  GUEST_HEADERS_TTL,
  getHeadersTtlMs,
  getBackgroundHeaderRefresh,
  sleep,
  accountContexts,
  accountPages,
  cachedUserAgents,
  cookieCaches,
  getAccountHeaderCache,
  getActivePage,
  getGuestPage,
  getGuestHeadersCache,
  setGuestHeadersCache,
  setGuestContext,
  setGuestPage,
  getOrLaunchBrowser,
  loadStorageState,
  sharedContextOptions,
  getUiMutex,
  resetBrowserProfile,
  initPlaywright,
  initPlaywrightForAccount,
} from './browser-manager.js';
import { getStealthScript } from './stealth.js';
import { startCaptchaWatcher } from './captcha-solver.js';
import { humanType, humanDelay } from './human-behavior.js';
import { getFingerprintProfile } from './fingerprint.js';

export async function getCookies(accountId?: string): Promise<string> {
  if (process.env.TEST_MOCK_PLAYWRIGHT) return 'token=mock';
  const cacheKey = accountId || 'global';
  const now = Date.now();
  const cached = cookieCaches.get(cacheKey);
  if (cached && (now - cached.timestamp) < COOKIE_CACHE_TTL) {
    return cached.cookie;
  }
  const page = accountId ? accountPages.get(accountId) : getActivePage();
  if (!page) return '';
  const cookies = await page.context().cookies();
  const cookieStr = cookies.map(c => `${c.name}=${c.value}`).join('; ');
  cookieCaches.set(cacheKey, { cookie: cookieStr, timestamp: now });
  return cookieStr;
}

export async function getBasicHeaders(accountId?: string): Promise<{ cookie: string, userAgent: string, bxV: string, bxUa?: string, bxUmidtoken?: string }> {
  if (process.env.TEST_MOCK_PLAYWRIGHT) return { cookie: 'token=mock', userAgent: 'mock', bxV: '2.5.36', bxUa: 'mock-bx-ua', bxUmidtoken: 'mock-bx-umidtoken' };

  let page = accountId ? accountPages.get(accountId) : getActivePage();
  if (accountId && !page) {
    const { getAccountCredentials } = await import('../core/accounts.js');
    const creds = getAccountCredentials(getBaseAccountId(accountId));
    if (creds) {
      await initPlaywrightForAccount({ ...creds, id: accountId }, config.browser.headless);
      page = accountPages.get(accountId);
    }
  }

  if (!page) throw new Error('Playwright не инициализирован');

  const cookie = await getCookies(accountId);
  const cacheKey = accountId || 'global';

  let userAgent = cachedUserAgents.get(cacheKey);
  if (!userAgent) {
    userAgent = await page.evaluate(() => navigator.userAgent);
    cachedUserAgents.set(cacheKey, userAgent);
  }

  const cache = getAccountHeaderCache(cacheKey);
  let bxUa = cache.currentHeaders['bx-ua'];
  let bxUmidtoken = cache.currentHeaders['bx-umidtoken'];
  const bxV = cache.currentHeaders['bx-v'] || '2.5.36';

  if (!bxUa || !bxUmidtoken) {
    console.log(`[Playwright] Missing bx-ua/bx-umidtoken for ${cacheKey}, triggering header interception...`);
    try {
      const result = await getQwenHeaders(true, accountId);
      bxUa = result.headers['bx-ua'];
      bxUmidtoken = result.headers['bx-umidtoken'];
      markAccountReady(cacheKey);
      return {
        cookie: await getCookies(accountId),
        userAgent,
        bxV: result.headers['bx-v'] || bxV,
        bxUa,
        bxUmidtoken,
      };
    } catch (err: any) {
      console.warn(`[Playwright] Failed to auto-recover headers for ${cacheKey}: ${err.message}`);
    }
  }

  if (bxUa && bxUmidtoken) {
    markAccountReady(cacheKey);
  }

  return { cookie, userAgent, bxV, bxUa, bxUmidtoken };
}

export async function getGuestHeaders(): Promise<Record<string, string>> {
  const cached = getGuestHeadersCache();
  if (cached && (Date.now() - cached.timestamp) < GUEST_HEADERS_TTL) {
    return cached.headers;
  }

  let guestPage = getGuestPage();
  if (!guestPage) {
    const sharedBrowser = await getOrLaunchBrowser('chromium');
    const storageState = loadStorageState('_guest');
    const guestProfile = getFingerprintProfile('_guest');
    const guestCtx = await sharedBrowser.newContext({
      ...sharedContextOptions('_guest'),
      ...(storageState ? { storageState } : {}),
    });
    await guestCtx.addInitScript(getStealthScript(guestProfile));
    setGuestContext(guestCtx);
    guestPage = await guestCtx.newPage();
    setGuestPage(guestPage);

    await guestPage.goto('https://chat.qwen.ai/c/guest', { waitUntil: 'domcontentloaded', timeout: config.timeouts.navigation });

    try {
      // The guest popup is localized: match every locale the proxy can run with
      // (ru-RU by default) so the flow does not depend on BROWSER_LOCALE.
      const keepSessionBtn = await guestPage.$('button:has-text("Manter sessão terminada"), button:has-text("Keep session ended"), button:has-text("Manter sessão encerrada"), button:has-text("сесси")');
      if (keepSessionBtn) {
        await keepSessionBtn.click();
        console.log('[Playwright] Guest: clicked "keep session" button');
        await sleep(1000);
      }
    } catch { /* ignore popup errors */ }
  }

  const watcher = startCaptchaWatcher(guestPage!, config.timeouts.headers);
  try {
    return await new Promise<Record<string, string>>((resolve, reject) => {
      const timeout = setTimeout(() => {
        resetBrowserProfile('guest', 'guest')
          .catch((err: any) => console.warn(`[Playwright] Failed to reset guest profile after timeout: ${err.message}`))
          .finally(() => reject(new Error('Timeout getting guest headers')));
      }, config.timeouts.headers);

      const routeHandler = async (route: any, request: any) => {
        clearTimeout(timeout);
        const reqHeaders = request.headers();
        console.log('[Playwright] Guest intercepted request:', request.url());

        const extractedHeaders = {
          'cookie': reqHeaders['cookie'] || '',
          'bx-ua': reqHeaders['bx-ua'] || '',
          'bx-umidtoken': reqHeaders['bx-umidtoken'] || '',
          'bx-v': reqHeaders['bx-v'] || '2.5.36',
          'user-agent': reqHeaders['user-agent'] || CHROME_UA,
        };

        if (extractedHeaders['bx-ua']) {
          console.log('[Playwright] Guest: Successfully captured bx-ua');
          setGuestHeadersCache({ headers: extractedHeaders, timestamp: Date.now() });
          await route.abort('aborted');
          await guestPage!.unroute('**/api/v2/chat/completions*', routeHandler);

          import('./qwen.js').then(m => m.disableNativeTools('guest').catch(() => {}));

          resolve(extractedHeaders);
        } else {
          console.log('[Playwright] Guest: Request missing bx-ua, continuing route. Headers:', Object.keys(reqHeaders));
          await route.continue();
          if (request.url().includes('/api/v2/chat/completions')) {
             await guestPage!.unroute('**/api/v2/chat/completions*', routeHandler);
             reject(new Error('Guest completions request was missing bx-ua; refusing to cache inconsistent anti-bot headers.'));
          }
        }
      };

      guestPage!.route('**/api/v2/chat/completions*', routeHandler).then(async () => {
        const inputSelector = 'textarea:visible, [contenteditable="true"]:visible';
        try {
          await guestPage!.waitForSelector(inputSelector, { timeout: config.timeouts.page });
          await humanType(guestPage!, inputSelector, 'Hello');
          await sleep(humanDelay(800, 1500));

          const selectors = [
            '.message-input-right-button-send button',
            'button[aria-label="Отправить"]',
            'button[aria-label="Send"]',
            'button:has(svg use[*|href*="send"])',
            'button:has(svg use[*|href*="sendChat"])'
          ];
          let clicked = false;
          for (const selector of selectors) {
            const btn = await guestPage!.$(selector);
            if (btn && await btn.isVisible()) {
              await btn.click({ force: true, delay: 50 }).catch((e: any) => {
                console.warn(`[Playwright] Guest click failed for ${selector}:`, e.message);
              });
              clicked = true;
              break;
            }
          }
          if (!clicked) {
            await guestPage!.keyboard.press('Enter');
          }
        } catch (e) {
          clearTimeout(timeout);
          reject(e);
        }
      });
    });
  } finally {
    watcher.stop();
  }
}

export async function getQwenHeaders(forceNew = false, accountId?: string): Promise<{ headers: Record<string, string>, chatSessionId: string, parentMessageId: string | null }> {
  if (accountId === 'guest') {
    const headers = await getGuestHeaders();
    return { headers, chatSessionId: 'guest-session', parentMessageId: null };
  }

  const cacheKey = accountId || 'global';
  const cache = getAccountHeaderCache(cacheKey);

  if (!forceNew && cache.cachedQwenHeaders) {
    const age = Date.now() - cache.lastHeadersTime;
    if (age < getHeadersTtlMs()) {
      if (getBackgroundHeaderRefresh() && age > getHeadersTtlMs() * REFRESH_THRESHOLD && !cache.refreshInProgress) {
        cache.refreshInProgress = true;
        getQwenHeaders(true, accountId).catch((err) => {
          console.warn(`[Playwright] Background header refresh failed for ${cacheKey}:`, (err as Error).message);
        }).finally(() => {
          cache.refreshInProgress = false;
        });
      }
      return cache.cachedQwenHeaders;
    }
  }

  const release = await getUiMutex(cacheKey).acquire();
  try {
    if (!forceNew && cache.cachedQwenHeaders && (Date.now() - cache.lastHeadersTime < getHeadersTtlMs())) {
      return cache.cachedQwenHeaders;
    }
    return await _getQwenHeadersInternal(forceNew, accountId);
  } finally {
    release();
  }
}

async function tryLightweightCookieRefresh(accountId?: string): Promise<{ headers: Record<string, string>, chatSessionId: string, parentMessageId: string | null } | null> {
  const cacheKey = accountId || 'global';
  const cache = getAccountHeaderCache(cacheKey);

  const page = accountId ? accountPages.get(accountId) : getActivePage();
  if (!page) return null;

  try {
    const cookies = await page.context().cookies();
    const cookieStr = cookies.map(c => `${c.name}=${c.value}`).join('; ');
    let userAgent = cachedUserAgents.get(cacheKey);
    if (!userAgent) {
      userAgent = await page.evaluate(() => navigator.userAgent);
      cachedUserAgents.set(cacheKey, userAgent);
    }

    const now = Date.now();
    cookieCaches.set(cacheKey, { cookie: cookieStr, timestamp: now });

    if (cache.cachedQwenHeaders && cache.currentHeaders.cookie) {
      const updatedHeaders = {
        ...cache.cachedQwenHeaders.headers,
        cookie: cookieStr,
        'user-agent': userAgent,
      };
      cache.cachedQwenHeaders = {
        ...cache.cachedQwenHeaders,
        headers: updatedHeaders,
      };
      cache.lastHeadersTime = now;
      cache.currentHeaders = {
        ...cache.currentHeaders,
        cookie: cookieStr,
        'user-agent': userAgent,
      };
      return cache.cachedQwenHeaders;
    }
  } catch { /* ignore cache read errors */ }

  return null;
}

const MAX_HEADER_CAPTURE_RETRIES = 2;

async function _getQwenHeadersInternal(forceNew = false, accountId?: string): Promise<{ headers: Record<string, string>, chatSessionId: string, parentMessageId: string | null }> {
  const cacheKey = accountId || 'global';
  let lastError: any;

  for (let attempt = 0; attempt <= MAX_HEADER_CAPTURE_RETRIES; attempt++) {
    try {
      return await _getQwenHeadersInternalOnce(forceNew || attempt > 0, accountId);
    } catch (err: any) {
      lastError = err;
      const isTimeout = err?.message?.includes('Timeout waiting for Qwen headers for');

      if (attempt < MAX_HEADER_CAPTURE_RETRIES && isTimeout) {
        console.warn(`[Playwright] Header capture timed out for ${cacheKey}; clearing browser profile and retrying (attempt ${attempt + 1}/${MAX_HEADER_CAPTURE_RETRIES})...`);
        await resetBrowserProfile(cacheKey, accountId);
        if (!accountId && getActiveAccountCount() === 0) {
          await initPlaywright(config.browser.headless, config.browser.type);
        }
        continue;
      }

      break;
    }
  }

  throw lastError || new Error(`Header capture failed for ${cacheKey} after ${MAX_HEADER_CAPTURE_RETRIES + 1} attempts`);
}

async function _getQwenHeadersInternalOnce(forceNew = false, accountId?: string): Promise<{ headers: Record<string, string>, chatSessionId: string, parentMessageId: string | null }> {
  const cacheKey = accountId || 'global';
  const cache = getAccountHeaderCache(cacheKey);

  if (process.env.TEST_MOCK_PLAYWRIGHT) {
    const mockSessionId = process.env.TEST_SESSION_ID || 'mock-session';
    return {
      headers: {
        'authorization': 'Bearer MOCK',
        'cookie': 'token=mock',
        'user-agent': 'mock',
        'bx-v': '2.5.36',
        'bx-ua': 'mock-bx-ua',
        'bx-umidtoken': 'mock-bx-umidtoken'
      },
      chatSessionId: mockSessionId,
      parentMessageId: null
    };
  }

  if (!forceNew && cache.cachedQwenHeaders) {
    const lightResult = await tryLightweightCookieRefresh(accountId);
    if (lightResult) {
      return lightResult;
    }
  }

  if (accountId && !accountPages.has(accountId)) {
    const { getAccountCredentials } = await import('../core/accounts.js');
    const creds = getAccountCredentials(getBaseAccountId(accountId));
    if (creds) {
      await initPlaywrightForAccount({ ...creds, id: accountId }, config.browser.headless);
    }
  }

  const page = accountId ? accountPages.get(accountId) : getActivePage();
  if (!page) {
    throw new Error(`Playwright not initialized for account: ${cacheKey}`);
  }

  const currentUrl = page.url();
  const isOnQwen = currentUrl.includes('chat.qwen.ai');
  const isOnSpecificChat = isOnQwen && /\/c\/(?!new-chat)/.test(currentUrl);

  if (!isOnQwen || isOnSpecificChat) {
    console.log(`[Playwright] Navigating to stable Qwen new-chat page for ${cacheKey}... (Current: ${currentUrl})`);
    await page.goto('https://chat.qwen.ai/c/new-chat', { waitUntil: 'domcontentloaded' });
  }

  const isLoginPage = page.url().includes('login') || (await page.$('input[type="email"], input[placeholder*="Email"]'));
  if (isLoginPage) {
    if (!accountId) {
      const email = process.env.QWEN_EMAIL;
      const password = process.env.QWEN_PASSWORD;

      if (email && password) {
        console.log('[Playwright] Detected login page. Attempting automated login...');
        try {
          const { loginToQwen } = await import('./browser-manager.js');
          const loggedIn = await loginToQwen(email, password);
          if (!loggedIn) {
            throw new Error('loginToQwen returned false');
          }
          console.log('[Playwright] Automated login successful.');
        } catch (err: any) {
          console.error('[Playwright] Automated login failed:', err.message);
        }
      } else {
        console.warn('[Playwright] Detected login page but QWEN_EMAIL/PASSWORD not provided in .env');
      }
    } else {
      const { getAccountCredentials } = await import('../core/accounts.js');
      const creds = getAccountCredentials(getBaseAccountId(accountId));
      if (creds && creds.email && creds.password) {
        console.log(`[Playwright] Detected login page for account ${creds.email}. Attempting login...`);
        const acctContext = accountContexts.get(accountId);
        if (acctContext) {
          const pageForLogin = accountPages.get(accountId);
          if (pageForLogin) {
            const hashedPassword = (await import('crypto')).createHash('sha256').update(creds.password).digest('hex');
            await pageForLogin.evaluate(async ({ email, password }) => {
              await fetch('https://chat.qwen.ai/api/v2/auths/signin', {
                method: 'POST',
                headers: {
                  'accept': 'application/json, text/plain, */*',
                  'content-type': 'application/json',
                  'source': 'web',
                  'timezone': new Date().toString().split(' (')[0],
                  'x-request-id': crypto.randomUUID(),
                },
                body: JSON.stringify({ email, password, login_type: 'email' }),
              });
            }, { email: creds.email, password: hashedPassword });
          }
        }
      }
    }
  }

  const watcher = startCaptchaWatcher(page, config.timeouts.headers);
  try {
    return await new Promise<{ headers: Record<string, string>, chatSessionId: string, parentMessageId: string | null }>((resolve, reject) => {
      const timeout = setTimeout(async () => {
        console.error(`[Playwright] Timeout waiting for Qwen headers for ${cacheKey}. Current URL:`, page.url());
        try {
          const path = await import('path');
          const { PROFILES_DIR } = await import('./browser-manager.js');
          const screenshotPath = path.join(PROFILES_DIR, `error_${cacheKey}.png`);
          await page.screenshot({ path: screenshotPath });
          console.log(`[Playwright] Error screenshot saved to ${screenshotPath}`);
        } catch (err: any) {
          console.error('[Playwright] Failed to save error screenshot:', err.message);
        }
        reject(new Error(`Timeout waiting for Qwen headers for ${cacheKey}`));
      }, config.timeouts.headers);

      let resolved = false;

      // Strategy 1: page.on('request') captures bx-ua from ANY request (model list, completions, etc.)
      const onRequest = async (request: any) => {
        if (resolved) return;
        const reqHeaders = request.headers();
        if (!reqHeaders['bx-ua'] || !reqHeaders['cookie']) return;

        let uiSessionId = '';
        let uiParentMessageId: string | null = null;

        if (request.url().includes('/api/v2/chat/completions')) {
          const postData = request.postData();
          if (postData) {
            try {
              const payload = JSON.parse(postData);
              if (payload.chat_id) uiSessionId = payload.chat_id;
              if (payload.parent_id !== undefined) uiParentMessageId = payload.parent_id;
            } catch { /* ignore parse errors */ }
          }
        }

        console.log(`[Playwright] Captured headers via page.on('request') from ${request.url().substring(0, 80)} for ${cacheKey}`);
        finalizeHeaders(reqHeaders, uiSessionId, uiParentMessageId);
      };
      page.on('request', onRequest);

      // Strategy 2: route interception on completions (blocks the request so chat doesn't actually send)
      const routeHandler = async (route: any, request: any) => {
        if (resolved) { await route.continue(); return; }

        const reqHeaders = request.headers();
        let uiSessionId = '';
        let uiParentMessageId: string | null = null;

        const postData = request.postData();
        if (postData) {
          try {
            const payload = JSON.parse(postData);
            if (payload.chat_id) uiSessionId = payload.chat_id;
            if (payload.parent_id !== undefined) uiParentMessageId = payload.parent_id;
          } catch { /* ignore parse errors */ }
        }

        if (!reqHeaders['bx-ua']) {
          console.log(`[Playwright] Route intercepted completions request missing bx-ua for ${cacheKey}, aborting...`);
          await route.abort('aborted');
          return;
        }

        console.log(`[Playwright] Captured headers via route interception for ${cacheKey}`);
        finalizeHeaders(reqHeaders, uiSessionId, uiParentMessageId);
        await route.abort('aborted');
        await page.unroute('**/api/v2/chat/completions*', routeHandler);
      };

      function cleanup() {
        page!.removeListener('request', onRequest);
        page!.unroute('**/api/v2/chat/completions*', routeHandler).catch(() => {});
      }

      function finalizeHeaders(
        reqHeaders: Record<string, string>,
        uiSessionId: string,
        uiParentMessageId: string | null,
      ) {
        if (resolved) return;
        resolved = true;
        clearTimeout(timeout);

        const extractedHeaders = {
          'cookie': reqHeaders['cookie'] || '',
          'bx-ua': reqHeaders['bx-ua'] || '',
          'bx-umidtoken': reqHeaders['bx-umidtoken'] || '',
          'bx-v': reqHeaders['bx-v'] || '',
          'x-request-id': reqHeaders['x-request-id'] || '',
          'user-agent': reqHeaders['user-agent'] || '',
        };

        console.log(`[Playwright] Successfully intercepted headers for ${cacheKey}.`);
        cache.currentHeaders = extractedHeaders;
        cache.cachedQwenHeaders = { headers: extractedHeaders, chatSessionId: uiSessionId, parentMessageId: uiParentMessageId };
        cache.lastHeadersTime = Date.now();
        cache.refreshInProgress = false;
        markAccountReady(cacheKey);

        import('./qwen.js').then(m => m.disableNativeTools(accountId).catch(() => {}));

        cleanup();
        resolve(cache.cachedQwenHeaders);
      }

      Promise.all([
        page.route('**/api/v2/chat/completions*', routeHandler),
      ]).then(async () => {
        console.log(`[Playwright] Attempting to trigger a request for ${cacheKey}...`);

        // Strategy 3: Trigger a dummy fetch() directly from browser context.
        // The anti-bot JS patches window.fetch to inject bx-ua headers.
        // This bypasses the UI entirely — no typing or clicking needed.
        try {
          const fetchResult = await page.evaluate(async () => {
            try {
              const resp = await fetch('/api/v2/chat/completions', {
                method: 'POST',
                headers: {
                  'accept': 'text/event-stream',
                  'content-type': 'application/json',
                },
                body: JSON.stringify({
                  chat_id: '',
                  messages: [{ role: 'user', content: 'ping' }],
                  model: 'qwen-max',
                  stream: true,
                }),
              });
              return { ok: resp.ok, status: resp.status };
            } catch (e: any) {
              return { error: e.message };
            }
          });
          console.log(`[Playwright] Dummy fetch result for ${cacheKey}:`, fetchResult);
        } catch (e) {
          console.warn(`[Playwright] page.evaluate(fetch) failed for ${cacheKey}:`, (e as Error).message);
        }

        // Fallback: if Strategy 3 didn't produce headers via route/onRequest, try typing + clicking
        if (resolved) return;

        console.log(`[Playwright] Fetch didn't capture headers, falling back to typing+clicking for ${cacheKey}...`);
        const inputSelector = 'textarea.message-input-textarea, textarea:visible, [contenteditable="true"]:visible';
        const sendSelectors = [
          '.message-input-right-button-send button',
          'button[aria-label="Отправить"]',
          'button[aria-label="Send"]',
          'button:has(svg use[*|href*="send"])',
          'button:has(svg use[*|href*="sendChat"])',
        ];

        try {
          await page.waitForSelector(inputSelector, { timeout: 10000 });
          await humanType(page, inputSelector, 'Hello');
          await sleep(humanDelay(1500, 2500));

          let clicked = false;
          for (const selector of sendSelectors) {
            try {
              const btn = await page.$(selector);
              if (btn && await btn.isVisible()) {
                await btn.click({ force: true, delay: humanDelay(30, 80) });
                clicked = true;
                break;
              }
            } catch (e) {
              console.warn(`[Playwright] Click failed for ${selector} on ${cacheKey}:`, (e as Error).message);
            }
          }
          if (!clicked) {
            try { await page.focus(inputSelector); } catch { /* ignore */ }
            await page.keyboard.press('Enter');
          }
        } catch (e) {
          console.warn(`[Playwright] Fallback typing failed for ${cacheKey}:`, (e as Error).message);
        }
      }).catch((e) => {
        if (!resolved) {
          clearTimeout(timeout);
          cleanup();
          reject(e);
        }
      });
    });
  } finally {
    watcher.stop();
  }
}
