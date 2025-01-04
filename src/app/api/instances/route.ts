import { NextResponse } from 'next/server';

const API_URL = 'http://46.202.150.164:8080';
const API_KEY = process.env.EVOLUTION_API_KEY || '';

export async function GET() {
  const options = {
    method: 'GET',
    headers: { apikey: API_KEY }
  };

  try {
    const response = await fetch(`${API_URL}/instance/fetchInstances`, options);
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to fetch instances:', error);
    return NextResponse.json({ error: 'Failed to fetch instances' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const instanceName = searchParams.get('instanceName');

  if (!instanceName) {
    return NextResponse.json({ error: 'Instance name is required' }, { status: 400 });
  }

  const options = {
    method: 'DELETE',
    headers: { apikey: API_KEY }
  };

  try {
    const response = await fetch(`${API_URL}/instance/delete/${instanceName}`, options);
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to delete instance:', error);
    return NextResponse.json({ error: 'Failed to delete instance' }, { status: 500 });
  }
}

