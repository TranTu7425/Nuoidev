import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

// Server-Sent Events endpoint cho real-time updates
export async function GET(request: NextRequest) {
  const encoder = new TextEncoder()
  
  const stream = new ReadableStream({
    async start(controller) {
      // Send initial connection message
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ type: 'connected' })}\n\n`)
      )

      // Poll for new transactions every 5 seconds
      let lastCheck = new Date()
      
      const interval = setInterval(async () => {
        try {
          const checkTime = new Date()
          const newTransactions = await prisma.transaction.findMany({
            where: {
              status: 'verified',
              createdAt: {
                gt: lastCheck,
              },
            },
            orderBy: { createdAt: 'desc' },
          })

          // Heartbeat to keep connection alive
          controller.enqueue(encoder.encode(': heartbeat\n\n'))

          if (newTransactions.length > 0) {
            // Convert Decimal to Number for JSON serialization
            const serializedTransactions = newTransactions.map(tx => ({
              ...tx,
              amount: Number(tx.amount)
            }))

            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ type: 'new_transactions', data: serializedTransactions })}\n\n`
              )
            )
          }
          
          lastCheck = checkTime
        } catch (error) {
          console.error('Error in SSE stream:', error)
          clearInterval(interval)
          controller.close()
        }
      }, 5000) // Check every 5 seconds

      // Cleanup on client disconnect
      request.signal.addEventListener('abort', () => {
        clearInterval(interval)
        controller.close()
      })
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}

