import { NextResponse } from 'next/server';
import { executeQuery } from '@/features/data/actions/db';
import { Contact } from '@/features/data/types';

export async function GET() {
  try {
    const clients = await executeQuery<Contact[]>(`
      SELECT c.*, 
             COUNT(s.id) as total_purchases,
             SUM(s.valor) as total_spent
      FROM contatos c
      LEFT JOIN store s ON c.numero = s.numero
      GROUP BY c.id
    `);
    return NextResponse.json(clients);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch clients' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { numero, nome, mainid, saldo } = body;

    const result = await executeQuery(`
      INSERT INTO contatos (numero, nome, mainid, saldo)
      VALUES (?, ?, ?, ?)
    `, [numero, nome, mainid, saldo]);

    return NextResponse.json(result);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create client' }, { status: 500 });
  }
}