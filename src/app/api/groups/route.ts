import { NextResponse } from 'next/server'
import { pool } from '@/features/data/actions/db'

export async function GET() {
  try {
    const groups = await pool.query('SELECT * FROM grupos ORDER BY nome ASC')
    return NextResponse.json(groups)
  } catch (error) {
    console.error('Error fetching groups:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
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

export async function POST(request: Request) {
  try {
    const { nome, jid } = await request.json()
    const result = await pool.query(
      'INSERT INTO grupos (nome, jid) VALUES ($1, $2) RETURNING *',
      [nome, jid]
    )
    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error creating group:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { id, nome, jid, log, log_adm } = await request.json()
    const result = await pool.query(
      'UPDATE grupos SET nome = $1, jid = $2, log = $3, log_adm = $4 WHERE id = $5 RETURNING *',
      [nome, jid, log, log_adm, id]
    )
    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error updating group:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

