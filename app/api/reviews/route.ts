import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { productId, rating, comment, userId } = await req.json()

    if (!userId) {
      return NextResponse.json({ error: 'Bạn cần đăng nhập để đánh giá' }, { status: 401 })
    }

    if (!productId || !rating) {
      return NextResponse.json({ error: 'Thiếu thông tin đánh giá' }, { status: 400 })
    }

    const review = await prisma.review.create({
      data: {
        productId,
        userId: userId,
        rating: Number(rating),
        comment,
      },
      include: {
        user: {
          select: {
            name: true,
            image: true
          }
        }
      }
    })

    return NextResponse.json(review)
  } catch (error) {
    console.error('Error creating review:', error)
    return NextResponse.json(
      { error: 'Lỗi khi gửi đánh giá' },
      { status: 500 }
    )
  }
}
