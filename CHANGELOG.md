## [1.20.1](https://github.com/pedrofariasx/qwenproxy/compare/v1.20.0...v1.20.1) (2026-08-16)


### Исправления ошибок

* надёжный захват заголовков аккаунта — конкретный селектор ввода, тайминг гостевого потока, ограничение повторных попыток ([5b3fd3e](https://github.com/pedrofariasx/qwenproxy/commit/5b3fd3eecb39aa12c8f4a83959044ab7c809e0c0))

# [1.20.0](https://github.com/pedrofariasx/qwenproxy/compare/v1.19.1...v1.20.0) (2026-08-11)


### Новые возможности

* режим разработки с мгновенным HMR и логотип админки с учётом темы ([41e5eff](https://github.com/pedrofariasx/qwenproxy/commit/41e5eff7830ee962cd3ee023dced446cc27c4cf3))

## [1.19.1](https://github.com/pedrofariasx/qwenproxy/compare/v1.19.0...v1.19.1) (2026-08-11)


### Исправления ошибок

* маппинг портов в docker-compose, опциональный файл окружения и надёжный healthcheck ([984a65c](https://github.com/pedrofariasx/qwenproxy/commit/984a65ca6737bab3647b0fc1206ad186767cc47c))

# [1.19.0](https://github.com/pedrofariasx/qwenproxy/compare/v1.18.1...v1.19.0) (2026-08-11)


### Новые возможности

* надёжная конфигурация окружения с валидированными runtime-переключателями ([4921783](https://github.com/pedrofariasx/qwenproxy/commit/492178329709342dbb542ce8fa3bc31279c0091c))

## [1.18.1](https://github.com/pedrofariasx/qwenproxy/compare/v1.18.0...v1.18.1) (2026-08-11)


### Исправления ошибок

* непрерывность сессий в цикле инструментов и постановка запросов в очередь вместо отклонения при занятых линиях ([ba6b22b](https://github.com/pedrofariasx/qwenproxy/commit/ba6b22b8f66604cc2fbefe0c4c3bc86739fe17b7))

# [1.18.0](https://github.com/pedrofariasx/qwenproxy/compare/v1.17.1...v1.18.0) (2026-08-11)


### Новые возможности

* надёжность вызовов инструментов — повтор при некорректном формате, реестр id-to-name и throttling логов ([a865ce6](https://github.com/pedrofariasx/qwenproxy/commit/a865ce685cf71633a14578457b15f238726c6dca))

## [1.17.1](https://github.com/pedrofariasx/qwenproxy/compare/v1.17.0...v1.17.1) (2026-08-11)


### Исправления ошибок

* повреждение стриминга при вызовах инструментов и добавление диагностики генерации tool-call ([84de0a5](https://github.com/pedrofariasx/qwenproxy/commit/84de0a52c7bf922bda8874bffbaf2eb88010471b))

# [1.17.0](https://github.com/pedrofariasx/qwenproxy/compare/v1.16.0...v1.17.0) (2026-08-11)


### Новые возможности

* точные метрики dashboard, мгновенные live-настройки, API активных стримов и статус watchdog ([da91508](https://github.com/pedrofariasx/qwenproxy/commit/da91508372ec7f725f4188d37f45ac306679399c))
* светлая тема админки, страница стримов и исправления в dashboard ([10adb78](https://github.com/pedrofariasx/qwenproxy/commit/10adb789fbd72694ad74108c67440512ea840265))

# [1.16.0](https://github.com/pedrofariasx/qwenproxy/compare/v1.15.0...v1.16.0) (2026-08-11)


### Новые возможности

* быстрый путь завершения через Node с circuit breaker для каждого аккаунта; отключение линтера no-explicit-any ([5fb2b82](https://github.com/pedrofariasx/qwenproxy/commit/5fb2b820932fbfd67634eb9f65c6dcd6c68cd887))

# [1.15.0](https://github.com/pedrofariasx/qwenproxy/compare/v1.14.0...v1.15.0) (2026-08-11)


### Исправления ошибок

* очистка in-memory cooldown при нажатии кнопки очистки в админке и отображение готовности/ёмкости линий ([c6b12d3](https://github.com/pedrofariasx/qwenproxy/commit/c6b12d3dc8da60f625607d701aaf4eaf4be003b2))


### Новые возможности

* добавлен токенизатор контекста с model-aware усечением и расширенными surface моделей/админки ([982dd2f](https://github.com/pedrofariasx/qwenproxy/commit/982dd2f2bd7168988a77a68ec4189adec3b7a5d2))

# [1.14.0](https://github.com/pedrofariasx/qwenproxy/compare/v1.13.2...v1.14.0) (2026-08-10)


### Новые возможности

* экономные сессии для циклов инструментов, трекинг использования/логов и расширение админки ([9068bfd](https://github.com/pedrofariasx/qwenproxy/commit/9068bfdf762172a87cfe92b50e7aeceb8cb94ac8))

## [1.13.2](https://github.com/pedrofariasx/qwenproxy/compare/v1.13.1...v1.13.2) (2026-08-10)


### Исправления ошибок

* сохранение контекста экономного режима для рабочих процессов инструментов и укрепление surface админки/метрик ([328f7f4](https://github.com/pedrofariasx/qwenproxy/commit/328f7f4ec5f9e3cfd0d1c81c1af9e0c3a0cdf6fc))

## [1.13.1](https://github.com/pedrofariasx/qwenproxy/compare/v1.13.0...v1.13.1) (2026-08-09)


### Улучшения производительности

* пакетное сохранение сессий, кэширование пользовательских ключей и ограничение параллельности по памяти ([8727a64](https://github.com/pedrofariasx/qwenproxy/commit/8727a64449ed6434caffeafedea201d7911d34bd))

# [1.13.0](https://github.com/pedrofariasx/qwenproxy/compare/v1.12.16...v1.13.0) (2026-08-09)


### Новые возможности

* добавлена панель администратора с гибридными сессиями, мультипользовательской аутентификацией и маршрутизацией по нагрузке ([71297af](https://github.com/pedrofariasx/qwenproxy/commit/71297af104b6e8232ddb73333503d7a515d040bd))

## [1.12.16](https://github.com/pedrofariasx/qwenproxy/compare/v1.12.15...v1.12.16) (2026-07-21)


### Исправления ошибок

* повторный запрос стрима браузера со свежими заголовками при пустом 200 OK ответе от Qwen ([6a96194](https://github.com/pedrofariasx/qwenproxy/commit/6a961946ea3c481f82ff24ba27099b0ba379d8a0))

## [1.12.15](https://github.com/pedrofariasx/qwenproxy/compare/v1.12.14...v1.12.15) (2026-07-21)


### Исправления ошибок

* ожидание свободной линии аккаунта вместо немедленного отклонения при занятых всех линиях ([02ad418](https://github.com/pedrofariasx/qwenproxy/commit/02ad4185b82a6c5189f2f4851580009589d6e7f7))

## [1.12.14](https://github.com/pedrofariasx/qwenproxy/compare/v1.12.13...v1.12.14) (2026-07-18)


### Исправления ошибок

* исправлен импорт типа ali-oss для решения ошибки tsc и ошибки lint consistent-type-imports ([9ca87b0](https://github.com/pedrofariasx/qwenproxy/commit/9ca87b0d67db3fb8dd5295838844d24ba2a2abd6))


### Улучшения производительности

* снижение латентности стриминга и ускорение обработки больших промптов ([357ec42](https://github.com/pedrofariasx/qwenproxy/commit/357ec427e5fce8645db4383e52d88329861f23c9))

## [1.12.12](https://github.com/pedrofariasx/qwenproxy/compare/v1.12.11...v1.12.12) (2026-07-18)


### Исправления ошибок

* инлайн логика сброса чанков в page.evaluate для избежания ссылки на esbuild __name helper в контексте браузера ([6e2b666](https://github.com/pedrofariasx/qwenproxy/commit/6e2b666e67763a93ee6087f0786f928cfcef1f97))

## [1.12.11](https://github.com/pedrofariasx/qwenproxy/compare/v1.12.10...v1.12.11) (2026-07-18)


### Улучшения производительности

* объединение SSE-чанков в браузере перед пересечением CDP-моста для снижения накладных расходов стриминга ([3829f5f](https://github.com/pedrofariasx/qwenproxy/commit/3829f5f9b4d3ea7a4af835c932a0b81e4a28cea6))

## [1.12.10](https://github.com/pedrofariasx/qwenproxy/compare/v1.12.9...v1.12.10) (2026-07-18)


### Исправления ошибок

* корректное включение содержимого загруженных файлов в контекст чата для лучшего понимания текстовых файлов моделью, таких как история чата ([442c50e](https://github.com/pedrofariasx/qwenproxy/commit/442c50e687b035f3e08ee2b6d7b8dabde0215d42))
* типизация переменной catch при обработке ошибок чтения содержимого файла ([8304399](https://github.com/pedrofariasx/qwenproxy/commit/8304399b4e1f63f5b657541d10f79cc7add70cac))

## [1.12.9](https://github.com/pedrofariasx/qwenproxy/compare/v1.12.8...v1.12.9) (2026-07-03)


### Исправления ошибок

* освобождение блокировки аккаунта при успехе, улучшение обработки строк стрима, улучшение обработки промптов, оптимизация тайминга пополнения прогретого пула ([3806cf6](https://github.com/pedrofariasx/qwenproxy/commit/3806cf6119c267d0ee6131912cef06c881f4c716))

## [1.12.8](https://github.com/pedrofariasx/qwenproxy/compare/v1.12.7...v1.12.8) (2026-07-03)


### Исправления ошибок

* удаление reasoning_content из истории промптов для снижения использования токенов ([4f7702e](https://github.com/pedrofariasx/qwenproxy/commit/4f7702ed07b55f6e20297c4e50f3dd9593be480c))

## [1.12.7](https://github.com/pedrofariasx/qwenproxy/compare/v1.12.6...v1.12.7) (2026-07-02)


### Исправления ошибок

* предотвращение дублирования контента в нестриминговом режиме путём отслеживания длины контента и состояния суффикса ([05a8236](https://github.com/pedrofariasx/qwenproxy/commit/05a8236e879d03ca9c02a05778cb7a92c6d2b06b))

## [1.12.6](https://github.com/pedrofariasx/qwenproxy/compare/v1.12.5...v1.12.6) (2026-07-02)


### Исправления ошибок

* восстановление некорректных вызовов инструментов с отсутствующими открывающими кавычками в значениях JSON ([9328bde](https://github.com/pedrofariasx/qwenproxy/commit/9328bde90ed66f0319e709073a4138d59e289e3d))
* восстановление некорректных вызовов инструментов с отсутствующими открывающими кавычками; добавление поддержки варианта модели -thinking; удаление загрузки больших файлов промптов; оптимизация кэша в памяти ([a63f054](https://github.com/pedrofariasx/qwenproxy/commit/a63f0544dd788b3678ebcc86b7327493496ac232))

## [1.12.5](https://github.com/pedrofariasx/qwenproxy/compare/v1.12.4...v1.12.5) (2026-07-02)


### Улучшения производительности

* оптимизация стриминга, разрешения инструментов и кэширования для длинных чатов ([cb518e0](https://github.com/pedrofariasx/qwenproxy/commit/cb518e079e945af92b7ca5e4c99a7c8e38d4eac6))

## [1.12.4](https://github.com/pedrofariasx/qwenproxy/compare/v1.12.3...v1.12.4) (2026-06-27)


### Исправления ошибок

* допустимость ошибок chown томов в swarm ([b487886](https://github.com/pedrofariasx/qwenproxy/commit/b487886b0eb86150d442a4edf5a61ff77832c08d))

## [1.12.3](https://github.com/pedrofariasx/qwenproxy/compare/v1.12.2...v1.12.3) (2026-06-27)


### Исправления ошибок

* восстановление прав доступа к Docker-томам ([07633f8](https://github.com/pedrofariasx/qwenproxy/commit/07633f85544feedc0e6d38b1965b1c2ac823cc7f))

## [1.12.2](https://github.com/pedrofariasx/qwenproxy/compare/v1.12.1...v1.12.2) (2026-06-23)


### Исправления ошибок

* улучшение парсинга вызовов инструментов редактора ([62e6fac](https://github.com/pedrofariasx/qwenproxy/commit/62e6fac754c0ccbcd1547b9ad8717c2ab1001ce1))

## [1.12.1](https://github.com/pedrofariasx/qwenproxy/compare/v1.12.0...v1.12.1) (2026-06-22)


### Исправления ошибок

* поддержка стабильной страницы для линий Qwen ([1458070](https://github.com/pedrofariasx/qwenproxy/commit/14580709e02a91c426df666307c7411bb601238c))

# [1.12.0](https://github.com/pedrofariasx/qwenproxy/compare/v1.11.0...v1.12.0) (2026-06-22)


### Новые возможности

* изоляция линий параллельности для одного аккаунта ([ba953e8](https://github.com/pedrofariasx/qwenproxy/commit/ba953e8ce17a337582f971381c257ae3d7fc1ff8))

# [1.11.0](https://github.com/pedrofariasx/qwenproxy/compare/v1.10.2...v1.11.0) (2026-06-22)


### Новые возможности

* улучшение вызовов инструментов и настроек антибота Qwen ([94f92ce](https://github.com/pedrofariasx/qwenproxy/commit/94f92cea452c3aec9ed54d45351d366f215c9410))

## [1.10.2](https://github.com/pedrofariasx/qwenproxy/compare/v1.10.1...v1.10.2) (2026-06-21)


### Исправления ошибок

* последовательная инициализация аккаунтов, валидация состояния хранилища, использование headless=new и увеличение таймаутов ([46cdcc0](https://github.com/pedrofariasx/qwenproxy/commit/46cdcc03551b7cc366a08de59fd7b28ddad96299))

## [1.10.1](https://github.com/pedrofariasx/qwenproxy/compare/v1.10.0...v1.10.1) (2026-06-21)


### Исправления ошибок

* блокировка мыши для предотвращения вмешательства session-keeper при решении капчи ([121bc01](https://github.com/pedrofariasx/qwenproxy/commit/121bc01555636e0ae5886763f8925b85cc2bda5e))

# [1.10.0](https://github.com/pedrofariasx/qwenproxy/compare/v1.9.0...v1.10.0) (2026-06-21)


### Новые возможности

* добавлен keep-alive сессии для предотвращения капчи после бездействия ([efb2183](https://github.com/pedrofariasx/qwenproxy/commit/efb2183ad3bba5c7fac497988f712f163b510c9a))

# [1.9.0](https://github.com/pedrofariasx/qwenproxy/compare/v1.8.0...v1.9.0) (2026-06-21)


### Новые возможности

* реализована продвинутая анти-обнаружение с детерминированными отпечатками и человекоподобным поведением ([f2af6d7](https://github.com/pedrofariasx/qwenproxy/commit/f2af6d70bb45faf94d8b2f1c47b52cd775c49ff3))

# [1.8.0](https://github.com/pedrofariasx/qwenproxy/compare/v1.7.3...v1.8.0) (2026-06-19)


### Исправления ошибок

* исправлены ошибки линтера в captcha-solver и тестах капчи ([5083df0](https://github.com/pedrofariasx/qwenproxy/commit/5083df00ee0afff8a90c91ac350b391d62d86b6b))


### Новые возможности

* добавлен автоматический решатель капчи Baxia и улучшен отпечаток анти-обнаружения ([7eda9bc](https://github.com/pedrofariasx/qwenproxy/commit/7eda9bca2530949d396b5f0481665a59644816b7))

## [1.7.3](https://github.com/pedrofariasx/qwenproxy/compare/v1.7.2...v1.7.3) (2026-06-18)


### Исправления ошибок

* предотвращение unhandled promise rejection в body стрим-бридж ([be6c7b8](https://github.com/pedrofariasx/qwenproxy/commit/be6c7b80b5741828ccd452ddaf116005e22a0908))

## [1.7.2](https://github.com/pedrofariasx/qwenproxy/compare/v1.7.1...v1.7.2) (2026-06-17)


### Улучшения производительности

* оптимизация настройки Docker с базовым noble, shm_size, ограничениями ресурсов и healthcheck ([f0196e2](https://github.com/pedrofariasx/qwenproxy/commit/f0196e2afb93418053ff15c4ec057b7bc7d0d1c1))

## [1.7.1](https://github.com/pedrofariasx/qwenproxy/compare/v1.7.0...v1.7.1) (2026-06-16)


### Улучшения производительности

* использование общего экземпляра браузера с изолированными контекстами для снижения потребления RAM ([6b58072](https://github.com/pedrofariasx/qwenproxy/commit/6b580724ba023e9ddeaabdf68a02a3bc68cc144d))

# [1.7.0](https://github.com/pedrofariasx/qwenproxy/compare/v1.6.4...v1.7.0) (2026-06-15)


### Новые возможности

* улучшение надёжности вызовов инструментов с большим контекстом ([dcc0ac1](https://github.com/pedrofariasx/qwenproxy/commit/dcc0ac10ff988a3c2b55d2cf689cf3cb0283c8b8))

## [1.6.4](https://github.com/pedrofariasx/qwenproxy/compare/v1.6.3...v1.6.4) (2026-06-12)


### Улучшения производительности

* все таймауты настраиваемые через env и увеличены по умолчанию для медленных соединений ([c0c486a](https://github.com/pedrofariasx/qwenproxy/commit/c0c486af46a3a65e5eb15c26268a66b038c3d764))
* повторное использование существующих неиспользуемых чатов из API перед созданием новых в прогретом пуле ([3ce801b](https://github.com/pedrofariasx/qwenproxy/commit/3ce801b181d1facfbe13a5c7dfd1aa2e6d9c90ed))

## [1.6.3](https://github.com/pedrofariasx/qwenproxy/compare/v1.6.2...v1.6.3) (2026-06-12)


### Исправления ошибок

* восстановление перехвата заголовков путём возврата к логике отправки кликом с fallback на Enter ([f994a53](https://github.com/pedrofariasx/qwenproxy/commit/f994a53ed1de17e9b8c315d9bd67efcd5e44d909))

## [1.6.2](https://github.com/pedrofariasx/qwenproxy/compare/v1.6.1...v1.6.2) (2026-06-12)


### Исправления ошибок

* восстановление надёжности перехвата заголовков путём увеличения задержек ввода/обновления ([7cd31c4](https://github.com/pedrofariasx/qwenproxy/commit/7cd31c4589558a2bcf2a1fb4b4f5c89dbe3f8790))

## [1.6.1](https://github.com/pedrofariasx/qwenproxy/compare/v1.6.0...v1.6.1) (2026-06-12)


### Улучшения производительности

* снижение вспышек латентности с прогретым пулом low-water mark и оптимизация кэша ([481f7c5](https://github.com/pedrofariasx/qwenproxy/commit/481f7c5d37061d5949f838f7ebc9003cd37c9414))

# [1.6.0](https://github.com/pedrofariasx/qwenproxy/compare/v1.5.1...v1.6.0) (2026-06-11)


### Новые возможности

* маршрутизация API-запросов через fetch браузера для реального TLS-отпечатка и укрепление скрытности ([b32d66a](https://github.com/pedrofariasx/qwenproxy/commit/b32d66a4e2929cbf383179aa282899939833bd7f))

## [1.5.1](https://github.com/pedrofariasx/qwenproxy/compare/v1.5.0...v1.5.1) (2026-06-10)


### Исправления ошибок

* предотвращение таймаута гостевого режима при отсутствии bx-ua в перехваченном запросе ([b859ae7](https://github.com/pedrofariasx/qwenproxy/commit/b859ae779ed79116bc333ef507ed96fdb44e0f2a))

# [1.5.0](https://github.com/pedrofariasx/qwenproxy/compare/v1.4.0...v1.5.0) (2026-06-10)


### Новые возможности

* добавлена переменная окружения QWEN_GUEST_MODE_ONLY для обхода ротации аккаунтов ([ea928cd](https://github.com/pedrofariasx/qwenproxy/commit/ea928cd09ab3842b211f7c2b569a189542da8b04))

# [1.4.0](https://github.com/pedrofariasx/qwenproxy/compare/v1.3.3...v1.4.0) (2026-06-10)


### Исправления ошибок

* авто-восстановление отсутствующих заголовков и валидация сессий при инициализации аккаунта ([54c9f11](https://github.com/pedrofariasx/qwenproxy/commit/54c9f112e0470297ba0c69a611f75a3fd2e05e62))
* откат gzip-сжатия запросов, допустимость опциональных ID моделей в реестре и persistence cooldown ([e756781](https://github.com/pedrofariasx/qwenproxy/commit/e75678172d429e68043dd3db96ffafd9d5a47875))


### Новые возможности

* улучшение логики cooldown аккаунтов и обработка rate-limit прогретого пула ([f9d4b9d](https://github.com/pedrofariasx/qwenproxy/commit/f9d4b9d6e6a0576afd5f648fb21db93bc5137b73))


### Улучшения производительности

* оптимизация для больших контекстов с gzip-сжатием и точной оценкой токенов ([16b57e3](https://github.com/pedrofariasx/qwenproxy/commit/16b57e3f62c0d8a1ec0eaa39da9d38f6d7077c2a))

## [1.3.3](https://github.com/pedrofariasx/qwenproxy/compare/v1.3.2...v1.3.3) (2026-06-10)


### Улучшения производительности

* удаление искусственной случайной задержки, увеличение прогретого пула, оптимизация обнаружения TMD ([5610487](https://github.com/pedrofariasx/qwenproxy/commit/5610487a0a2df3c48add8d800fb4b8de4e77f582))

## [1.3.2](https://github.com/pedrofariasx/qwenproxy/compare/v1.3.1...v1.3.2) (2026-06-10)


### Улучшения производительности

* уменьшение случайной задержки и возврат прогретого пула к облегчённым заголовкам ([1b28c07](https://github.com/pedrofariasx/qwenproxy/commit/1b28c07a30fb6b54477ed2d91772c1a5b5636278))

## [1.3.1](https://github.com/pedrofariasx/qwenproxy/compare/v1.3.0...v1.3.1) (2026-06-10)


### Исправления ошибок

* добавлены анти-обнаружение stealth, полные антифрод-заголовки и повтор попыток TMD-челленджа ([76d007f](https://github.com/pedrofariasx/qwenproxy/commit/76d007f1944501ff80c1c3f1ae9749ec82efbde2))

# [1.3.0](https://github.com/pedrofariasx/qwenproxy/compare/v1.2.3...v1.3.0) (2026-06-07)


### Исправления ошибок

* **model-registry:** замена захардкоженных моделей на данные живого API ([95e7f18](https://github.com/pedrofariasx/qwenproxy/commit/95e7f1859a1b70a34f180ae905b661a5d962771f))


### Новые возможности

* model-aware оценка токенов, динамические таймауты и надёжный парсинг JSON/tool-call ([2d41378](https://github.com/pedrofariasx/qwenproxy/commit/2d41378edad60d612b1dfb08f16bf2e95eeb5064))

## [1.2.3](https://github.com/pedrofariasx/qwenproxy/compare/v1.2.2...v1.2.3) (2026-06-06)


### Исправления ошибок

* обработка дважды экранированных кавычек и незакрытых строк в парсере вызовов инструментов ([56f091f](https://github.com/pedrofariasx/qwenproxy/commit/56f091f9ef0844ff5443dcabd2bb95d158fb89a5))
* расширение типа контента truncateMessages для приёма объектных payload ([de6f706](https://github.com/pedrofariasx/qwenproxy/commit/de6f7060cb5b3be2220260725c19e4d483ec648c))

## [1.2.2](https://github.com/pedrofariasx/qwenproxy/compare/v1.2.1...v1.2.2) (2026-06-05)


### Улучшения производительности

* снижение накладных расходов на чанк в горячем пути стриминга ([3fc85fa](https://github.com/pedrofariasx/qwenproxy/commit/3fc85fa697af782b4d260a6310b4a381aeb66a29))

## [1.2.1](https://github.com/pedrofariasx/qwenproxy/compare/v1.2.0...v1.2.1) (2026-06-05)


### Улучшения производительности

* улучшение надёжности с длинным контекстом и латентности прогретого пула ([6502bf2](https://github.com/pedrofariasx/qwenproxy/commit/6502bf26ea49880de1f7e22542db7b570bf1c34a))

# [1.2.0](https://github.com/pedrofariasx/qwenproxy/compare/v1.1.0...v1.2.0) (2026-06-04)


### Новые возможности

* улучшения мультимодальной загрузки и набор тестов ([06b9b6c](https://github.com/pedrofariasx/qwenproxy/commit/06b9b6cb5140eb064262f2867ffd7151277fcf53))

# [1.1.0](https://github.com/pedrofariasx/qwenproxy/compare/v1.0.0...v1.1.0) (2026-06-03)


### Исправления ошибок

* переименование пакета в @pedrofariasx/qwenproxy для разрешения конфликта npm ([31e0119](https://github.com/pedrofariasx/qwenproxy/commit/31e011914c278b1f9e2ec16cd12dd24a67356f1a))


### Новые возможности

* добавлена bin-точка входа для выполнения через npx ([413c2cc](https://github.com/pedrofariasx/qwenproxy/commit/413c2ccfae50dfd4252acc38374460bb6b88791a))

# [1.1.0](https://github.com/pedrofariasx/qwenproxy/compare/v1.0.0...v1.1.0) (2026-06-03)


### Новые возможности

* добавлена bin-точка входа для выполнения через npx ([413c2cc](https://github.com/pedrofariasx/qwenproxy/commit/413c2ccfae50dfd4252acc38374460bb6b88791a))

# 1.0.0 (2026-06-03)


### Исправления ошибок

* добавлены классы ошибок, фильтр мульти-ответов, stream_options, Not_Found → 404, обновление зависимостей и README ([09cfee0](https://github.com/pedrofariasx/qwenproxy/commit/09cfee0ba9da972683545ce115a30e2feae74977))
* добавлен UI-фоллбэк для входа и исправлена видимость браузера при ручном входе ([e6d2361](https://github.com/pedrofariasx/qwenproxy/commit/e6d2361ba3046782842972d8b2f7840ceb628baa))
* коррекция имени проекта на qwenproxy ([e1a6f20](https://github.com/pedrofariasx/qwenproxy/commit/e1a6f20fe3f751db68f4a0e9a0861fdba29dddaa))
* обход блокировки автоматизированного входа через Google при аутентификации ([57e9503](https://github.com/pedrofariasx/qwenproxy/commit/57e9503011cc789f1a864a0b426597b549e9e84f))
* кроссплатформенная обработка путей и парсинг стриминга ([4eeb7f7](https://github.com/pedrofariasx/qwenproxy/commit/4eeb7f7c7f7caf8f268ced09495b0924d910756a))
* фильтрация мульти-ответа по response_id и маппинг Not_Found в HTTP 404 ([e8f49c5](https://github.com/pedrofariasx/qwenproxy/commit/e8f49c5f1f082e3ea998af9ac816ac01310bce07))
* обработка гостевых сессий и ошибок вышестоящего сервера ([cb3ea5c](https://github.com/pedrofariasx/qwenproxy/commit/cb3ea5cce501d02c5021d16352d34fcdfaa9e384))
* улучшение обработки ошибок, безопасности парсинга JSON и маппинга кодов статуса ([18c5a15](https://github.com/pedrofariasx/qwenproxy/commit/18c5a151ddb672b1d13ba13a9351bbaa08b80c7f))
* улучшение обработки ошибок, парсинга JSON и логики повтора по результатам code review ([2ca0c4a](https://github.com/pedrofariasx/qwenproxy/commit/2ca0c4ae87204eef174c729065dd80271d8a1111))
* улучшение надёжности входа и обработка кодов выхода ([2e46403](https://github.com/pedrofariasx/qwenproxy/commit/2e464030e483151ee5a72866fcda42b488d42004))
* улучшение безопасности парсинга стриминга и безопасности путей ([b44c32f](https://github.com/pedrofariasx/qwenproxy/commit/b44c32f9c6343b6bd27284ffc380722f5df1a8ac))
* предварительное создание директории qwen_profiles и объявление тома для прав Docker Swarm ([38815ef](https://github.com/pedrofariasx/qwenproxy/commit/38815efa46007a65fabf974b244e9ddde5709478))
* сохранение полной истории сообщений ([0b0143b](https://github.com/pedrofariasx/qwenproxy/commit/0b0143b2fd5efdecf5b84ad62f305f05092e8229))
* переработка Dockerfile для производственной среды Playwright ([340efaf](https://github.com/pedrofariasx/qwenproxy/commit/340efaf6406bd519c53de2495aa284a2e8905cff))
* надёжный парсинг некорректных последовательностей обратного слэша в JSON ([86ea3f1](https://github.com/pedrofariasx/qwenproxy/commit/86ea3f13810fd20940dd00a7bea6f806c5131853))
* обновление CI release job до Node 22 для совместимости с semantic-release ([9fc03d5](https://github.com/pedrofariasx/qwenproxy/commit/9fc03d50d3b017f24574adf3d17da6dcf501783d))


### Новые возможности

* добавлена мультимодальная поддержка и оптимизация кэширования заголовков загрузки ([947d7fe](https://github.com/pedrofariasx/qwenproxy/commit/947d7fe5839953baa6bff913bdadb1e9874929ed))
* добавлено логирование маршрутов, видимость сети и поддержка нескольких браузеров ([aa277ce](https://github.com/pedrofariasx/qwenproxy/commit/aa277ce1c8fc8b943f4a7a7fc64bcdeaecb7a295))
* реализован автоматический вход и восстановление сессий ([700ca06](https://github.com/pedrofariasx/qwenproxy/commit/700ca061ca931a1ad655e214e17d1e5db9182f20))
* реализован надёжный парсинг JSON для вызовов инструментов и улучшение стабильности стриминга ([e0f8664](https://github.com/pedrofariasx/qwenproxy/commit/e0f866444b7ff58334f5c3c58c7d2bc7d7c7df1e))
* реализована надёжная валидация и пайплайн выполнения инструментов, исправлены расширения импортов, добавлен ajv ([d4f3aa2](https://github.com/pedrofariasx/qwenproxy/commit/d4f3aa2ab69bcbdc9070d1809731a269846e5e69))
* улучшена совместимость с OpenAI и надёжный парсинг JSON ([7eb8699](https://github.com/pedrofariasx/qwenproxy/commit/7eb86996b50868d7c7a60ec563441eb154561cff))
* улучшен парсинг вызовов инструментов и объединены тесты ([7e3b92e](https://github.com/pedrofariasx/qwenproxy/commit/7e3b92ec1ea3c0f1957e090cb16fe56e01919f4a))
* интегрирован прогретый пул для быстрой инициализации чатов Qwen и предварительной загрузки заголовков ([9499a4b](https://github.com/pedrofariasx/qwenproxy/commit/9499a4b0a31dfb1c0a4fa6948629827bc54beec8))
* миграция хранения аккаунтов из JSON в SQLite с режимом WAL ([5905908](https://github.com/pedrofariasx/qwenproxy/commit/59059083c632a9252d40091d6fa0e25f2c886bc3))
* возвращён uuid для вызовов инструментов и добавлен cloudflare heartbeat ([9b2f31c](https://github.com/pedrofariasx/qwenproxy/commit/9b2f31c088a8ea9e272ebde2f3e354dbdb40fdba))
* поддержка нескольких вызовов инструментов в формате массива ([22c3664](https://github.com/pedrofariasx/qwenproxy/commit/22c366478440de2e29d4db1aed46b66101eec0ae))


### Улучшения производительности

* оптимизация эндпоинта моделей с сессиями аккаунтов и кэшированием, улучшение латентности SSE ([44a0a34](https://github.com/pedrofariasx/qwenproxy/commit/44a0a343a0313f6bd34a2983797134031ad6d022))
* оптимизация скорости и надёжности ответов ([0c0246c](https://github.com/pedrofariasx/qwenproxy/commit/0c0246ccbd75d15e23cc8d6ec82cee6ea726110c))
