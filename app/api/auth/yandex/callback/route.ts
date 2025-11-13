import { NextRequest, NextResponse } from 'next/server'
import { exchangeYandexCode } from '@/lib/oauth'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  if (error) {
    return NextResponse.redirect(`/?error=${error}`)
  }

  if (!code) {
    return NextResponse.redirect('/?error=no_code')
  }

  const clientId = process.env.YANDEX_CLIENT_ID!
  const clientSecret = process.env.YANDEX_CLIENT_SECRET!

  try {
    const tokens = await exchangeYandexCode(code, clientId, clientSecret)
    
    // Create HTML that stores tokens and closes window
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Подключение...</title>
        </head>
        <body>
          <script>
            localStorage.setItem('yandex_tokens', JSON.stringify(${JSON.stringify(tokens)}));
            localStorage.setItem('yandex_tokens_expiry', ${Date.now() + tokens.expires_in * 1000});
            window.opener.postMessage({ type: 'yandex_auth_success' }, '*');
            window.close();
          </script>
          <p>Подключение успешно! Закройте это окно.</p>
        </body>
      </html>
    `
    
    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html' },
    })
  } catch (error) {
    console.error('Yandex OAuth error:', error)
    return NextResponse.redirect('/?error=oauth_failed')
  }
}




