import { NextResponse } from 'next/server';
import { executeQuery } from '@/features/data/actions/db';
import { OkPacket } from 'mysql2';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const mainid = searchParams.get('mainid');

    if (!mainid) {
      return NextResponse.json({ error: 'mainid is required' }, { status: 400 });
    }

    const categories = await executeQuery('SELECT * FROM categoria WHERE mainid = ?', [mainid]);
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Error fetching categories' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nome, mainid, valor, descricao, status, img, tipo } = body;

    if (!mainid) {
      return NextResponse.json({ error: 'mainid is required' }, { status: 400 });
    }

    const result = await executeQuery<OkPacket>(
      'INSERT INTO categoria (nome, mainid, valor, descricao, status, img, tipo) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [nome, mainid, valor, descricao, status, img, tipo]
    );

    return NextResponse.json({ id: result.insertId });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: 'Error creating category' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, mainid, ...updateData } = body;

    if (!mainid) {
      return NextResponse.json({ error: 'mainid is required' }, { status: 400 });
    }

    const result = await executeQuery<OkPacket>(
      'UPDATE categoria SET ? WHERE id = ? AND mainid = ?',
      [updateData, id, mainid]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json({ error: 'Error updating category' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const mainid = searchParams.get('mainid');

    if (!id || !mainid) {
      return NextResponse.json({ error: 'ID and mainid are required' }, { status: 400 });
    }

    const result = await executeQuery<OkPacket>(
      'DELETE FROM categoria WHERE id = ? AND mainid = ?',
      [id, mainid]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ error: 'Error deleting category' }, { status: 500 });
  }
}