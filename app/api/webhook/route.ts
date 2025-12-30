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
    const signature = request.headers.get('x-webhook-signature') || 
                     request.headers.get('x-signature') ||
                     null

    // Verify signature
    const secret = process.env.WEBHOOK_SECRET
    if (secret && !verifyWebhookSignature(body, signature, secret)) {
      return NextResponse.json(
        { error: 'Invalid signature' },
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

    const payload = parseWebhookPayload(data)

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
    console.error('Webhook error:', error)
    
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

