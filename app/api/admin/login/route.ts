import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { serialize } from 'cookie'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'
const ADMIN_ACCESS_KEY = process.env.ADMIN_ACCESS_KEY || 'super-secret-key'
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Simple in-memory rate limiting
const loginAttempts = new Map<string, { count: number, lockUntil: number }>()

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1'
    const now = Date.now()

    // Check if IP is locked
    const attempt = loginAttempts.get(ip)
    if (attempt && attempt.lockUntil > now) {
      const waitTime = Math.ceil((attempt.lockUntil - now) / 1000 / 60)
      return NextResponse.json({ 
        success: false, 
        error: `Quá nhiều lần thử sai. Vui lòng đợi ${waitTime} phút.` 
      }, { status: 429 })
    }

    const { password, accessKey } = await request.json()

    // LỚP BẢO MẬT 2: Kiểm tra cả Password và Access Key
    if (password === ADMIN_PASSWORD && accessKey === ADMIN_ACCESS_KEY) {
      // Login success: Reset attempts
      loginAttempts.delete(ip)

      const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '7d' })
      const response = NextResponse.json({ success: true })
      
      response.headers.set('Set-Cookie', serialize('admin_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      }))

      return response
    }

    // Login failed: Increment attempts
    const currentAttempt = attempt || { count: 0, lockUntil: 0 }
    currentAttempt.count += 1
    
    if (currentAttempt.count >= 5) {
      currentAttempt.lockUntil = now + (15 * 60 * 1000) // Lock for 15 mins
    }
    
    loginAttempts.set(ip, currentAttempt)

    return NextResponse.json({ 
      success: false, 
      error: 'Mật khẩu hoặc mã bí mật không chính xác' 
    }, { status: 401 })

  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.headers.set('Set-Cookie', serialize('admin_token', '', {
    maxAge: -1,
    path: '/',
  }))
  return response
}
