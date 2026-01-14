import { NextResponse } from 'next/server'
import type { RouteContext } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth.config'

type Params = {
  id: string
}

export async function DELETE(
  request: Request,
  { params }: RouteContext<Params>
) {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    if (id === session.user.id) {
      return NextResponse.json(
        { error: 'Không thể xóa tài khoản đang đăng nhập' },
        { status: 400 }
      )
    }

    await prisma.user.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'User deleted successfully' })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    )
  }
}
