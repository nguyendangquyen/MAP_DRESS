import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth-utils'

export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: {
        order: 'asc',
      },
    })
    return NextResponse.json(banners)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error fetching banners' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()
    const body = await req.json()
    
    // Simple admin check (can be enhanced)
    // if (!user || user.role !== 'ADMIN') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const { title, link, imageUrl, order, active } = body

    if (!title || !imageUrl) {
      return NextResponse.json({ error: 'Title and Image URL are required' }, { status: 400 })
    }

    const banner = await prisma.banner.create({
      data: {
        title,
        link: link || null, // Convert empty string to null
        imageUrl,
        order: typeof order === 'number' ? order : parseInt(order) || 0,
        active: active ?? true,
      },
    })

    return NextResponse.json(banner)
  } catch (error) {
    console.error('Error creating banner:', error)
    return NextResponse.json(
      { error: 'Error creating banner', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
