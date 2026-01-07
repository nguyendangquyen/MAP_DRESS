// Final correction
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'
import { verifyPassword, hashPassword } from '../../../lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, oldPassword, newPassword } = body

    if (!userId || !oldPassword || !newPassword) {
      return NextResponse.json({ error: 'Thiếu thông tin cần thiết' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const isPasswordValid = await verifyPassword(oldPassword, user.password)

    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Mật khẩu cũ không chính xác' }, { status: 401 })
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'Mật khẩu mới phải có ít nhất 6 ký tự' }, { status: 400 })
    }

    const hashedPassword = await hashPassword(newPassword)

    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
      },
    })

    return NextResponse.json({ message: 'Đổi mật khẩu thành công' })
  } catch (error) {
    console.error('Change password error:', error)
    return NextResponse.json({ error: 'Failed to change password' }, { status: 500 })
  }
}
