import { NextResponse } from 'next/server';
import { executeQuery } from '@/features/data/actions/db';
import { Texto } from '@/features/data/types';
import { OkPacket } from 'mysql2/promise';

// GET: Obtener textos por mainId
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const mainId = searchParams.get('mainId');

    if (!mainId) {
      return NextResponse.json(
        { message: 'mainId es requerido' },
        { status: 400 }
      );
    }

    const textos = await executeQuery<Texto[]>(
      'SELECT texto_titulo, texto_info, texto_contas, texto_suporte FROM textos WHERE mainid = ?',
      [mainId]
    );

    return NextResponse.json(textos[0] || {});
  } catch (error) {
    console.error('Error al obtener textos:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// POST: Crear un nuevo texto
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { texto_titulo, texto_info, texto_contas, texto_suporte, mainid } = body;

    // Validar campos obligatorios
    if (!texto_titulo || !texto_info || !mainid) {
      return NextResponse.json(
        { message: 'Campos obligatorios faltantes' },
        { status: 400 }
      );
    }

    // Insertar el nuevo texto
    const result = await executeQuery<OkPacket>(
      'INSERT INTO textos (texto_titulo, texto_info, texto_contas, texto_suporte, mainid) VALUES (?, ?, ?, ?, ?)',
      [texto_titulo, texto_info, texto_contas, texto_suporte, mainid]
    );

    return NextResponse.json({ id: result.insertId }, { status: 201 });
  } catch (error) {
    console.error('Error al crear texto:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// PUT: Actualizar un texto existente por mainId
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { texto_titulo, texto_info, texto_contas, texto_suporte, mainid } = body;

    if (!mainid) {
      return NextResponse.json(
        { message: 'mainId es requerido' },
        { status: 400 }
      );
    }

    const result = await executeQuery<OkPacket>(
      'UPDATE textos SET texto_titulo = ?, texto_info = ?, texto_contas = ?, texto_suporte = ? WHERE mainid = ?',
      [texto_titulo, texto_info, texto_contas, texto_suporte, mainid]
    );

    return NextResponse.json({ affectedRows: result.affectedRows });
  } catch (error) {
    console.error('Error al actualizar textos:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// DELETE: Eliminar un texto por mainId
export async function DELETE(req: Request) {
  try {
    const { mainid } = await req.json();

    // Validar mainId
    if (!mainid) {
      return NextResponse.json(
        { message: 'mainId es requerido' },
        { status: 400 }
      );
    }

    // Eliminar el texto asociado al mainId
    const result = await executeQuery<OkPacket>(
      'DELETE FROM textos WHERE mainid = ?',
      [mainid]
    );

    return NextResponse.json({ affectedRows: result.affectedRows });
  } catch (error) {
    console.error('Error al eliminar texto:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}