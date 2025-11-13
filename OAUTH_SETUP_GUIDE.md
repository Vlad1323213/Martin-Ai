# Руководство по настройке OAuth для Gmail и Yandex

## 1. Google OAuth (Gmail + Calendar)

### Шаг 1: Создание проекта в Google Cloud Console

1. Перейдите на https://console.cloud.google.com/
2. Создайте новый проект или выберите существующий
3. Перейдите в **APIs & Services** → **Credentials**

### Шаг 2: Настройка OAuth consent screen

1. Нажмите **OAuth consent screen**
2. Выберите **External** (для тестирования)
3. Заполните:
   - App name: "Martin AI Assistant"
   - User support email: ваш email
   - Developer contact: ваш email
4. Нажмите **Save and Continue**
5. В **Scopes** добавьте:
   - `https://www.googleapis.com/auth/gmail.readonly`
   - `https://www.googleapis.com/auth/gmail.send`
   - `https://www.googleapis.com/auth/calendar.readonly`
   - `https://www.googleapis.com/auth/calendar.events`
6. Нажмите **Save and Continue**

### Шаг 3: Создание OAuth Client ID

1. Вернитесь в **Credentials**
2. Нажмите **Create Credentials** → **OAuth client ID**
3. Выберите **Web application**
4. Добавьте:
   - **Authorized JavaScript origins**: `http://localhost:3001`
   - **Authorized redirect URIs**: `http://localhost:3001/api/auth/google/callback`
5. Нажмите **Create**
6. Скопируйте **Client ID** и **Client Secret**

### Шаг 4: Включение API

1. Перейдите в **APIs & Services** → **Library**
2. Найдите и включите:
   - **Gmail API**
   - **Google Calendar API**

---

## 2. Yandex OAuth (Почта + Календарь)

### Шаг 1: Регистрация приложения

1. Перейдите на https://oauth.yandex.ru/
2. Нажмите **Зарегистрировать новое приложение**
3. Заполните:
   - Название: "Martin AI Assistant"
   - Описание: "AI ассистент для работы с почтой и календарем"
   - Платформы: выберите **Веб-сервисы**

### Шаг 2: Настройка прав доступа

1. В разделе **Доступы** выберите:
   - ✅ Доступ к почте (mail:imap_full, mail:send)
   - ✅ Доступ к Яндекс.Календарю (calendar:read, calendar:write)
2. **Callback URI**: `http://localhost:3001/api/auth/yandex/callback`

### Шаг 3: Получение ключей

1. После создания приложения вы получите:
   - **ID приложения** (Client ID)
   - **Пароль приложения** (Client Secret)
2. Скопируйте их в `.env.local`

---

## 3. Настройка проекта

### Создайте файл `.env.local`:

```env
# Скопируйте из .env.local.example
GOOGLE_CLIENT_ID=ваш_google_client_id
GOOGLE_CLIENT_SECRET=ваш_google_secret

YANDEX_CLIENT_ID=ваш_yandex_id
YANDEX_CLIENT_SECRET=ваш_yandex_secret

NEXTAUTH_SECRET=$(openssl rand -base64 32)
NEXTAUTH_URL=http://localhost:3001
```

### Установите зависимости:

```bash
npm install next-auth googleapis nodemailer imap
```

---

## 4. Тестирование

1. Запустите проект: `npm run dev`
2. Откройте настройки в приложении
3. Нажмите "Подключить Google" или "Подключить Yandex"
4. Разрешите доступ к почте и календарю
5. Готово! Теперь AI может работать с вашими данными

---

## Важные замечания

- **Безопасность**: Токены пользователей должны храниться в зашифрованном виде
- **Для production**: Нужно пройти верификацию в Google (Google Verification)
- **Rate limits**: У API есть ограничения на количество запросов
- **Токены истекают**: Нужно обновлять refresh tokens

---

## Полезные ссылки

- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Gmail API Documentation](https://developers.google.com/gmail/api)
- [Google Calendar API](https://developers.google.com/calendar)
- [Yandex OAuth Documentation](https://yandex.ru/dev/oauth/)
- [Yandex Mail API](https://yandex.ru/dev/mail/)




