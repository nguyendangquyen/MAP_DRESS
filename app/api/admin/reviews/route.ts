import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all reviews for admin
export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      include: {
        user: {
          select: { name: true, email: true }
        },
        product: {
          select: { name: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(reviews)
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching reviews' }, { status: 500 })
  }
}

// Response/Update review
export async function PATCH(req: Request) {
  try {
    const body = await req.json()
    const { id, reply, adminId } = body

    if (!adminId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const review = await prisma.review.update({
      where: { id },
      data: { reply }
    })

    return NextResponse.json(review)
  } catch (error) {
    console.error('Error updating review:', error)
    return NextResponse.json({ error: 'Error updating review' }, { status: 500 })
  }
}
