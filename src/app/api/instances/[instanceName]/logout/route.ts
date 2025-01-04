import { NextResponse } from 'next/server';

const API_URL = 'http://46.202.150.164:8080';
const API_KEY = process.env.EVOLUTION_API_KEY || '';

export async function DELETE(request: Request, { params }: { params: { instanceName: string } }) {
  const { instanceName } = params;

  const options = {
    method: 'DELETE',
    headers: { apikey: API_KEY }
  };

  try {
    const response = await fetch(`${API_URL}/instance/logout/${instanceName}`, options);
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to logout instance:', error);
    return NextResponse.json({ error: 'Failed to logout instance' }, { status: 500 });
  }
}

