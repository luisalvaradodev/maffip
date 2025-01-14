'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'

interface Message {
  id: string
  sender: 'user' | 'bot'
  content: string
}

export default function WhatsAppChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [recipient, setRecipient] = useState('')

  const sendMessage = async () => {
    if (!inputMessage.trim() || !recipient.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: inputMessage,
    }

    setMessages((prevMessages) => [...prevMessages, newMessage])
    setInputMessage('')

    try {
      const response = await fetch('/api/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: recipient, text: inputMessage }),
      })

      if (response.ok) {
        const botReply: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          content: 'Message sent successfully!',
        }
        setMessages((prevMessages) => [...prevMessages, botReply])
      } else {
        throw new Error('Failed to send message')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        content: 'Error sending message. Please try again.',
      }
      setMessages((prevMessages) => [...prevMessages, errorMessage])
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>WhatsApp Chat</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] mb-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-2 p-2 rounded-lg ${
                message.sender === 'user' ? 'bg-blue-100 ml-auto' : 'bg-gray-100'
              } max-w-[80%]`}
            >
              {message.content}
            </div>
          ))}
        </ScrollArea>
        <Input
          className="mb-2"
          placeholder="Recipient number"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
        <Textarea
          className="mb-2"
          placeholder="Type your message..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
        />
        <Button onClick={sendMessage}>Send</Button>
      </CardContent>
    </Card>
  )
}

