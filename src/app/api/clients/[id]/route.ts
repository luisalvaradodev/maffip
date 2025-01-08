import { NextResponse } from 'next/server';
import { executeQuery } from '@/features/data/actions/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await executeQuery(`
      SELECT c.*, 
             COUNT(s.id) as total_purchases,
             SUM(s.valor) as total_spent
      FROM contatos c
      LEFT JOIN store s ON c.numero = s.numero
      WHERE c.id = ?
      GROUP BY c.id
    `, [params.id]);

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    return NextResponse.json(client);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch client' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { numero, nome, saldo, bloqueado } = body;

    await executeQuery(`
      UPDATE contatos
      SET numero = ?, nome = ?, saldo = ?, bloqueado = ?
      WHERE id = ?
    `, [numero, nome, saldo, bloqueado, params.id]);

    return NextResponse.json({ message: 'Client updated successfully' });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update client' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await executeQuery('DELETE FROM contatos WHERE id = ?', [params.id]);
    return NextResponse.json({ message: 'Client deleted successfully' });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete client' }, { status: 500 });
  }
}