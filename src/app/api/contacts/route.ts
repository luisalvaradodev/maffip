import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/features/data/actions/db';

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('mainid');
  
  if (!userId) {
    return NextResponse.json({ error: 'Missing mainid parameter' }, { status: 400 });
  }

  try {
    console.log('Fetching contacts for mainid:', userId);
    const contacts = await executeQuery(
      'SELECT id, nome, numero, saldo, bloqueado FROM contatos WHERE mainid = ?;',
      [userId]
    );
    console.log('Contacts fetched successfully:', contacts);
    return NextResponse.json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', {
      message: error.message,
      stack: error.stack,
      query: 'SELECT id, nome, numero, saldo, bloqueado FROM contatos WHERE mainid = ?;',
      userId,
    });
    return NextResponse.json({ error: `Failed to fetch contacts: ${error.message}` }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { nome, numero, saldo, bloqueado, mainid } = body;

  if (!nome || !numero || saldo === undefined || bloqueado === undefined || !mainid) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    console.log('Inserting contact:', body);
    await executeQuery(
      'INSERT INTO contatos (nome, numero, saldo, bloqueado, mainid) VALUES (?, ?, ?, ?, ?);',
      [nome, numero, saldo, bloqueado, mainid]
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error inserting contact:', {
      message: error.message,
      stack: error.stack,
      data: body,
    });
    return NextResponse.json({ error: `Failed to insert contact: ${error.message}` }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id');
  
  if (!id) {
    return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 });
  }

  try {
    console.log('Deleting contact with id:', id);
    await executeQuery('DELETE FROM contatos WHERE id = ?;', [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting contact:', {
      message: error.message,
      stack: error.stack,
      id,
    });
    return NextResponse.json({ error: `Failed to delete contact: ${error.message}` }, { status: 500 });
  }
}
