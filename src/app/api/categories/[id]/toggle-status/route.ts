import { NextResponse } from 'next/server';
import { executeQuery } from '@/features/data/actions/db';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    await executeQuery(
      'UPDATE categoria SET status = CASE WHEN status = "Ligada" THEN "Desligada" ELSE "Ligada" END WHERE id = ?',
      [id]
    );
    return NextResponse.json({ message: 'Category status toggled successfully' });
  } catch (error) {
    console.error('Error toggling category status:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

