import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const disbursements = await prisma.disbursement.findMany({
      include: {
        _count: {
          select: {
            comments: true,
            reactions: true
          }
        },
        reactions: {
          take: 5 // Lấy một vài reaction gần nhất để hiển thị demo
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(disbursements)
  } catch (error) {
    console.error('Error fetching disbursements:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, caption, images } = body

    // Ghi chú: Ở đây nên có kiểm tra quyền Admin
    // Hiện tại cho phép đăng để bạn test giao diện

    const disbursement = await prisma.disbursement.create({
      data: {
        amount: Number(amount),
        caption,
        images: images || [], // images là mảng URL
      }
    })

    return NextResponse.json(disbursement)
  } catch (error) {
    console.error('Error creating disbursement:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

