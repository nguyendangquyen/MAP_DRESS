import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

export async function GET() {
  try {
    const [totalUsers, totalProducts, totalRentals, rentals] = await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.rental.count(),
      prisma.rental.findMany({
        take: 5,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          user: true,
          product: true,
        },
      }),
    ])

    // Calculate revenue from completed rentals or those with payments
    const revenueData = await prisma.rental.aggregate({
      _sum: {
        totalPrice: true,
      },
      where: {
        status: {
          in: ['CONFIRMED', 'ACTIVE', 'RETURNED'],
        },
      },
    })

    const totalRevenue = revenueData._sum.totalPrice || 0

    const recentRentals = rentals.map((rental) => ({
      id: rental.id,
      customer: rental.user.name,
      product: rental.product.name,
      status: rental.status,
      amount: rental.totalPrice,
    }))

    return NextResponse.json({
      totalUsers,
      totalProducts,
      totalRentals,
      totalRevenue,
      recentRentals,
    })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json({ error: 'Failed to fetch admin statistics' }, { status: 500 })
  }
}
