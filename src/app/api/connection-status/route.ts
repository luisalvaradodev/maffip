import { NextResponse } from 'next/server'
import { executeQuery } from '@/features/data/actions/db'

export async function GET() {
  try {
    // Check the connection by running a simple query
    await executeQuery('SELECT 1')
    return NextResponse.json({ isConnected: true })
  } catch (error) {
    console.error('Database connection error:', error)
    return NextResponse.json({ isConnected: false })
  }
}

