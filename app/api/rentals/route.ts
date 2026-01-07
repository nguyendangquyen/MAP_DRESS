import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

// Mock rentals data - in production, this would come from Prisma/database
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

// GET - Fetch all rentals
export async function GET() {
  try {
    // In production: const rentals = await prisma.rental.findMany({ include: { user: true, product: true } })
    return NextResponse.json(mockRentals)
  } catch (error) {
    console.error('Error fetching rentals:', error)
    return NextResponse.json({ error: 'Failed to fetch rentals' }, { status: 500 })
  }
}
