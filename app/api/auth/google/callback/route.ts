import { NextRequest, NextResponse } from 'next/server'
import { saveTokens } from '@/lib/token-storage'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get('code')
    const state = searchParams.get('state') // userId
    const error = searchParams.get('error')

    // Если есть ошибка от Google
    if (error) {
      console.error('Google OAuth error:', error)
      return NextResponse.redirect(new URL('/?error=auth_failed', request.url))
    }

    // Проверяем наличие кода авторизации
    if (!code || !state) {
      return NextResponse.redirect(new URL('/?error=missing_params', request.url))
    }

    // В реальном приложении здесь нужно:
    // 1. Обменять code на access_token через Google API
    // 2. Получить информацию о пользователе
    // 3. Сохранить токены в базе данных

    // Для демо - сохраняем фиктивные токены
    const tokens = {
      access_token: `demo_access_${Date.now()}`,
      refresh_token: `demo_refresh_${Date.now()}`,
      email: 'user@gmail.com',
      expires_at: Date.now() + 3600000 // 1 час
    }

    // Сохраняем токены
    await saveTokens(state, 'google', tokens)

    // Перенаправляем обратно в приложение
    return NextResponse.redirect(new URL('/', request.url))
  } catch (error) {
    console.error('Callback error:', error)
    return NextResponse.redirect(new URL('/?error=callback_error', request.url))
  }
}