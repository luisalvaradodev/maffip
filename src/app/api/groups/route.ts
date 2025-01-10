import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/features/data/actions/db'

// Obtener todos los grupos
export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM grupos')
    console.log('Fetched groups:', rows)
    return NextResponse.json(rows)
  } catch (error) {
    console.error('Error fetching groups:', error)
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 })
  }
}

// Eliminar todos los grupos
export async function DELETE() {
  try {
    await pool.query('DELETE FROM grupos')
    return NextResponse.json({ message: 'All groups deleted successfully' })
  } catch (error) {
    console.error('Error deleting groups:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// Crear un nuevo grupo
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

// Activar/desactivar logging para un grupo específico
export async function PATCH(request: NextRequest) {
  try {
    const { id, log } = await request.json()
    const [result] = await pool.query(
      'UPDATE grupos SET log = ? WHERE id = ? RETURNING *',
      [log, id]
    )
    if (result.length === 0) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 })
    }
    return NextResponse.json(result[0])
  } catch (error) {
    console.error('Error toggling logging:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// Activar/desactivar admin logging para un grupo específico
export async function PUT(request: NextRequest) {
  try {
    const { id, log_adm } = await request.json()
    const [result] = await pool.query(
      'UPDATE grupos SET log_adm = ? WHERE id = ? RETURNING *',
      [log_adm, id]
    )
    if (result.length === 0) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 })
    }
    return NextResponse.json(result[0])
  } catch (error) {
    console.error('Error toggling admin logging:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}