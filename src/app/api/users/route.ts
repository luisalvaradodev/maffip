import { NextResponse } from 'next/server';
import { executeQuery } from '@/features/data/actions/db';
import { OkPacket } from 'mysql2';

export async function GET() {
  try {
    const result = await executeQuery('SELECT * FROM auth');
    
    // Ensure the result is always an array
    const users = Array.isArray(result) ? result : [];

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userData, instanceData } = await request.json();
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
    } = userData;

    const result = await executeQuery<OkPacket>(
      'INSERT INTO auth (login, senha, permissao, img, token, jwt, data, expirado, status, numero, bot, bonus, afiliado, tokenmp, dono, bonus_pix, bonus_pix_minimo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [login, senha, permissao, img, token, jwt, data, expirado, status, numero, bot, bonus, afiliado, tokenmp, dono, bonus_pix, bonus_pix_minimo]
    );

    if (result.affectedRows > 0) {
      // Create Evolution API instance
      await createEvolutionAPIInstance(instanceData.instanceName, instanceData.phoneNumber);
      return NextResponse.json({ message: 'User and instance created successfully' }, { status: 201 });
    } else {
      return NextResponse.json({ error: 'Failed to create user and instance' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error creating user and instance:', error);
    return NextResponse.json({ error: 'Failed to create user and instance' }, { status: 500 });
  }
}

async function createEvolutionAPIInstance(instanceName: string, phoneNumber: string) {
  const options = {
    method: 'POST',
    headers: { apikey: process.env.EVOLUTION_API_KEY || '', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      instanceName,
      qrcode: true,
      number: phoneNumber,
      integration: "WHATSAPP-BAILEYS",
      webhook_enabled: true,
      webhook_events: ["APPLICATION_STARTUP"],
      reject_call: true,
      groups_ignore: true,
      always_online: true,
      read_messages: true,
      read_status: true,
      websocket_enabled: true,
      websocket_events: ["APPLICATION_STARTUP"]
    })
  };

  try {
    const response = await fetch('http://46.202.150.164:8080/instance/create', options);
    const data = await response.json();
    console.log('Evolution API instance created:', data);
  } catch (error) {
    console.error('Failed to create Evolution API instance:', error);
    throw error;
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const {
      id,
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

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ error: 'Valid User ID is required' }, { status: 400 });
    }

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

