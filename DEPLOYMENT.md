# 🚀 Руководство по развертыванию

## Развертывание на Vercel (Рекомендуется)

### Метод 1: Через GitHub

1. Создайте репозиторий на GitHub и загрузите код:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/telegram-ai-agent.git
git push -u origin main
```

2. Перейдите на [Vercel](https://vercel.com) и войдите
3. Нажмите "Add New Project"
4. Импортируйте ваш GitHub репозиторий
5. Настройте переменные окружения (см. ниже)
6. Нажмите "Deploy"

### Метод 2: Через Vercel CLI

1. Установите Vercel CLI:
```bash
npm install -g vercel
```

2. Войдите в аккаунт:
```bash
vercel login
```

3. Деплой:
```bash
vercel
```

4. Для продакшен деплоя:
```bash
vercel --prod
```

### Переменные окружения для Vercel

В настройках проекта на Vercel добавьте:

```
TELEGRAM_BOT_TOKEN=your_bot_token
OPENAI_API_KEY=your_openai_key (опционально)
GOOGLE_CLIENT_ID=your_google_client_id (опционально)
GOOGLE_CLIENT_SECRET=your_google_client_secret (опционально)
```

---

## Развертывание на Netlify

1. Установите Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Соберите проект:
```bash
npm run build
```

3. Деплой:
```bash
netlify deploy --prod
```

**Важно:** Для Next.js на Netlify используйте плагин:
```bash
npm install -D @netlify/plugin-nextjs
```

Создайте `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

---

## Развертывание на Railway

1. Создайте аккаунт на [Railway](https://railway.app)
2. Установите Railway CLI:
```bash
npm install -g @railway/cli
```

3. Войдите:
```bash
railway login
```

4. Инициализируйте проект:
```bash
railway init
```

5. Деплой:
```bash
railway up
```

6. Добавьте переменные окружения в Railway Dashboard

---

## Развертывание на AWS Amplify

1. Установите Amplify CLI:
```bash
npm install -g @aws-amplify/cli
```

2. Настройте Amplify:
```bash
amplify configure
```

3. Инициализируйте проект:
```bash
amplify init
```

4. Добавьте хостинг:
```bash
amplify add hosting
```

5. Опубликуйте:
```bash
amplify publish
```

---

## Развертывание на DigitalOcean App Platform

1. Создайте аккаунт на [DigitalOcean](https://www.digitalocean.com)
2. Перейдите в App Platform
3. Нажмите "Create App"
4. Подключите GitHub репозиторий
5. Выберите ветку для деплоя
6. Настройте build и run команды:
   - Build: `npm run build`
   - Run: `npm start`
7. Добавьте переменные окружения
8. Нажмите "Create Resources"

---

## Развертывание на собственном сервере (VPS)

### Требования
- Node.js 18+
- PM2 для управления процессами
- Nginx для reverse proxy
- SSL сертификат (Let's Encrypt)

### Шаги

1. Подключитесь к серверу:
```bash
ssh user@your-server-ip
```

2. Установите Node.js:
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

3. Установите PM2:
```bash
sudo npm install -g pm2
```

4. Клонируйте репозиторий:
```bash
git clone https://github.com/YOUR_USERNAME/telegram-ai-agent.git
cd telegram-ai-agent
```

5. Установите зависимости:
```bash
npm install
```

6. Создайте `.env.local`:
```bash
nano .env.local
```

Добавьте переменные окружения

7. Соберите проект:
```bash
npm run build
```

8. Запустите с PM2:
```bash
pm2 start npm --name "telegram-ai-agent" -- start
pm2 save
pm2 startup
```

9. Настройте Nginx:
```bash
sudo nano /etc/nginx/sites-available/telegram-ai-agent
```

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

10. Включите конфигурацию:
```bash
sudo ln -s /etc/nginx/sites-available/telegram-ai-agent /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

11. Установите SSL с Let's Encrypt:
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## Docker развертывание

### Создайте Dockerfile:

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

### Создайте docker-compose.yml:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - TELEGRAM_BOT_TOKEN=${TELEGRAM_BOT_TOKEN}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    restart: unless-stopped
```

### Запустите:

```bash
docker-compose up -d
```

---

## После развертывания

### 1. Настройте Telegram бота

Обновите Web App URL в BotFather:
```
/mybots -> ваш бот -> Bot Settings -> Menu Button -> Edit Web App URL
```

Введите ваш production URL (обязательно HTTPS)

### 2. Проверьте работу

1. Откройте бота в Telegram
2. Нажмите кнопку Menu или отправьте команду
3. Проверьте открытие Mini App
4. Протестируйте все функции

### 3. Мониторинг

Настройте мониторинг:
- Vercel Analytics (встроенный)
- Sentry для отслеживания ошибок
- Uptime monitoring (UptimeRobot, Pingdom)

### 4. Резервное копирование

Настройте автоматическое резервное копирование:
- База данных (если используется)
- Конфигурационные файлы
- Данные пользователей

---

## Полезные команды

### Просмотр логов на Vercel:
```bash
vercel logs
```

### Просмотр логов PM2:
```bash
pm2 logs telegram-ai-agent
```

### Перезапуск PM2:
```bash
pm2 restart telegram-ai-agent
```

### Обновление кода на сервере:
```bash
git pull
npm install
npm run build
pm2 restart telegram-ai-agent
```

---

## Troubleshooting

### Проблема: HTTPS required
**Решение:** Telegram требует HTTPS для Mini Apps. Используйте Vercel или настройте SSL на вашем сервере.

### Проблема: Telegram SDK не загружается
**Решение:** Проверьте, что скрипт загружается из CDN Telegram.

### Проблема: 502 Bad Gateway
**Решение:** Проверьте, что приложение запущено и слушает правильный порт.

### Проблема: Environment variables not working
**Решение:** Перезапустите приложение после добавления переменных окружения.

---

**Рекомендация:** Для начала используйте Vercel - это самый простой и быстрый способ деплоя Next.js приложений.








