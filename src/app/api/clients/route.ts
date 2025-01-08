import { NextResponse } from 'next/server';
import { executeQuery } from '@/features/data/actions/db';

export async function GET(request: Request) {
  try {
    // Obtener el mainid del usuario desde los headers o query params
    const url = new URL(request.url);
    const mainid = url.searchParams.get('mainid');

    if (!mainid) {
      return NextResponse.json(
        { error: 'mainid is required' },
        { status: 400 }
      );
    }

    // Consulta SQL para obtener los clientes filtrados por mainid
    const query = `
      SELECT 
        s.id,
        s.numero,
        s.nome,
        s.data as validade,
        s.valor,
        s.texto as produto
      FROM store s
      WHERE s.mainid = ?
    `;

    const clients = await executeQuery(query, [mainid]);

    if (!Array.isArray(clients)) {
      throw new Error('La respuesta de la base de datos no es un array');
    }

    return NextResponse.json(clients);
  } catch (error) {
    console.error('Error en GET /api/clients:', error);
    return NextResponse.json(
      { error: 'Failed to fetch clients', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nome, numero, valor, validade, produto, mainid } = body;

    if (!mainid) {
      return NextResponse.json(
        { error: 'mainid is required' },
        { status: 400 }
      );
    }

    // Consulta SQL para insertar un nuevo cliente
    const query = `
      INSERT INTO store (nome, numero, valor, data, texto, mainid)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const result = await executeQuery(query, [nome, numero, valor, validade, produto, mainid]);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error en POST /api/clients:', error);
    return NextResponse.json(
      { error: 'Failed to create client', details: error.message },
      { status: 500 }
    );
  }
}