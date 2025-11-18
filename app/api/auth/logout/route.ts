import { NextResponse } from 'next/server'

export async function POST() {
  try {
    // В реальном приложении здесь бы был вызов Google API для отзыва токена
    // await google.auth.revokeToken(token)
    
    // Для демо просто возвращаем успех
    return NextResponse.json({ 
      success: true,
      message: 'Logged out successfully' 
    })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Failed to logout' },
      { status: 500 }
    )
  }
}
