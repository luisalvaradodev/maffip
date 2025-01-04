import { NextResponse } from 'next/server';
import { executeQuery } from '@/features/data/actions/db';
import { OkPacket } from 'mysql2';

export async function GET() {
  try {
    const categories = await executeQuery('SELECT * FROM categoria');
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
    const { id, ...updateData } = body;
    
    const result = await executeQuery<OkPacket>(
      'UPDATE categoria SET ? WHERE id = ?',
      [updateData, id]
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
    const ids = searchParams.get('ids')?.split(',').map(Number);
    
    if (!ids || ids.length === 0) {
      return NextResponse.json({ error: 'IDs are required' }, { status: 400 });
    }
    
    const result = await executeQuery<OkPacket>(
      'DELETE FROM categoria WHERE id IN (?)',
      [ids]
    );
    
    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'No categories found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting categories:', error);
    return NextResponse.json({ error: 'Error deleting categories' }, { status: 500 });
  }
}