import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/features/data/actions/db'

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM grupos ORDER BY nome ASC')
    console.log('Fetched groups:', rows)
    return NextResponse.json(rows)
  } catch (error) {
    console.error('Error fetching groups:', error)
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    await pool.query('DELETE FROM grupos')
    return NextResponse.json({ message: 'All groups deleted successfully' })
  } catch (error) {
    console.error('Error deleting groups:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { nome, jid, participantes } = await request.json()
    const [result] = await pool.query(
      'INSERT INTO grupos (nome, jid, participantes) VALUES (?, ?, ?) RETURNING *',
      [nome, jid, participantes]
    )
    return NextResponse.json(result[0])
  } catch (error) {
    console.error('Error creating group:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

