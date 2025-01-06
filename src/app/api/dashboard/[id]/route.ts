import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/features/data/actions/db';
import { RowDataPacket } from 'mysql2';

interface SalesData extends RowDataPacket {
  totalSales: number;
}

interface ProductData extends RowDataPacket {
  availableProducts: number;
}

interface UserData extends RowDataPacket {
  login: string;
  status: string;
}

export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id');
    console.log('Received request for dashboard with id:', id); // Verificar que el ID se esté recibiendo

    if (!id) {
      console.log('ID parameter is missing');
      return NextResponse.json({ error: 'ID parameter is missing' }, { status: 400 });
    }

    // Consulta para obtener la información del usuario
    const userQuery = `
      SELECT login, status
      FROM auth
      WHERE id = ?`;
    const userResult = await executeQuery<UserData[]>(userQuery, [id]);
    console.log('User result:', userResult); // Verificar los resultados de la consulta

    if (userResult.length === 0) {
      console.log('User not found');
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userInfo = userResult[0];
    console.log('User info:', userInfo); // Verificar que la información del usuario es correcta

    // Consulta para obtener el total de ventas
    const salesQuery = `
      SELECT COUNT(*) as totalSales 
      FROM store 
      WHERE mainid = ?`;
    const salesResult = await executeQuery<SalesData[]>(salesQuery, [id]);
    console.log('Sales result:', salesResult); // Verificar los resultados de ventas

    const totalSales = salesResult[0]?.totalSales || 0;

    // Consulta para obtener el total de productos disponibles
    const productsQuery = `
      SELECT COUNT(*) as availableProducts 
      FROM produtos 
      WHERE mainid = ? AND disponivel = 1`;
    const productsResult = await executeQuery<ProductData[]>(productsQuery, [id]);
    console.log('Products result:', productsResult); // Verificar los resultados de productos

    const availableProducts = productsResult[0]?.availableProducts || 0;

    // Obtenemos los datos para el dashboard
    const dashboardData = {
      userInfo,
      totalSales,
      availableProducts,
    };

    console.log('Sending dashboard data:', dashboardData); // Verificar los datos que se están enviando
    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json({ error: 'Error fetching dashboard data' }, { status: 500 });
  }
}
