import { NextResponse } from 'next/server';
import { executeQuery } from '@/features/data/actions/db';
import { OkPacket } from 'mysql2';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await request.json();
    const {
      login,
      senha,
      permissao,
      img,
      token,
      jwt,
      data,
      expirado,
      status,
      numero,
      bot,
      bonus,
      afiliado,
      tokenmp,
      dono,
      bonus_pix,
      bonus_pix_minimo
    } = body;

    const result = await executeQuery<OkPacket>(
      'UPDATE auth SET login = ?, senha = ?, permissao = ?, img = ?, token = ?, jwt = ?, data = ?, expirado = ?, status = ?, numero = ?, bot = ?, bonus = ?, afiliado = ?, tokenmp = ?, dono = ?, bonus_pix = ?, bonus_pix_minimo = ? WHERE id = ?',
      [login, senha, permissao, img, token, jwt, data, expirado, status, numero, bot, bonus, afiliado, tokenmp, dono, bonus_pix, bonus_pix_minimo, id]
    );

    if (result.affectedRows > 0) {
      return NextResponse.json({ message: 'User updated successfully' });
    } else {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const result = await executeQuery<OkPacket>('DELETE FROM auth WHERE id = ?', [id]);

    if (result.affectedRows > 0) {
      return NextResponse.json({ message: 'User deleted successfully' });
    } else {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}

