import { NextResponse } from 'next/server';
import { executeQuery } from '@/features/data/actions/db';
import { RowDataPacket } from 'mysql2';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id'); // Obtener el id desde los query parameters

  try {
    // Verificar que id esté definido
    if (!id) {
      return NextResponse.json({ error: 'id no está definido' }, { status: 400 });
    }

    // Obtener información del usuario usando id
    const userRows = await executeQuery<RowDataPacket[]>(
      'SELECT id, login, data, expirado, status FROM auth WHERE id = ?',
      [id]
    );

    if (userRows.length === 0) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    const user = userRows[0];

    // Calcular días restantes antes de que expire el acceso
    const currentDate = new Date();
    const expirationDate = new Date(user.data);
    const timeDiff = expirationDate.getTime() - currentDate.getTime();
    const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));

    // Obtener estadísticas de ventas usando id
    const totalSalesRows = await executeQuery<RowDataPacket[]>(
      'SELECT SUM(valor) as total FROM store WHERE mainid = ?',
      [id]
    );
    const totalSales = totalSalesRows[0].total || 0;

    const availableProductsRows = await executeQuery<RowDataPacket[]>(
      'SELECT COUNT(*) as available FROM produtos WHERE disponivel = 1',
      []
    );
    const availableProducts = availableProductsRows[0].available || 0;

    const soldProductsRows = await executeQuery<RowDataPacket[]>(
      'SELECT COUNT(*) as sold FROM store WHERE vencido = 0',
      []
    );
    const soldProducts = soldProductsRows[0].sold || 0;

    // Calcular margen de lucro mensual (esto es un ejemplo, ajusta según tu lógica de negocio)
    const monthlyProfit = totalSales * 0.1; // 10% de margen de lucro

    return NextResponse.json({
      user: {
        id: user.id,
        login: user.login,
        data: user.data,
        expirado: user.expirado,
        status: user.status,
        daysRemaining: daysRemaining > 0 ? daysRemaining : 0,
      },
      totalSales,
      monthlyProfit,
      availableProducts,
      soldProducts,
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json({ error: 'Error fetching dashboard data' }, { status: 500 });
  }
}