import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    // Get verified transactions only
    const verifiedTransactions = await prisma.transaction.findMany({
      where: { status: 'verified' },
      orderBy: { createdAt: 'desc' },
      take: 10, // 10 giao dịch gần nhất
    })

    // Calculate total amount
    const totalAmountResult = await prisma.transaction.aggregate({
      where: { status: 'verified' },
      _sum: { amount: true },
      _count: true,
    })

    // Get top donors
    const topDonors = await prisma.donor.findMany({
      orderBy: { totalAmount: 'desc' },
      take: 10,
    })

    // Get total unique donors
    const totalDonors = await prisma.donor.count({
      where: {
        transactionCount: {
          gt: 0,
        },
      },
    })

    return NextResponse.json({
      totalAmount: totalAmountResult._sum.amount || 0,
      totalTransactions: totalAmountResult._count || 0,
      totalDonors,
      recentTransactions: verifiedTransactions,
      topDonors,
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

