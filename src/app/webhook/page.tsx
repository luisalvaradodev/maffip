'use client'

import { useState } from 'react'
import InstanceManager from '@/components/webhook/InstanceManager'
import ChatInterface from '@/components/webhook/ChatInterface'

export default function Home() {
  const [selectedInstance, setSelectedInstance] = useState<string | null>(null)

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">WhatsApp Webhook Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InstanceManager onInstanceSelect={setSelectedInstance} />
        <ChatInterface selectedInstance={selectedInstance} />
      </div>
    </main>
  )
}

