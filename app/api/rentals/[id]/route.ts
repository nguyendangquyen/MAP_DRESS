import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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

    // Update rental status in database
    const updatedRental = await prisma.rental.update({
      where: { id },
      data: { status },
      include: {
        user: true,
        product: true
      }
    })
    
    // Map to frontend structure - matching GET response
    const formattedRental = {
      id: updatedRental.id,
      userId: updatedRental.userId,
      productId: updatedRental.productId,
      customer: updatedRental.user?.name || 'Guest',
      product: updatedRental.product?.name || 'Deleted Product',
      productImage: updatedRental.product?.images?.[0]?.url || '',
      startDate: updatedRental.startDate.toISOString().split('T')[0],
      endDate: updatedRental.endDate.toISOString().split('T')[0],
      status: updatedRental.status,
      totalPrice: updatedRental.totalPrice
    }

    return NextResponse.json(formattedRental)
  } catch (error) {
    console.error('Error updating rental:', error)
    return NextResponse.json({ error: 'Failed to update rental' }, { status: 500 })
  }
}

// DELETE - Delete a rental
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Delete rental from database
    await prisma.rental.delete({
      where: { id }
    })
    
    return NextResponse.json({ message: 'Rental deleted successfully' })
  } catch (error) {
    console.error('Error deleting rental:', error)
    return NextResponse.json({ error: 'Failed to delete rental' }, { status: 500 })
  }
}
