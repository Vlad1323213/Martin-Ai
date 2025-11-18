# Настройка Google OAuth для Mortis AI

## Шаг 1: Создание проекта в Google Cloud Console

1. Перейдите на https://console.cloud.google.com/
2. Создайте новый проект или выберите существующий
3. Назовите проект "Mortis AI" или как вам удобно

## Шаг 2: Включение необходимых API

В Google Cloud Console включите следующие API:
1. Gmail API
2. Google Calendar API
3. Google+ API (для авторизации)

Для этого:
- Перейдите в "APIs & Services" → "Enable APIs and Services"
- Найдите и включите каждый API

## Шаг 3: Создание OAuth 2.0 учетных данных

1. Перейдите в "APIs & Services" → "Credentials"
2. Нажмите "Create Credentials" → "OAuth client ID"
3. Если требуется, настройте OAuth consent screen:
   - User Type: External
   - App name: Mortis AI
   - User support email: ваш email
   - Developer contact: ваш email
   - Scopes: добавьте:
     - email
     - profile
     - https://www.googleapis.com/auth/gmail.readonly
     - https://www.googleapis.com/auth/calendar.events

4. Создайте OAuth client:
   - Application type: Web application
   - Name: Mortis AI Web Client
   - Authorized JavaScript origins:
     - http://localhost:3000
     - https://your-app.vercel.app
   - Authorized redirect URIs:
     - http://localhost:3000/api/auth/google/callback
     - https://your-app.vercel.app/api/auth/google/callback

5. Скопируйте:
   - Client ID
   - Client Secret

## Шаг 4: Добавление переменных окружения

### Локально (для разработки):
Создайте файл `.env.local` в корне проекта:
```
NEXT_PUBLIC_GOOGLE_CLIENT_ID=ваш_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=ваш_client_secret
```

### На Vercel (для продакшена):
1. Перейдите в настройки проекта на Vercel
2. Перейдите в "Settings" → "Environment Variables"
3. Добавьте:
   - `NEXT_PUBLIC_GOOGLE_CLIENT_ID` = ваш Client ID
   - `GOOGLE_CLIENT_SECRET` = ваш Client Secret
   - `OPENAI_API_KEY` = ваш OpenAI ключ (опционально)

## Шаг 5: Обновление кода

Убедитесь, что в файле `app/settings/page.tsx` используется правильный Client ID из переменных окружения.

## Важные замечания:

1. **Тестовые пользователи**: Пока приложение в тестовом режиме, добавьте тестовых пользователей в OAuth consent screen
2. **Верификация**: Для продакшена потребуется верификация приложения Google
3. **Безопасность**: НИКОГДА не коммитьте реальные ключи в Git
4. **Redirect URI**: Убедитесь, что redirect URI точно совпадают с настройками в Google Console

## Проверка:

После настройки попробуйте:
1. Перейти в профиль
2. Нажать "Подключить Google"
3. Пройти авторизацию
4. Проверить, что токены сохранились

## Если ошибка сохраняется:

1. Проверьте, что Client ID правильный
2. Проверьте Authorized redirect URIs
3. Убедитесь, что API включены
4. Проверьте логи в консоли браузера
