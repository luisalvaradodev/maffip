import { executeQuery } from '@/features/data/actions/db';
import { OkPacket, RowDataPacket } from 'mysql2';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { mainid, valor, numero, codigo } = await req.json();
    
    const result = await executeQuery<OkPacket>(
      'INSERT INTO gifts (mainid, valor, numero, codigo, resgatado) VALUES (?, ?, ?, ?, 0)',
      [mainid, valor, numero, codigo]
    );

    return NextResponse.json({ id: result.insertId }, { status: 201 });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create gift' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const mainid = searchParams.get('mainid');

    const gifts = await executeQuery<RowDataPacket[]>(
      'SELECT * FROM gifts WHERE mainid = ?',
      [mainid]
    );

    return NextResponse.json(gifts);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch gifts' },
      { status: 500 }
    );
  }
}