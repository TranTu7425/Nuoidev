import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { startOfDay, startOfMonth } from 'date-fns'

export async function GET() {
  try {
    const now = new Date()
    const todayStart = startOfDay(now)
    const monthStart = startOfMonth(now)

    // Lấy tất cả giao dịch đã verify
    const verifiedTransactions = await prisma.transaction.findMany({
      where: { status: 'verified' },
      orderBy: { createdAt: 'desc' },
      take: 10,
    })

    // 1. Lúa về hôm nay
    const todayResult = await prisma.transaction.aggregate({
      where: { 
        status: 'verified',
        createdAt: { gte: todayStart }
      },
      _sum: { amount: true }
    })

    // 2. Tổng quỹ tháng này
    const monthResult = await prisma.transaction.aggregate({
      where: { 
        status: 'verified',
        createdAt: { gte: monthStart }
      },
      _sum: { amount: true }
    })

    // 3. Số dư khả dụng (Tổng tất cả từ trước đến nay)
    const totalResult = await prisma.transaction.aggregate({
      where: { status: 'verified' },
      _sum: { amount: true },
      _count: true,
    })

    // Top donors
    const topDonors = await prisma.donor.findMany({
      orderBy: { totalAmount: 'desc' },
      take: 10,
    })

    const totalDonors = await prisma.donor.count({
      where: { transactionCount: { gt: 0 } },
    })

    return NextResponse.json({
      todayAmount: todayResult._sum.amount || 0,
      monthAmount: monthResult._sum.amount || 0,
      totalAmount: totalResult._sum.amount || 0,
      totalTransactions: totalResult._count || 0,
      totalDonors,
      recentTransactions: verifiedTransactions,
      topDonors,
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
