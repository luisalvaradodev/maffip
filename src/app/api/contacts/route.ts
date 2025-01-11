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
      'SELECT id, nome, numero, saldo, bloqueado, foto, mainid, saldoadd, comprando FROM contatos WHERE mainid = ?;',
      [userId]
    );
    console.log('Contacts fetched successfully:', contacts);
    return NextResponse.json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json({ error: 'Failed to fetch contacts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { nome, numero, saldo, bloqueado, mainid, foto, saldoadd, comprando } = body;

  if (!nome || !numero || saldo === undefined || bloqueado === undefined || !mainid) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    console.log('Inserting contact:', body);
    const result = await executeQuery(
      'INSERT INTO contatos (nome, numero, saldo, bloqueado, mainid, foto, saldoadd, comprando) VALUES (?, ?, ?, ?, ?, ?, ?, ?);',
      [nome, numero, saldo, bloqueado, mainid, foto || null, saldoadd || null, comprando || 0]
    );
    return NextResponse.json({ success: true, id: result.insertId });
  } catch (error) {
    console.error('Error inserting contact:', error);
    return NextResponse.json({ error: 'Failed to insert contact' }, { status: 500 });
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
    console.error('Error deleting contact:', error);
    return NextResponse.json({ error: 'Failed to delete contact' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 });
  }

  try {
    // Obtener el estado actual de `bloqueado`
    const [contact] = await executeQuery(
      'SELECT bloqueado FROM contatos WHERE id = ?;',
      [id]
    );

    if (!contact) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }

    // Alternar el estado de `bloqueado`
    const newBloqueado = contact.bloqueado === 1 ? 0 : 1;

    // Actualizar el estado en la base de datos
    await executeQuery('UPDATE contatos SET bloqueado = ? WHERE id = ?;', [
      newBloqueado,
      id,
    ]);

    return NextResponse.json({ success: true, bloqueado: newBloqueado });
  } catch (error) {
    console.error('Error toggling block status:', error);
    return NextResponse.json({ error: 'Failed to toggle block status' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id');
  const { saldo } = await request.json();

  if (!id || saldo === undefined) {
    return NextResponse.json({ error: 'Missing id or saldo parameter' }, { status: 400 });
  }

  try {
    console.log('Updating saldo for contact with id:', id);
    await executeQuery('UPDATE contatos SET saldo = ? WHERE id = ?;', [saldo, id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating saldo:', error);
    return NextResponse.json({ error: 'Failed to update saldo' }, { status: 500 });
  }
}