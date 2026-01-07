// Final correction
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'
import { verifyPassword } from '../../../lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: 'Email và mật khẩu là bắt buộc' }, { status: 400 })
    }

    const normalizedEmail = email.toLowerCase()
    // console.log('Login attempt for:', normalizedEmail)

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    })

    if (!user) {
      console.log('User not found:', normalizedEmail)
      return NextResponse.json({ error: 'Email hoặc mật khẩu không chính xác' }, { status: 401 })
    }

    const isPasswordValid = await verifyPassword(password, user.password)
    // console.log('Password valid:', isPasswordValid)

    if (!isPasswordValid) {
      console.log('Invalid password for user:', normalizedEmail)
      return NextResponse.json({ error: 'Email hoặc mật khẩu không chính xác' }, { status: 401 })
    }

    // Return user info (excluding password)
    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      image: user.image,
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Đã có lỗi xảy ra trong quá trình đăng nhập' }, { status: 500 })
  }
}
