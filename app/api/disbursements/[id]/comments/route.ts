import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const comments = await prisma.comment.findMany({
      where: { disbursementId: params.id },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(comments)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { content, authorName } = await request.json()
    
    if (!content || typeof content !== 'string') {
      return NextResponse.json({ error: 'Nội dung bình luận là bắt buộc' }, { status: 400 })
    }

    if (content.length > 500) {
      return NextResponse.json({ error: 'Bình luận quá dài (tối đa 500 ký tự)' }, { status: 400 })
    }

    if (authorName && authorName.length > 50) {
      return NextResponse.json({ error: 'Tên quá dài (tối đa 50 ký tự)' }, { status: 400 })
    }

    const comment = await prisma.comment.create({
      data: {
        disbursementId: params.id,
        content: content.trim(),
        authorName: (authorName?.trim()) || 'Người dùng ẩn danh'
      }
    })

    return NextResponse.json(comment)
  } catch (error) {
    console.error('Error adding comment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

