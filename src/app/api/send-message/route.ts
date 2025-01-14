import { NextResponse } from 'next/server'
import MessageController from '@/lib/messageController'

export async function POST(req: Request) {
  try {
    const { to, text } = await req.json()
    const instanceName = 'test' // Replace with your actual instance name

    const response = await MessageController.sendText(instanceName, to, text)
    return NextResponse.json({ success: true, data: response })
  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json({ success: false, error: 'Failed to send message' }, { status: 500 })
  }
}

