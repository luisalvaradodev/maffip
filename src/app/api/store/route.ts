import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/features/data/actions/db';
import { OkPacket } from 'mysql2';

export async function POST(request: NextRequest) {
  try {
    const { mainid, texto, id_produto, valor, nome } = await request.json();
    
    // Formatear el texto completo que incluirá toda la información
    const formattedText = `🛍️ Produto: ${id_produto}

${texto}

${nome}`;

    const result = await executeQuery<OkPacket>(
      'INSERT INTO store (numero, mainid, texto, id_produto, data, valor, nome, notificado, vencido) VALUES (NULL, ?, ?, ?, NOW(), ?, ?, 0, 0)',
      [mainid, formattedText, id_produto, valor, nome]
    );
    return NextResponse.json({ id: result.insertId }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

