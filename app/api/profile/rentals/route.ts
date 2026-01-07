// Final correction
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const rentals = await prisma.rental.findMany({
      where: { userId },
      include: {
        product: {
          select: {
            name: true,
            images: {
              take: 1,
            },
            category: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(rentals)
  } catch (error) {
    console.error('Fetch rentals error:', error)
    return NextResponse.json({ error: 'Failed to fetch rentals history' }, { status: 500 })
  }
}
