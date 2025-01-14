'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'

interface WebhookEvent {
  id: string
  timestamp: string
  type: string
  data: any
}

export default function WebhookEvents() {
  const [events, setEvents] = useState<WebhookEvent[]>([])

  useEffect(() => {
    const eventSource = new EventSource('/api/webhook-events')

    eventSource.onmessage = (event) => {
      const newEvent = JSON.parse(event.data)
      setEvents((prevEvents) => [newEvent, ...prevEvents].slice(0, 50)) // Keep last 50 events
    }

    return () => {
      eventSource.close()
    }
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Webhook Events</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          {events.map((event) => (
            <Card key={event.id} className="mb-4">
              <CardHeader>
                <CardTitle className="text-sm">{event.type}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">{event.timestamp}</p>
                <pre className="mt-2 text-xs whitespace-pre-wrap overflow-x-auto">
                  {JSON.stringify(event.data, null, 2)}
                </pre>
              </CardContent>
            </Card>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

