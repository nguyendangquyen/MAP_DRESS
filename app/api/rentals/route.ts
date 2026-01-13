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
      productImage: rental.product?.images?.[0]?.url || '',
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
// POST - Create a new rental
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      productId, 
      customerName, 
      email, 
      phone, 
      selectedDates, 
      totalPrice, 
      notes, 
      paymentMethod,
      totalDays
    } = body

    if (!productId || !email || !selectedDates || selectedDates.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Sort dates to get start and end
    const sortedDates = [...selectedDates].sort()
    const startDate = new Date(sortedDates[0])
    const endDate = new Date(sortedDates[sortedDates.length - 1])

    // Use a transaction to ensure atomic updates
    const result = await prisma.$transaction(async (tx) => {
      // 1. Find or create user (Simple guest flow)
      let user = await tx.user.findUnique({
        where: { email }
      })

      if (!user) {
        user = await tx.user.create({
          data: {
            email,
            name: customerName,
            phone,
            password: 'GUEST_USER_' + Math.random().toString(36).slice(-8), // Placeholder
          }
        })
      }

      // 2. Create the Rental
      const rental = await tx.rental.create({
        data: {
          userId: user.id,
          productId,
          startDate,
          endDate,
          totalDays: totalDays || selectedDates.length,
          totalPrice: parseFloat(totalPrice.toString()),
          depositPaid: paymentMethod === 'full' ? parseFloat(totalPrice.toString()) : parseFloat(totalPrice.toString()) * 0.3,
          status: 'PENDING',
          notes: notes || '',
        }
      })

      // 3. Create Availability entries to block dates
      await tx.availability.createMany({
        data: selectedDates.map((dateStr: string) => ({
          productId,
          date: new Date(dateStr),
          isBlocked: false, // It's blocked because it's linked to a rental
          rentalId: rental.id,
        })),
        skipDuplicates: true, // In case of manual blocks
      })

      return rental
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error: any) {
    console.error('Error creating rental:', error)
    return NextResponse.json({ 
      error: 'Failed to create rental', 
      details: error.message 
    }, { status: 500 })
  }
}
