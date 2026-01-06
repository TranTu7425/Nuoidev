import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status') || 'verified' // Chỉ hiển thị giao dịch đã verify
    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    if (status && status !== 'all') {
      where.status = status
    }

    // Get transactions
    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        select: {
          id: true,
          transactionId: true,
          amount: true,
          senderName: true,
          senderAccount: true, // Chúng ta vẫn lấy nhưng sẽ mask trên frontend, hoặc mask ở đây
          message: true,
          status: true,
          verifiedAt: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.transaction.count({ where }),
    ])

    // Mask senderAccount before sending to client
    const maskedTransactions = transactions.map(tx => ({
      ...tx,
      senderAccount: tx.senderAccount 
        ? tx.senderAccount.slice(0, 2) + '****' + tx.senderAccount.slice(-2)
        : 'Ẩn danh'
    }))

    return NextResponse.json({
      data: maskedTransactions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

