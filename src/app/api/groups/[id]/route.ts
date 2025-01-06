import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/features/data/actions/db'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { nome, jid, log, log_adm, participantes } = await request.json()
    const [result] = await pool.query(
      'UPDATE grupos SET nome = ?, jid = ?, log = ?, log_adm = ?, participantes = ? WHERE id = ? RETURNING *',
      [nome, jid, log, log_adm, participantes, params.id]
    )
    if (result.length === 0) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 })
    }
    return NextResponse.json(result[0])
  } catch (error) {
    console.error('Error updating group:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const [result] = await pool.query('DELETE FROM grupos WHERE id = ? RETURNING *', [params.id])
    if (result.length === 0) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 })
    }
    return NextResponse.json({ message: 'Group deleted successfully' })
  } catch (error) {
    console.error('Error deleting group:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

