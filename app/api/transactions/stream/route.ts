import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'

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

          if (newTransactions.length > 0) {
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ type: 'new_transactions', data: newTransactions })}\n\n`
              )
            )
          }
          
          // Update lastCheck after each check to avoid missing transactions
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

