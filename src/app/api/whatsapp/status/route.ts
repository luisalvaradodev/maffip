import { NextResponse } from 'next/server'
import { executeQuery } from '@/features/data/actions/db'

export async function GET() {
  try {
    const result = await executeQuery('SELECT status, numero FROM auth WHERE id = ?', [1])
    const { status, numero } = result[0]

    // In a real application, you'd generate this when needed
    const qrCode = status === 'Desconectado' ? 'https://example.com/qr' : null

    return NextResponse.json({ status, numero, qrCode })
  } catch (error) {
    console.error('Error fetching WhatsApp status:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

