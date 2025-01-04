import { NextResponse } from 'next/server'
import { executeQuery } from '@/features/data/actions/db'

export async function POST() {
  try {
    await executeQuery('UPDATE auth SET status = ?, numero = NULL WHERE id = ?', ['Desconectado', 1])
    return NextResponse.json({ message: 'Session deleted successfully' })
  } catch (error) {
    console.error('Error deleting WhatsApp session:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

