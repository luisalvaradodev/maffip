import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/features/data/actions/db'

// Obtener todos los grupos
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const mainid = searchParams.get('mainid')

  try {
    const [rows] = await pool.query('SELECT * FROM grupos WHERE mainid = ?', [mainid])
    console.log('Fetched groups:', rows)
    return NextResponse.json(rows)
  } catch (error) {
    console.error('Error fetching groups:', error)
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 })
  }
}

// Eliminar todos los grupos
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const mainid = searchParams.get('mainid')

  try {
    await pool.query('DELETE FROM grupos WHERE mainid = ?', [mainid])
    return NextResponse.json({ message: 'All groups deleted successfully' })
  } catch (error) {
    console.error('Error deleting groups:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// Crear un nuevo grupo
export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const mainid = searchParams.get('mainid')
  const { nome, jid, participantes } = await request.json()

  try {
    // Insertar el nuevo grupo con valores predeterminados para `log` y `log_adm`
    const [insertResult] = await pool.query(
      'INSERT INTO grupos (nome, jid, participantes, mainid, log, log_adm) VALUES (?, ?, ?, ?, ?, ?)',
      [nome, jid, participantes, mainid, false, false] // Valores predeterminados
    )

    // Obtener el ID del grupo recién insertado
    const [insertId] = await pool.query('SELECT LAST_INSERT_ID() as id')
    const newGroupId = insertId[0].id

    // Obtener los datos completos del grupo recién insertado
    const [newGroup] = await pool.query('SELECT * FROM grupos WHERE id = ?', [newGroupId])

    return NextResponse.json(newGroup[0])
  } catch (error) {
    console.error('Error creating group:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// Activar/desactivar logging para un grupo específico
export async function PATCH(request: NextRequest) {
  const { id, log } = await request.json()

  try {
    await pool.query('UPDATE grupos SET log = ? WHERE id = ?', [log, id])
    const [updatedGroup] = await pool.query('SELECT * FROM grupos WHERE id = ?', [id])

    if (updatedGroup.length === 0) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 })
    }

    return NextResponse.json(updatedGroup[0])
  } catch (error) {
    console.error('Error toggling logging:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// Activar/desactivar admin logging para un grupo específico
export async function PUT(request: NextRequest) {
  const { id, log_adm } = await request.json()

  try {
    await pool.query('UPDATE grupos SET log_adm = ? WHERE id = ?', [log_adm, id])
    const [updatedGroup] = await pool.query('SELECT * FROM grupos WHERE id = ?', [id])

    if (updatedGroup.length === 0) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 })
    }

    return NextResponse.json(updatedGroup[0])
  } catch (error) {
    console.error('Error toggling admin logging:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}