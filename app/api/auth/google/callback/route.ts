import { NextRequest, NextResponse } from 'next/server'
import { exchangeGoogleCode } from '@/lib/oauth'
import { saveTokens } from '@/lib/token-storage'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const error = searchParams.get('error')
  const state = searchParams.get('state') // userId from state parameter

  if (error) {
    return showErrorPage(error)
  }

  if (!code || !state) {
    return showErrorPage('no_code_or_state')
  }

  const userId = state // state содержит userId
  const clientId = process.env.GOOGLE_CLIENT_ID!
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET!
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3001/api/auth/google/callback'

  try {
    const tokens = await exchangeGoogleCode(code, redirectUri, clientId, clientSecret)
    
    // Добавляем expires_at для хранения
    const tokensWithExpiry = {
      ...tokens,
      expires_at: Date.now() + tokens.expires_in * 1000,
    }
    
    // Сохраняем токены на сервере по userId
    await saveTokens(userId, 'google', tokensWithExpiry)
    
    // Показываем страницу успеха
    const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Подключение успешно!</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                margin: 0;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                text-align: center;
                padding: 20px;
              }
              .container {
                max-width: 400px;
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
                border-radius: 20px;
                padding: 40px 30px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
              }
              .success {
                font-size: 72px;
                margin-bottom: 20px;
                animation: scale 0.6s ease-out;
              }
              @keyframes scale {
                0% { transform: scale(0) rotate(-180deg); }
                60% { transform: scale(1.2) rotate(10deg); }
                100% { transform: scale(1) rotate(0deg); }
              }
              h2 {
                margin-bottom: 10px;
                font-size: 24px;
                font-weight: 600;
              }
              p {
                color: rgba(255, 255, 255, 0.9);
                margin-bottom: 15px;
                line-height: 1.5;
              }
              .info {
                background: rgba(255, 255, 255, 0.15);
                border-radius: 12px;
                padding: 15px;
                margin: 20px 0;
                font-size: 14px;
              }
              .button {
                display: inline-block;
                padding: 14px 32px;
                background: white;
                color: #667eea;
                text-decoration: none;
                border-radius: 12px;
                font-weight: 600;
                margin-top: 20px;
                border: none;
                cursor: pointer;
                font-size: 16px;
                transition: transform 0.2s;
              }
              .button:active {
                transform: scale(0.95);
              }
              .instructions {
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid rgba(255, 255, 255, 0.2);
                font-size: 13px;
                color: rgba(255, 255, 255, 0.8);
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="success">✓</div>
              <h2>Подключение успешно!</h2>
              <p>Google аккаунт подключен к Martin AI</p>
              
              <div class="info">
                ✉️ Gmail подключен<br>
                📅 Google Calendar подключен
              </div>
              
              <button class="button" onclick="closeWindow()">Закрыть и вернуться</button>
              
              <div class="instructions">
                ✅ Можете закрыть это окно и вернуться в Telegram<br>
                Ваш Google аккаунт готов к использованию!
              </div>
            </div>
            <script>
              console.log('✅ Tokens saved on server for user: ${userId}');
              
              // Попытка закрыть вкладку/окно
              function closeWindow() {
                try {
                  // Для окон открытых через window.open
                  if (window.opener) {
                    window.close();
                    return;
                  }
                  
                  // Для вкладок - показываем что можно закрыть
                  document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:sans-serif;text-align:center;padding:20px;background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);color:white;"><div style="max-width:400px;"><div style="font-size:64px;margin-bottom:20px;">✅</div><h2 style="margin-bottom:20px;">Все готово!</h2><p style="font-size:18px;margin-bottom:20px;">Google аккаунт успешно подключен</p><p style="opacity:0.9;">Можете закрыть эту вкладку и вернуться в Telegram</p></div></div>';
                } catch (e) {
                  console.error('Cannot close window:', e);
                }
              }
              
              // Автоматически закрываем через 2 секунды
              setTimeout(closeWindow, 2000);
            </script>
          </body>
        </html>
    `
    
    return new NextResponse(html, {
      headers: { 
        'Content-Type': 'text/html',
        'Cache-Control': 'no-store'
      },
    })
  } catch (error) {
    console.error('Google OAuth error:', error)
    return showErrorPage('oauth_failed')
  }
}

function showErrorPage(errorType: string) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Ошибка подключения</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #f56565 0%, #c53030 100%);
            color: white;
            text-align: center;
            padding: 20px;
          }
          .container {
            max-width: 400px;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 40px 30px;
          }
          .error {
            font-size: 72px;
            margin-bottom: 20px;
          }
          .button {
            display: inline-block;
            padding: 14px 32px;
            background: white;
            color: #c53030;
            text-decoration: none;
            border-radius: 12px;
            font-weight: 600;
            margin-top: 20px;
            border: none;
            cursor: pointer;
            font-size: 16px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="error">✗</div>
          <h2>Ошибка подключения</h2>
          <p>Не удалось подключить Google аккаунт</p>
          <p style="font-size: 12px; opacity: 0.8;">Код ошибки: ${errorType}</p>
          <button class="button" onclick="window.close()">Закрыть</button>
        </div>
      </body>
    </html>
  `
  
  return new NextResponse(html, {
    headers: { 
      'Content-Type': 'text/html',
      'Cache-Control': 'no-store'
    },
  })
}

