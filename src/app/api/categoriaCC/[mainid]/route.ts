import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/features/data/actions/db';
import { RowDataPacket, OkPacket } from 'mysql2';

export async function GET(
  request: NextRequest,
  { params }: { params: { mainid: string } }
) {
  try {
    const mainid = parseInt(params.mainid);
    const categories = await executeQuery<RowDataPacket[]>(
      'SELECT * FROM categoria_cc WHERE mainid = ?',
      [mainid]
    );
    return NextResponse.json(categories);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { mainid: string } }
) {
  try {
    const { nome, valor, img, ativo } = await request.json();
    const mainid = parseInt(params.mainid);
    const result = await executeQuery<OkPacket>(
      'INSERT INTO categoria_cc (nome, valor, img, ativo, mainid) VALUES (?, ?, ?, ?, ?)',
      [nome, valor, img, ativo, mainid]
    );
    return NextResponse.json({ id: result.insertId }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { mainid: string } }
) {
  try {
    const { id, nome, valor, img, ativo } = await request.json();
    const mainid = parseInt(params.mainid);
    await executeQuery(
      'UPDATE categoria_cc SET nome = ?, valor = ?, img = ?, ativo = ? WHERE id = ? AND mainid = ?',
      [nome, valor, img, ativo, id, mainid]
    );
    return NextResponse.json({ message: 'Category updated successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { mainid: string } }
) {
  try {
    const { id } = await request.json();
    const mainid = parseInt(params.mainid);
    await executeQuery(
      'DELETE FROM categoria_cc WHERE id = ? AND mainid = ?',
      [id, mainid]
    );
    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

