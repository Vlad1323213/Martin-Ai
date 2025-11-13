# 🌐 Настройка Google OAuth с туннелем

## Ваш туннель URL:
```
https://pink-cities-relate.loca.lt
```

---

## 📝 Шаг 1: Добавьте URL в Google Cloud Console

### Откройте:
https://console.cloud.google.com/apis/credentials

### Найдите ваш OAuth 2.0 Client ID:
`Web client 1` или `Martin AI Web` → нажмите ✏️ (редактировать)

---

## 📋 Скопируйте и вставьте ЭТИ значения:

### **Authorized JavaScript origins (Авторизованные источники JavaScript):**

Нажмите **"+ ADD URI"**

Вставьте **ОБА** URL (по одному в каждое поле):

**URI 1:**
```
https://pink-cities-relate.loca.lt
```

**URI 2:** (оставьте для локальной разработки)
```
http://localhost:3001
```

---

### **Authorized redirect URIs (Авторизованные URI перенаправления):**

Нажмите **"+ ADD URI"**

Вставьте **ОБА** URL:

**URI 1:**
```
https://pink-cities-relate.loca.lt/api/auth/google/callback
```

**URI 2:** (оставьте для локальной разработки)
```
http://localhost:3001/api/auth/google/callback
```

---

## ✅ Должно выглядеть так:

**Authorized JavaScript origins:**
- `https://pink-cities-relate.loca.lt` ✓
- `http://localhost:3001` ✓

**Authorized redirect URIs:**
- `https://pink-cities-relate.loca.lt/api/auth/google/callback` ✓
- `http://localhost:3001/api/auth/google/callback` ✓

**Нажмите SAVE внизу!**

---

## 📱 Шаг 2: Обновите URL в Telegram Bot

### Откройте BotFather в Telegram:

1. Найдите вашего бота
2. Команда: `/setmenubutton`
3. Выберите вашего бота
4. **Web App URL:**
```
https://pink-cities-relate.loca.lt
```

Или используйте команду `/newapp` если настраиваете впервые.

---

## 🔄 Шаг 3: Перезапустите сервер

```bash
# Остановите npm run dev (Ctrl+C)
npm run dev
```

---

## 🚀 Шаг 4: Проверьте!

1. **Откройте Mini App через Telegram** (по новому URL)
2. **Settings** (⚙️) → **Подключить Google**
3. Откроется браузер → вход в Google
4. Разрешите доступ
5. ✓ Подключение успешно!
6. Вернитесь в Telegram
7. Settings → должна быть ✅ "Подключено"

---

## ⚠️ Важно:

- Localtunnel URL **меняется** при каждом перезапуске `npx localtunnel`
- Каждый раз нужно **обновлять** Google OAuth и Bot URL
- Для постоянного URL используйте **Vercel** или **ngrok** (платный)

---

## 🎯 Краткая версия для копирования:

**В Google OAuth добавьте:**

JavaScript origins:
```
https://pink-cities-relate.loca.lt
```

Redirect URIs:
```
https://pink-cities-relate.loca.lt/api/auth/google/callback
```

**В Telegram Bot URL:**
```
https://pink-cities-relate.loca.lt
```

**Готово!** 🎉




