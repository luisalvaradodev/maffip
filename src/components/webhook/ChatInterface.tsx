'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import WebSocketClient from '@/lib/websocketClient'
import MessageController from '@/lib/messageController'

interface Message {
  id: string
  sender: string
  content: string
  timestamp: number
}

interface Chat {
  id: string
  messages: Message[]
}

export default function ChatInterface({ selectedInstance }: { selectedInstance: string | null }) {
  const [chats, setChats] = useState<Chat[]>([])
  const [botActive, setBotActive] = useState(false)
  const [websocket, setWebsocket] = useState<WebSocketClient | null>(null)

  useEffect(() => {
    if (selectedInstance) {
      const ws = new WebSocketClient('http://localhost:4000')
      setWebsocket(ws)

      ws.on('messages.upsert', (data) => {
        handleNewMessage(data)
      })

      return () => {
        ws.disconnect()
      }
    }
  }, [selectedInstance])

  const handleNewMessage = (data: any) => {
    const message = data.messages[0]
    const chatId = message.key.remoteJid
    const newMessage: Message = {
      id: message.key.id,
      sender: message.key.fromMe ? 'bot' : 'user',
      content: message.message.conversation,
      timestamp: message.messageTimestamp
    }

    setChats((prevChats) => {
      const chatIndex = prevChats.findIndex((chat) => chat.id === chatId)
      if (chatIndex !== -1) {
        const updatedChats = [...prevChats]
        updatedChats[chatIndex].messages.push(newMessage)
        return updatedChats
      } else {
        return [...prevChats, { id: chatId, messages: [newMessage] }]
      }
    })

    if (botActive && !message.key.fromMe) {
      MessageController.handleMessageEvent(selectedInstance!, 'MESSAGES_UPSERT', data)
    }
  }

  const toggleBot = () => {
    setBotActive(!botActive)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chat Interface</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={toggleBot} variant={botActive ? 'destructive' : 'default'}>
          {botActive ? 'Deactivate Bot' : 'Activate Bot'}
        </Button>
        <ScrollArea className="h-[400px] mt-4">
          {chats.map((chat) => (
            <div key={chat.id} className="mb-4">
              <h3 className="font-semibold mb-2">Chat: {chat.id}</h3>
              {chat.messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-2 p-2 rounded-lg ${
                    message.sender === 'bot' ? 'bg-blue-100 ml-auto' : 'bg-gray-100'
                  } max-w-[80%]`}
                >
                  <p>{message.content}</p>
                  <span className="text-xs text-gray-500">
                    {new Date(message.timestamp * 1000).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

