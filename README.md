# 🤖 Martin AI - Telegram AI Assistant

Интеллектуальный AI-ассистент для Telegram с интеграцией Google Calendar и Gmail.

![Next.js](https://img.shields.io/badge/Next.js-15.0-black)
![React](https://img.shields.io/badge/React-19.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black)

---

## ✨ Возможности

- 🗓️ **Google Calendar** - Просмотр и управление событиями
- 📧 **Gmail** - Проверка и управление почтой
- 💬 **AI-парсинг команд** - Понимает естественный язык
- 🎨 **Красивый UI** - Современный дизайн с анимациями
- 📱 **Telegram Mini App** - Работает прямо в Telegram
- 🔐 **OAuth 2.0** - Безопасная авторизация
- ⚡ **Serverless** - Развёрнут на Vercel

---

## 🚀 Быстрый деплой на Vercel

### 1. Клонируйте и пушните в GitHub

```bash
git clone <your-repo>
cd martin-ai
git push
```

### 2. Импортируйте в Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### 3. Настройте переменные окружения

См. `env.example.txt` для всех переменных.

### 4. Создайте Vercel KV базу

**Storage → Create Database → KV → Connect to Project**

⚠️ **Обязательно!** Без KV токены не будут сохраняться!

### 5. Обновите Google Cloud Console

Добавьте ваш Vercel домен в:
- Авторизованные источники JavaScript
- Авторизованные URI перенаправления

📖 **Полная инструкция:** [`QUICKSTART_VERCEL.md`](./QUICKSTART_VERCEL.md)

---

## 🛠️ Локальная разработка

### Установка

```bash
npm install
```

### Настройка `.env.local`

Скопируйте `env.example.txt` в `.env.local` и заполните:

```env
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REDIRECT_URI=http://localhost:3001/api/auth/google/callback
NEXT_PUBLIC_GOOGLE_CALENDAR_API_KEY=...
```

### Запуск

```bash
npm run dev
```

Откройте http://localhost:3001

---

## 📁 Структура проекта

```
martin-ai/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── auth/         # OAuth endpoints
│   │   ├── calendar/     # Calendar API
│   │   ├── emails/       # Email API
│   │   └── tokens/       # Token management
│   ├── calendar/         # Calendar page
│   └── page.tsx          # Main chat page
├── components/            # React components
│   ├── icons/            # Custom SVG icons
│   ├── ChatMessage.tsx   # Message bubble
│   ├── Drawer.tsx        # Side drawer
│   ├── Header.tsx        # App header
│   ├── InputBar.tsx      # Message input
│   └── SettingsModal.tsx # Settings modal
├── lib/                   # Utilities
│   ├── ai-parser.ts      # Command parsing
│   ├── gmail.ts          # Gmail API
│   ├── google-calendar.ts # Calendar API
│   ├── oauth.ts          # OAuth helpers
│   └── token-storage.ts  # Token storage (KV)
└── hooks/                # Custom React hooks
    └── useTelegram.ts    # Telegram WebApp hook
```

---

## 🔑 Настройка Google Cloud

### 1. Создайте проект

https://console.cloud.google.com/

### 2. Включите APIs

- Gmail API
- Google Calendar API

### 3. Настройте OAuth Consent Screen

- User Type: **External**
- Test Users: Добавьте ваш email

### 4. Создайте OAuth 2.0 Client ID

- Application Type: **Web application**
- Authorized JavaScript origins: 
  - `http://localhost:3001`
  - `https://ваш-домен.vercel.app`
- Authorized redirect URIs:
  - `http://localhost:3001/api/auth/google/callback`
  - `https://ваш-домен.vercel.app/api/auth/google/callback`

### 5. Создайте API Key

- APIs & Services → Credentials → Create Credentials → API Key
- Restrict key: Google Calendar API

---

## 📱 Настройка Telegram Bot

### 1. Создайте бота через [@BotFather](https://t.me/botfather)

```
/newbot
```

### 2. Настройте Menu Button

```
/mybots → Ваш бот → Bot Settings → Menu Button
```

URL: `https://ваш-домен.vercel.app`

### 3. Включите Web App

```
Bot Settings → Web App
```

---

## 🧪 Тестирование

### Локально

```bash
npm run build
npm start
```

### На Vercel

1. Проверьте логи: **Vercel Dashboard → Deployments → Logs**
2. Проверьте KV: Должно быть `✅ Tokens saved to KV` (не "to memory")
3. Проверьте OAuth: Settings → Подключить Google

---

## 📚 Документация

- [`DEPLOY.md`](./DEPLOY.md) - Подробная инструкция по деплою
- [`QUICKSTART_VERCEL.md`](./QUICKSTART_VERCEL.md) - Быстрый старт на Vercel
- [`QUICKSTART.md`](./QUICKSTART.md) - Общая документация проекта

---

## 🔧 Технологии

- **Frontend:** Next.js 15, React 19, TypeScript
- **Styling:** Tailwind CSS, CSS Animations
- **Backend:** Next.js API Routes
- **Database:** Vercel KV (Redis)
- **Hosting:** Vercel
- **Auth:** OAuth 2.0 (Google)
- **APIs:** Gmail API, Google Calendar API

---

## 🐛 Troubleshooting

### Ошибка: "redirect_uri_mismatch"

**Причина:** URL в `.env` не совпадает с Google Cloud Console

**Решение:**
1. Проверьте URL (без пробелов!)
2. Подождите 5-10 минут
3. Очистите кэш браузера

### Токены не сохраняются

**Причина:** KV база не подключена

**Решение:**
1. Создайте KV базу в Vercel
2. Подключите к проекту
3. Redeploy

### OAuth не работает в Telegram

**Причина:** WebView блокирует popups

**Решение:**
- Приложение автоматически открывает OAuth в **внешнем браузере**
- После авторизации нажмите "Вернуться в Telegram"

---

## 📝 Roadmap

- [ ] Yandex Mail интеграция
- [ ] Отправка email
- [ ] Создание событий в календаре
- [ ] Push-уведомления
- [ ] История чата (персистентность)
- [ ] Голосовой ввод
- [ ] Мультиязычность

---

## 📄 License

MIT

---

## 👤 Author

Martin AI Team

---

## 🙏 Credits

- [Next.js](https://nextjs.org/)
- [Vercel](https://vercel.com/)
- [Google APIs](https://developers.google.com/)
- [Telegram](https://core.telegram.org/bots/webapps)

---

🎉 **Готово к деплою!**
