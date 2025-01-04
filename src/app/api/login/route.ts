import { NextResponse } from 'next/server';
import { executeQuery } from '@/features/data/actions/db'; // Asegúrate de tener esta función para ejecutar las queries MySQL
import { RowDataPacket } from 'mysql2';

export async function POST(req: Request) {
  const { login, password } = await req.json();  // Obtenemos las credenciales del body

  if (!login || !password) {
    return NextResponse.json({ error: 'Missing login or password' }, { status: 400 });
  }

  try {
    // Query para verificar las credenciales
    const result = await executeQuery('SELECT * FROM auth WHERE login = ? AND senha = ?', [login, password]);

    if (Array.isArray(result) && result.length > 0) {
      const user = result[0] as RowDataPacket;
      // El login es exitoso, devolvemos los datos del usuario y su id
      return NextResponse.json({ id: user.id, login: user.login });
    } else {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
