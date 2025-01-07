import { NextResponse } from 'next/server';
import { executeQuery } from '@/features/data/actions/db';
import { OkPacket } from 'mysql2';

export async function GET() {
  try {
    const products = await executeQuery(`
      SELECT p.*, c.nome AS categoria_nome 
      FROM produtos p
      LEFT JOIN categoria c ON p.categoria = c.id
    `);

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Error fetching products' }, { status: 500 });
  }
}



export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { categoria, mainid, produto, disponivel, email, senha, dono, cc, gg, tipo } = body;

    // Si no se proporciona `mainid`, asignamos un valor predeterminado (por ejemplo, un UUID)
    const finalMainid = mainid ?? 88; // Cambia 'default-mainid' según el valor que necesites

    const result = await executeQuery<OkPacket>(
      'INSERT INTO produtos (categoria, mainid, produto, disponivel, email, senha, dono, cc, gg, tipo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [categoria, finalMainid, produto, disponivel, email, senha, dono, cc, gg, tipo]
    );
    
    return NextResponse.json({ id: result.insertId });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Error creating product' }, { status: 500 });
  }
}


export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    // Filtramos las claves que son columnas existentes en la tabla 'produtos'
    const validColumns = ['categoria', 'mainid', 'produto', 'disponivel', 'email', 'senha', 'dono', 'cc', 'gg', 'tipo'];
    const filteredUpdateData = Object.fromEntries(
      Object.entries(updateData).filter(([key]) => validColumns.includes(key))
    );

    const columns = Object.keys(filteredUpdateData)
      .map((key) => `\`${key}\` = ?`)
      .join(', ');

    const values = Object.values(filteredUpdateData);

    const result = await executeQuery<OkPacket>(
      `UPDATE produtos SET ${columns} WHERE id = ?`,
      [...values, id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Error updating product' }, { status: 500 });
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
      'DELETE FROM produtos WHERE id IN (?)',
      [ids]
    );
    
    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'No products found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting products:', error);
    return NextResponse.json({ error: 'Error deleting products' }, { status: 500 });
  }
}
