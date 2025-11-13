# 🌐 Настройка для работы через туннель (телефон)

## Проблема:
`localhost:3001` недоступен с телефона → `ERR_CONNECTION_REFUSED`

## Решение: Использовать локальный туннель

### Шаг 1: Запустите localtunnel

```bash
npx localtunnel --port 3001
```

Получите URL, например: `https://sharp-dogs-walk.loca.lt`

### Шаг 2: Google Cloud Console

https://console.cloud.google.com/apis/credentials

Ваш OAuth Client → Edit:

**Authorized JavaScript origins:**
```
https://ваш-url.loca.lt
http://localhost:3001
```

**Authorized redirect URIs:**
```
https://ваш-url.loca.lt/api/auth/google/callback
http://localhost:3001/api/auth/google/callback
```

Сохраните!

### Шаг 3: Обновите .env.local

Добавьте:
```env
NEXT_PUBLIC_GOOGLE_CALENDAR_API_KEY=AIzaSyCofZeJbWUPaub7L_Z34Orx85jnvd7EEmA

GOOGLE_CLIENT_ID=350876804363-9uhdtvjmc1fio9cvpve290p5m3uhirtt.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
GOOGLE_REDIRECT_URI=https://ваш-url.loca.lt/api/auth/google/callback

# Публичный URL для Telegram
NEXT_PUBLIC_APP_URL=https://ваш-url.loca.lt
```

Замените `ваш-url.loca.lt` на реальный URL!

### Шаг 4: Перезапустите сервер

```bash
npm run dev
```

### Шаг 5: Откройте Mini App через туннель

В Telegram Bot → установите URL:
```
https://ваш-url.loca.lt
```

### Шаг 6: Попробуйте подключить Google

Settings → Подключить Google → Теперь должно работать!

---

## 💡 Важно:

1. **Localtunnel URL меняется** при каждом запуске
2. Нужно обновлять Google OAuth каждый раз
3. Для production используйте постоянный хостинг (Vercel)

## 🚀 Альтернатива (постоянный URL):

### Используйте ngrok (платный, но постоянный URL):

```bash
ngrok http 3001
```

Или опубликуйте на **Vercel** (бесплатно, постоянный URL).




