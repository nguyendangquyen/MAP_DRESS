import { NextRequest, NextResponse } from 'next/server'

// Mock data - in production, update Prisma database
const mockRentals = [
  { 
    id: '1', 
    userId: 'user1',
    productId: 'prod1',
    customer: 'Nguyễn Văn A', 
    product: 'Váy Dạ Hội Sang Trọng', 
    startDate: '2025-01-25', 
    endDate: '2025-01-27', 
    status: 'PENDING',
    totalPrice: 1500000 
  },
  { 
    id: '2', 
    userId: 'user2',
    productId: 'prod2',
    customer: 'Trần Thị B', 
    product: 'Suit Nam Lịch Lãm', 
    startDate: '2025-01-28', 
    endDate: '2025-01-30', 
    status: 'CONFIRMED',
    totalPrice: 2400000 
  },
  { 
    id: '3', 
    userId: 'user3',
    productId: 'prod3',
    customer: 'Lê Văn C', 
    product: 'Áo Dài Truyền Thống', 
    startDate: '2025-02-01', 
    endDate: '2025-02-03', 
    status: 'ACTIVE',
    totalPrice: 900000 
  },
  { 
    id: '4', 
    userId: 'user4',
    productId: 'prod4',
    customer: 'Phạm Minh D', 
    product: 'Váy Cưới Cao Cấp', 
    startDate: '2025-01-20', 
    endDate: '2025-01-22', 
    status: 'RETURNED',
    totalPrice: 6000000 
  },
]

// PATCH - Update rental status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { status } = body

    // Validate status
    const validStatuses = ['PENDING', 'CONFIRMED', 'ACTIVE', 'RETURNED', 'CANCELLED']
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    // Find rental
    const rentalIndex = mockRentals.findIndex((r: any) => r.id === id)
    if (rentalIndex === -1) {
      return NextResponse.json({ error: 'Rental not found' }, { status: 404 })
    }

    // Update rental
    mockRentals[rentalIndex].status = status

    // In production: await prisma.rental.update({ where: { id }, data: { status } })
    
    return NextResponse.json(mockRentals[rentalIndex])
  } catch (error) {
    console.error('Error updating rental:', error)
    return NextResponse.json({ error: 'Failed to update rental' }, { status: 500 })
  }
}
