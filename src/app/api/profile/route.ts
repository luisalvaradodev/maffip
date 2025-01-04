import { NextResponse } from 'next/server';
import { executeQuery } from '@/features/data/actions/db';
import { RowDataPacket } from 'mysql2';

// GET: Obtener perfil por ID
export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing profile ID' }, { status: 400 });
  }

  try {
    const result = await executeQuery('SELECT * FROM auth WHERE id = ?', [id]);

    if (Array.isArray(result) && result.length > 0) {
      const profile = result[0] as RowDataPacket;
      return NextResponse.json(profile);
    } else {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

// PUT: Actualizar perfil por ID
export async function PUT(req: Request) {
  try {
    const body = await req.json(); // Obtener el cuerpo de la solicitud
    const {
      id,
      login,
      senha,
      permissao,
      img,
      token,
      jwt,
      data,  // La fecha que llega en formato ISO
      expirado,
      status,
      numero,
      bot,
      bonus,
      afiliado,
      tokenmp,
      dono,
      bonus_pix,
      bonus_pix_minimo,
    } = body;

    // Validar campos requeridos
    if (!id || !login || !senha) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Convertir la fecha al formato MySQL 'YYYY-MM-DD HH:MM:SS'
    const formattedDate = new Date(data).toISOString().slice(0, 19).replace('T', ' ');

    // Ejecutar la actualización en la base de datos
    const query = `
      UPDATE auth SET 
        login = ?, senha = ?, permissao = ?, img = ?, token = ?, jwt = ?, data = ?, expirado = ?, 
        status = ?, numero = ?, bot = ?, bonus = ?, afiliado = ?, tokenmp = ?, dono = ?, 
        bonus_pix = ?, bonus_pix_minimo = ? 
      WHERE id = ?
    `;

    const values = [
      login,
      senha,
      permissao,
      img,
      token,
      jwt,
      formattedDate,  // Usar la fecha formateada
      expirado,
      status,
      numero,
      bot,
      bonus,
      afiliado,
      tokenmp,
      dono,
      bonus_pix,
      bonus_pix_minimo,
      id,
    ];

    const result = await executeQuery(query, values);

    // Verificar si el resultado es de tipo OkPacket y comprobar affectedRows
    if ('affectedRows' in result && result.affectedRows > 0) {
      return NextResponse.json({ message: 'Profile updated successfully' });
    } else {
      return NextResponse.json({ error: 'Profile not found or no changes made' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
