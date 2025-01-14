'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function ConnectionStatus() {
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch('/api/connection-status')
        const data = await response.json()
        setIsConnected(data.isConnected)
      } catch (error) {
        console.error('Error checking connection status:', error)
        setIsConnected(false)
      }
    }

    checkConnection()
    const interval = setInterval(checkConnection, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Connection Status</CardTitle>
      </CardHeader>
      <CardContent>
        <Badge variant={isConnected ? "success" : "destructive"}>
          {isConnected ? 'Connected' : 'Disconnected'}
        </Badge>
      </CardContent>
    </Card>
  )
}

