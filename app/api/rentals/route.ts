import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Fetch all rentals
export async function GET() {
  try {
    const rentals = await prisma.rental.findMany({
      include: {
        user: true,
        product: {
          include: {
            images: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Map database fields to the structure expected by the frontend
    const formattedRentals = rentals.map(rental => ({
      id: rental.id,
      userId: rental.userId,
      productId: rental.productId,
      customer: rental.user?.name || 'Guest',
      product: rental.product?.name || 'Deleted Product',
      startDate: rental.startDate.toISOString().split('T')[0],
      endDate: rental.endDate.toISOString().split('T')[0],
      status: rental.status,
      totalPrice: rental.totalPrice
    }))

    return NextResponse.json(formattedRentals)
  } catch (error) {
    console.error('Error fetching rentals:', error)
    return NextResponse.json({ error: 'Failed to fetch rentals' }, { status: 500 })
  }
}
