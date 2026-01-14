import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth.config'

export async function DELETE(
  request: Request,
  context
) {
  try {
    const session = await auth()

    // 1. Verify Admin
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = context.params

    // 2. Prevent deleting yourself
    if (id === session.user.id) {
      return NextResponse.json(
        { error: 'Không thể xóa tài khoản đang đăng nhập' },
        { status: 400 }
      )
    }

    // 3. Delete User
    await prisma.user.delete({
      where: { id }
    })

    return NextResponse.json({
      message: 'User deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    )
  }
}
