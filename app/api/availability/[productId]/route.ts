// Final correction
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

// GET - Fetch booked dates for a product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params

    // Get all availability records for this product
    const availabilities = await prisma.availability.findMany({
      where: {
        productId: productId,
      },
      select: {
        date: true,
        isBlocked: true,
        rentalId: true,
      },
    })

    // Get all active rentals for this product
    const rentals = await prisma.rental.findMany({
      where: {
        productId: productId,
        status: {
          in: ['PENDING', 'CONFIRMED', 'ACTIVE'], // Only active rentals block dates
        },
      },
      select: {
        startDate: true,
        endDate: true,
      },
    })

    // Compile blocked dates
    const blockedDates: string[] = []

    // Add manually blocked dates from availability
    availabilities.forEach(availability => {
      if (availability.isBlocked || availability.rentalId) {
        blockedDates.push(availability.date.toISOString().split('T')[0])
      }
    })

    // Add all dates from active rentals
    rentals.forEach(rental => {
      const start = new Date(rental.startDate)
      const end = new Date(rental.endDate)
      
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0]
        if (!blockedDates.includes(dateStr)) {
          blockedDates.push(dateStr)
        }
      }
    })

    return NextResponse.json({ blockedDates })
  } catch (error) {
    console.error('Error fetching availability:', error)
    return NextResponse.json({ error: 'Failed to fetch availability' }, { status: 500 })
  }
}
