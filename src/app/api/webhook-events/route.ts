import { NextResponse } from 'next/server'
import { executeQuery } from '@/features/data/actions/db'

export async function GET() {
  const stream = new ReadableStream({
    async start(controller) {
      const sendEvent = (data: any) => {
        controller.enqueue(`data: ${JSON.stringify(data)}\n\n`)
      }

      // Simulating real-time events (replace this with your actual event source)
      setInterval(async () => {
        try {
          const [event] = await executeQuery('SELECT * FROM webhook_events ORDER BY timestamp DESC LIMIT 1')
          if (event) {
            sendEvent({
              id: event.id,
              timestamp: event.timestamp,
              type: event.type,
              data: JSON.parse(event.data),
            })
          }
        } catch (error) {
          console.error('Error fetching webhook event:', error)
        }
      }, 5000)
    },
  })

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}

