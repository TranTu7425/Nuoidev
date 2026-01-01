import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const { type } = await request.json()
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1'

    // Tạo reaction mới
    const reaction = await prisma.reaction.create({
      data: {
        disbursementId: id,
        type: type || 'heart',
        ipAddress: ip
      }
    })

    return NextResponse.json(reaction)
  } catch (error) {
    console.error('Error adding reaction:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

