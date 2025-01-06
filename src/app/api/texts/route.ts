import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/features/data/actions/db';

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('mainid');
  
  if (!userId) {
    return NextResponse.json({ error: 'Missing mainid parameter' }, { status: 400 });
  }

  try {
    console.log('Fetching prefab texts for mainid:', userId);
    const texts = await executeQuery(
      'SELECT id, texto_contas, texto_telas, texto_titulo, texto_info, texto_suporte, mainid FROM textos WHERE mainid = ?;',
      [userId]
    );
    console.log('Prefab texts fetched successfully:', texts);
    return NextResponse.json(texts);
  } catch (error) {
    console.error('Error fetching prefab texts:', error);
    return NextResponse.json({ error: 'Failed to fetch prefab texts' }, { status: 500 });
  }
}

