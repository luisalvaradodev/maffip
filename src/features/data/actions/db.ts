import mysql, { RowDataPacket, OkPacket } from 'mysql2/promise';

export const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'vmstore',
  port: 3306,
});

export async function executeQuery<T extends RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[]>(
  query: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: any[] = []
): Promise<T> {
  const [rows] = await pool.query<T>(query, params);
  return rows;
}
