import { NextResponse } from 'next/server';
import { executeQuery } from '@/features/data/actions/db';
import { Texto } from '@/features/data/types';
import { OkPacket } from 'mysql2/promise';

// GET: Obtener todos los textos
export async function GET() {
  try {
    const textos = await executeQuery<Texto[]>('SELECT * FROM textos');
    return NextResponse.json(textos);
  } catch (error) {
    console.error('Error al obtener textos:', error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}

// POST: Crear un nuevo texto
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { texto_titulo, texto_info, texto_contas, texto_suporte, mainid } = body;

    if (!texto_titulo || !texto_info || !mainid) {
      return NextResponse.json({ message: 'Campos obligatorios faltantes' }, { status: 400 });
    }

    const result = await executeQuery<OkPacket>(
      'INSERT INTO textos (texto_titulo, texto_info, texto_contas, texto_suporte, mainid) VALUES (?, ?, ?, ?, ?)',
      [texto_titulo, texto_info, texto_contas, texto_suporte, mainid]
    );

    return NextResponse.json({ id: result.insertId }, { status: 201 });
  } catch (error) {
    console.error('Error al crear texto:', error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}

// PUT: Actualizar un texto existente
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, texto_titulo, texto_info, texto_contas, texto_suporte } = body;

    if (!id) {
      return NextResponse.json({ message: 'ID requerido' }, { status: 400 });
    }

    const result = await executeQuery<OkPacket>(
      'UPDATE textos SET texto_titulo = ?, texto_info = ?, texto_contas = ?, texto_suporte = ? WHERE id = ?',
      [texto_titulo, texto_info, texto_contas, texto_suporte, id]
    );

    return NextResponse.json({ affectedRows: result.affectedRows });
  } catch (error) {
    console.error('Error al actualizar texto:', error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}

// DELETE: Eliminar un texto
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ message: 'ID requerido' }, { status: 400 });
    }

    const result = await executeQuery<OkPacket>(
      'DELETE FROM textos WHERE id = ?',
      [id]
    );

    return NextResponse.json({ affectedRows: result.affectedRows });
  } catch (error) {
    console.error('Error al eliminar texto:', error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}
