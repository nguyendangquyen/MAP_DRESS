import { NextResponse } from 'next/server'
import type { RouteContext } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth-utils'

type Params = {
  id: string
}

export async function DELETE(
  req: Request,
  { params }: RouteContext<Params>
) {
  try {
    await prisma.banner.delete({
      where: {
        id: params.id,
      },
    })

    return NextResponse.json({ message: 'Banner deleted' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error deleting banner' },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: Request,
  { params }: RouteContext<Params>
) {
  try {
    const body = await req.json()
    const { title, link, imageUrl, order, active } = body

    const banner = await prisma.banner.update({
      where: {
        id: params.id,
      },
      data: {
        title,
        link,
        imageUrl,
        order: order !== undefined ? Number(order) : undefined,
        active,
      },
    })

    return NextResponse.json(banner)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error updating banner' },
      { status: 500 }
    )
  }
}
