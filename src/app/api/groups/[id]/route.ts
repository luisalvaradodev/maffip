import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/features/data/actions/db'

// Actualizar un grupo específico
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    // Verifica si la solicitud es para actualizar el logging o el admin logging
    if (body.log !== undefined) {
      // Actualizar solo el logging
      await pool.query(
        'UPDATE grupos SET log = ? WHERE id = ?',
        [body.log, params.id]
      )
    } else if (body.log_adm !== undefined) {
      // Actualizar solo el admin logging
      await pool.query(
        'UPDATE grupos SET log_adm = ? WHERE id = ?',
        [body.log_adm, params.id]
      )
    } else {
      // Actualizar todos los campos del grupo
      const { nome, jid, log, log_adm, participantes } = body
      await pool.query(
        'UPDATE grupos SET nome = ?, jid = ?, log = ?, log_adm = ?, participantes = ? WHERE id = ?',
        [nome, jid, log, log_adm, participantes, params.id]
      )
    }

    // Obtener el grupo actualizado
    const [result] = await pool.query(
      'SELECT * FROM grupos WHERE id = ?',
      [params.id]
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

// Eliminar un grupo específico
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const [result] = await pool.query('DELETE FROM grupos WHERE id = ?', [params.id])
    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 })
    }
    return NextResponse.json({ message: 'Group deleted successfully' })
  } catch (error) {
    console.error('Error deleting group:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// Activar/desactivar logging para un grupo específico
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { log } = await request.json()
    await pool.query(
      'UPDATE grupos SET log = ? WHERE id = ?',
      [log, params.id]
    )

    // Obtener el grupo actualizado
    const [result] = await pool.query(
      'SELECT * FROM grupos WHERE id = ?',
      [params.id]
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