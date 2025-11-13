# 🔐 Полная настройка OAuth для Google Calendar

## 📋 Текущее состояние:

✅ API ключ есть: `AIzaSyCofZeJbWUPaub7L_Z34Orx85jnvd7EEmA`  
❌ OAuth Client ID и Secret - **НЕТ**

**Нужно:** Добавить OAuth credentials для доступа к личному календарю!

---

## 🚀 Пошаговая настройка OAuth:

### **Шаг 1: Создать OAuth 2.0 Client ID в Google Cloud Console**

1. **Откройте:**
   https://console.cloud.google.com/apis/credentials

2. **Нажмите "+ CREATE CREDENTIALS"** (вверху)

3. **Выберите "OAuth client ID"**

4. **Настройте OAuth consent screen** (если попросит):
   - Нажмите "CONFIGURE CONSENT SCREEN"
   - User Type: **External** (для тестирования)
   - Нажмите **"CREATE"**
   
   **Заполните форму:**
   - App name: `Martin AI Assistant`
   - User support email: `ваш email`
   - Developer contact: `ваш email`
   - Нажмите **"SAVE AND CONTINUE"**
   
   **Scopes (второй экран):**
   - Нажмите **"ADD OR REMOVE SCOPES"**
   - Найдите и добавьте:
     - `https://www.googleapis.com/auth/calendar.readonly`
     - `https://www.googleapis.com/auth/calendar.events`
     - `https://www.googleapis.com/auth/gmail.readonly`
     - `https://www.googleapis.com/auth/userinfo.email`
     - `https://www.googleapis.com/auth/userinfo.profile`
   - Нажмите **"UPDATE"**
   - Нажмите **"SAVE AND CONTINUE"**
   
   **Test users (третий экран):**
   - Нажмите **"ADD USERS"**
   - Добавьте свой Gmail аккаунт
   - Нажмите **"ADD"**
   - Нажмите **"SAVE AND CONTINUE"**
   
   **Summary:**
   - Нажмите **"BACK TO DASHBOARD"**

5. **Вернитесь к Credentials:**
   https://console.cloud.google.com/apis/credentials

6. **Снова "+ CREATE CREDENTIALS" → "OAuth client ID"**

7. **Выберите Application type:**
   - **"Web application"**

8. **Настройте:**
   - Name: `Martin AI Web Client`
   - **Authorized redirect URIs:** нажмите "+ ADD URI"
   - Добавьте: `http://localhost:3001/api/auth/callback`
   - Нажмите **"CREATE"**

9. **Скопируйте:**
   - **Client ID** (выглядит как: `123456789.apps.googleusercontent.com`)
   - **Client secret** (выглядит как: `GOCSPX-abcdefg...`)

---

### **Шаг 2: Добавить в .env.local**

Откройте файл `.env.local` и добавьте:

```env
# Google Calendar API Key (уже есть)
NEXT_PUBLIC_GOOGLE_CALENDAR_API_KEY=AIzaSyCofZeJbWUPaub7L_Z34Orx85jnvd7EEmA

# Google OAuth (ДОБАВЬТЕ ЭТО)
GOOGLE_CLIENT_ID=ваш-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-ваш-client-secret
NEXT_PUBLIC_REDIRECT_URI=http://localhost:3001/api/auth/callback
```

**Замените:**
- `ваш-client-id.apps.googleusercontent.com` → ваш настоящий Client ID
- `GOCSPX-ваш-client-secret` → ваш настоящий Client Secret

---

### **Шаг 3: Создать API route для callback**

Файл уже должен существовать, но если нет - создам его сейчас.

---

### **Шаг 4: Перезапустить сервер**

```bash
npm run dev
```

---

### **Шаг 5: Подключить аккаунт в приложении**

1. Откройте приложение
2. Нажмите на иконку **Settings** (⚙️) в Header
3. Нажмите **"Подключить Google"**
4. Откроется окно Google авторизации
5. Войдите в свой аккаунт
6. Разрешите доступ к календарю
7. Окно закроется автоматически
8. Появится ✓ **"Подключено"**

---

### **Шаг 6: Проверить календарь**

1. Нажмите кнопку **"Календарь"** внизу
2. Теперь должны загрузиться **РЕАЛЬНЫЕ** события из вашего Google Calendar!

---

## ✅ Что будет работать после настройки:

✅ Просмотр всех событий из вашего личного календаря  
✅ Создание новых событий  
✅ AI команды: "Покажи мой календарь", "Какие события завтра?"  
✅ Работа с Gmail (почта)  

---

## 🆘 Возможные проблемы:

### **1. "This app isn't verified"**
Это нормально для тестирования!
- Нажмите **"Advanced"**
- Нажмите **"Go to Martin AI Assistant (unsafe)"**
- Это безопасно, т.к. это ваше собственное приложение

### **2. Ошибка redirect_uri_mismatch**
- Проверьте что в Google Cloud Console добавлен точный URI: `http://localhost:3001/api/auth/callback`
- Порт должен совпадать (3001)

### **3. Токен не сохраняется**
- Проверьте что окно OAuth не блокируется popup blocker
- Разрешите popups для localhost

---

## 📝 Краткая версия (если спешите):

```bash
1. https://console.cloud.google.com/apis/credentials
2. "+ CREATE CREDENTIALS" → "OAuth client ID"
3. Application type: "Web application"
4. Authorized redirect URIs: http://localhost:3001/api/auth/callback
5. Скопировать Client ID и Client Secret
6. Добавить в .env.local:
   GOOGLE_CLIENT_ID=...
   GOOGLE_CLIENT_SECRET=...
   NEXT_PUBLIC_REDIRECT_URI=http://localhost:3001/api/auth/callback
7. npm run dev
8. Settings → Подключить Google
```

---

**Готовы? Начнем с Шага 1!** 🚀




