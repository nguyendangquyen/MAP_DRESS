// Final correction
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'
import { hashPassword } from '../../../lib/auth'
import { registerSchema } from '../../../lib/validations'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const validatedData = registerSchema.parse(body)
    
    const email = validatedData.email.toLowerCase()
    
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email đã được sử dụng' },
        { status: 400 }
      )
    }
    
    // Hash password
    const hashedPassword = await hashPassword(validatedData.password)
    
    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: validatedData.name,
        phone: validatedData.phone,
        address: validatedData.address,
        role: 'USER',
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    })
    
    return NextResponse.json(
      { message: 'Đăng ký thành công', user },
      { status: 201 }
    )
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Dữ liệu không hợp lệ', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi' },
      { status: 500 }
    )
  }
}
