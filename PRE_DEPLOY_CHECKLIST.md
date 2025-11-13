# ✅ Pre-Deploy Checklist

Проверьте всё перед деплоем на Vercel!

---

## 📦 Код

- [x] `@vercel/kv` установлен (`package.json`)
- [x] `token-storage.ts` использует Vercel KV
- [x] Все вызовы `getTokens`, `saveTokens` с `await`
- [x] `.gitignore` содержит `.env*.local`
- [x] `vercel.json` создан
- [ ] `npm run build` проходит без ошибок
- [ ] Нет TypeScript ошибок

---

## 🔑 Google Cloud Console

- [ ] Gmail API включен
- [ ] Google Calendar API включен
- [ ] OAuth Consent Screen настроен
- [ ] Test Users добавлены (ваш email)
- [ ] OAuth Client ID создан
- [ ] API Key создан (для Calendar)
- [ ] Локальные URIs добавлены:
  - `http://localhost:3001`
  - `http://localhost:3001/api/auth/google/callback`

---

## 📝 Локальные переменные окружения (`.env.local`)

- [ ] `GOOGLE_CLIENT_ID`
- [ ] `GOOGLE_CLIENT_SECRET`
- [ ] `GOOGLE_REDIRECT_URI=http://localhost:3001/api/auth/google/callback`
- [ ] `NEXT_PUBLIC_GOOGLE_CALENDAR_API_KEY`

---

## 🐙 GitHub

- [ ] Репозиторий создан на GitHub
- [ ] Код запушен в `main` branch

```bash
git init
git add .
git commit -m "Ready for Vercel deployment"
git branch -M main
git remote add origin https://github.com/ваш-юзернейм/martin-ai.git
git push -u origin main
```

---

## ☁️ Vercel (после деплоя)

### 1. Environment Variables

- [ ] `GOOGLE_CLIENT_ID`
- [ ] `GOOGLE_CLIENT_SECRET`
- [ ] `GOOGLE_REDIRECT_URI=https://ваш-домен.vercel.app/api/auth/google/callback`
- [ ] `NEXT_PUBLIC_GOOGLE_CALENDAR_API_KEY`

### 2. Vercel KV

- [ ] KV база создана
- [ ] KV подключена к проекту
- [ ] Переменные автоматически добавлены:
  - `KV_REST_API_URL`
  - `KV_REST_API_TOKEN`
  - `KV_URL`

### 3. Google Cloud Console (обновить для Vercel)

- [ ] Добавлен Vercel домен в Authorized JavaScript origins:
  - `https://ваш-домен.vercel.app`
- [ ] Добавлен Vercel URI в Authorized redirect URIs:
  - `https://ваш-домен.vercel.app/api/auth/google/callback`
- [ ] Подождали 5-10 минут для применения

### 4. Redeploy

- [ ] После настройки KV и переменных сделан Redeploy

---

## 📱 Telegram

- [ ] Бот создан через @BotFather
- [ ] Menu Button URL обновлён на Vercel домен
- [ ] Web App URL настроен

---

## 🧪 Тестирование Production

- [ ] Приложение открывается: `https://ваш-домен.vercel.app`
- [ ] Нет 404 ошибок
- [ ] OAuth работает (Settings → Подключить Google)
- [ ] В логах Vercel: `✅ Tokens saved to KV` (НЕ "to memory"!)
- [ ] Календарь загружается
- [ ] Почта загружается
- [ ] Приложение работает в Telegram

---

## 🐛 Если что-то не работает

### Build Failed

```bash
# Локально проверьте сборку
npm run build

# Если есть ошибки - исправьте их
# Затем:
git add .
git commit -m "Fix build errors"
git push
```

### OAuth не работает

1. Проверьте что `GOOGLE_REDIRECT_URI` **ТОЧНО** совпадает с Google Cloud Console
2. Нет пробелов в начале/конце URL
3. Подождите 5-10 минут
4. Очистите Build Cache в Vercel
5. Redeploy

### Токены не сохраняются (показывает "not connected")

1. Проверьте что KV база создана: **Vercel Dashboard → Storage**
2. Проверьте что KV подключена к проекту
3. Проверьте логи Vercel:
   - ✅ Должно быть: `Tokens saved to KV`
   - ❌ НЕ должно быть: `Tokens saved to memory`
4. Если видите "memory" - KV не настроен, вернитесь к шагу 2

### "Failed to fetch" или CORS ошибки

- Проверьте что переменные окружения сохранены
- Redeploy после изменения переменных

---

## 📊 Мониторинг после деплоя

### Проверьте логи

```
Vercel Dashboard → Deployments → Ваш деплой → Logs
```

Должны видеть:
```
✅ Tokens saved to KV for user 123 (google)
✅ Tokens retrieved from KV for user 123 (google)
```

### Проверьте KV

```
Vercel Dashboard → Storage → Ваша KV база → Data
```

После подключения Google должны появиться ключи:
```
tokens:123:google
```

---

## 🎉 Всё работает?

Отлично! Теперь можете:

1. Добавить custom domain (Settings → Domains)
2. Настроить Analytics (Analytics → Enable)
3. Добавить Sentry для мониторинга ошибок
4. Настроить CI/CD (GitHub Actions)

---

📖 **Подробная инструкция:** [`DEPLOY.md`](./DEPLOY.md)

🚀 **Быстрый старт:** [`QUICKSTART_VERCEL.md`](./QUICKSTART_VERCEL.md)


