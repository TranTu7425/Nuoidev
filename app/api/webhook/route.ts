import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { parseWebhookPayload, verifyWebhookSignature, isAllowedIP } from '@/lib/webhook'
import { WebhookPayloadSchema } from '@/types/transaction'

// Rate limiting - simple in-memory store (trong production nên dùng Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const limit = rateLimitMap.get(ip)
  
  if (!limit || now > limit.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + 60000 }) // 1 phút
    return true
  }
  
  if (limit.count >= 10) { // Tối đa 10 requests/phút
    return false
  }
  
  limit.count++
  return true
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      )
    }

    // IP whitelist check
    const allowedIPs = process.env.WEBHOOK_ALLOWED_IPS?.split(',') || []
    if (allowedIPs.length > 0 && !isAllowedIP(ip, allowedIPs)) {
      return NextResponse.json(
        { error: 'IP not allowed' },
        { status: 403 }
      )
    }

    // Get raw body for signature verification
    const body = await request.text()
    
    // Auth check (Support both HMAC signature and SePay Bearer Token)
    const secret = process.env.WEBHOOK_SECRET
    const signature = request.headers.get('x-webhook-signature') || 
                     request.headers.get('x-signature')
    const authHeader = request.headers.get('authorization')

    console.log('--- 🛡️ AUTH DEBUG ---')
    console.log('Secret in .env:', secret ? 'EXISTS' : 'NOT FOUND')
    console.log('Authorization Header:', authHeader)
    console.log('Signature Header:', signature)

    let isAuthorized = !secret // If no secret set, allow all

    if (secret) {
      if (signature) {
        isAuthorized = verifyWebhookSignature(body, signature, secret)
        console.log('HMAC Auth Result:', isAuthorized)
      } else if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7)
        isAuthorized = token === secret
        console.log('Bearer Token Auth Result:', isAuthorized)
      }
    }

    if (!isAuthorized) {
      console.error('❌ AUTH FAILED: Secret mismatch or missing auth header')
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse payload
    let data: unknown
    try {
      data = JSON.parse(body)
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON' },
        { status: 400 }
      )
    }

    const rawPayload = parseWebhookPayload(data)
    
    // Hàm hỗ trợ trích xuất tên từ nội dung chuyển khoản
    const extractName = (content: string): string | null => {
      if (!content) return null
      // Tìm cụm từ có 2-4 từ viết hoa liên tiếp (pattern phổ biến của tên người trong ngân hàng)
      const match = content.match(/[A-Z]{2,}(?:\s[A-Z]{2,}){1,3}/)
      return match ? match[0] : null
    }

    const message = rawPayload.content || rawPayload.message || rawPayload.description || ''
    const extractedName = extractName(message)

    // Normalize SePay payload to our internal format
    const payload = {
      transaction_id: (rawPayload.id?.toString() || rawPayload.transaction_id || rawPayload.referenceCode || '').toString(),
      amount: rawPayload.transferAmount || rawPayload.amount || 0,
      sender_name: rawPayload.sender_name || extractedName || 'Nhà hảo tâm',
      sender_account: rawPayload.accountNumber || rawPayload.sender_account || null,
      message: message || null,
    }

    if (!payload.transaction_id || payload.amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid payload: missing transaction_id or amount' },
        { status: 400 }
      )
    }

    // Check if transaction already exists
    const existing = await prisma.transaction.findUnique({
      where: { transactionId: payload.transaction_id },
    })

    if (existing) {
      return NextResponse.json(
        { message: 'Transaction already exists', transactionId: existing.id },
        { status: 200 }
      )
    }

    // Create transaction
    const autoVerify = process.env.AUTO_VERIFY_TRANSACTIONS === 'true'
    const transaction = await prisma.transaction.create({
      data: {
        transactionId: payload.transaction_id,
        amount: payload.amount,
        senderName: payload.sender_name,
        senderAccount: payload.sender_account || null,
        message: payload.message || null,
        status: autoVerify ? 'verified' : 'pending',
        verifiedAt: autoVerify ? new Date() : null,
      },
    })

    // Update or create donor
    if (payload.sender_name) {
      const donor = await prisma.donor.findFirst({
        where: { name: payload.sender_name },
      })

      if (donor) {
        await prisma.donor.update({
          where: { id: donor.id },
          data: {
            totalAmount: {
              increment: payload.amount,
            },
            transactionCount: {
              increment: 1,
            },
            lastDonationAt: new Date(),
          },
        })
      } else {
        await prisma.donor.create({
          data: {
            name: payload.sender_name,
            totalAmount: payload.amount,
            transactionCount: 1,
            firstDonationAt: new Date(),
            lastDonationAt: new Date(),
          },
        })
      }
    }

    return NextResponse.json(
      {
        message: 'Transaction received',
        transactionId: transaction.id,
        status: transaction.status,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('❌ WEBHOOK ERROR DETAIL:', error)
    
    if (error instanceof Error) {
      console.error('Message:', error.message)
      console.error('Stack:', error.stack)
    }
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid payload format', details: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Chỉ cho phép POST
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}

