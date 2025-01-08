import { NextResponse } from 'next/server';
import { executeQuery } from '@/features/data/actions/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Consulta SQL para obtener un cliente por ID
    const query = `
      SELECT 
        s.id,
        s.numero,
        s.nome,
        s.data as validade,
        s.valor,
        s.texto as produto
      FROM store s
      WHERE s.id = ?
    `;

    // Ejecutar la consulta
    const client = await executeQuery(query, [params.id]);

    // Verificar si se encontró el cliente
    if (!client || client.length === 0) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    // Devolver el cliente encontrado
    return NextResponse.json(client[0]);
  } catch (error) {
    console.error('Error en GET /api/clients/[id]:', error);
    return NextResponse.json(
      { error: 'Failed to fetch client', details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Obtener el cuerpo de la solicitud
    const body = await request.json();
    const { numero, nome, valor, validade, produto } = body; // Cambiar "texto" a "produto"

    // Consulta SQL para actualizar un cliente
    const query = `
      UPDATE store
      SET 
        numero = ?,
        nome = ?,
        valor = ?,
        data = ?,
        texto = ?
      WHERE id = ?
    `;

    // Ejecutar la consulta
    await executeQuery(query, [
      numero,
      nome,
      valor,
      validade,
      produto, // Cambiar "texto" a "produto"
      params.id,
    ]);

    // Devolver una respuesta exitosa
    return NextResponse.json({ message: 'Client updated successfully' });
  } catch (error) {
    console.error('Error en PUT /api/clients/[id]:', error);
    return NextResponse.json(
      { error: 'Failed to update client', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Consulta SQL para eliminar un cliente por ID
    const query = `
      DELETE FROM store
      WHERE id = ?
    `;

    // Ejecutar la consulta
    await executeQuery(query, [params.id]);

    // Devolver una respuesta exitosa
    return NextResponse.json({ message: 'Client deleted successfully' });
  } catch (error) {
    console.error('Error en DELETE /api/clients/[id]:', error);
    return NextResponse.json(
      { error: 'Failed to delete client', details: error.message },
      { status: 500 }
    );
  }
}