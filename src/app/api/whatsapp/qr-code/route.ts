import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Aqui você implementaria a lógica real para gerar um QR code do WhatsApp
    // Por enquanto, vamos simular com um valor estático
    const qrCode = 'https://wa.me/1234567890'
    
    return NextResponse.json({ qrCode })
  } catch (error) {
    console.error('Error generating WhatsApp QR code:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

