// lib/db.ts
import mysql from 'mysql2/promise';

interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  waitForConnections: boolean;
  connectionLimit: number;
  queueLimit: number;
  connectTimeout: number;
  enableKeepAlive: boolean;
  keepAliveInitialDelay: number;
}

if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_NAME) {
  throw new Error('Database configuration environment variables are not properly set');
}

const dbConfig: DatabaseConfig = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306', 10), // Changed to default MySQL port
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10, // Reduced from 1000 to more reasonable number
  queueLimit: 0,
  connectTimeout: 10000, // 10 seconds
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test function to diagnose connection issues
async function testDatabaseConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Successfully connected to database');
    
    // Test basic query
    const [result] = await connection.query('SELECT 1');
    console.log('Successfully executed test query:', result);
    
    connection.release();
    return true;
  } catch (error) {
    console.error('Database connection error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      code: (error as any).code,
      errno: (error as any).errno,
      syscall: (error as any).syscall,
      hostname: process.env.DB_HOST,
      port: process.env.DB_PORT
    });
    return false;
  }
}

// Execute the test on module load
testDatabaseConnection();

async function executeQuery<T>(query: string, params: any[] = []): Promise<T> {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute(query, params);
    return rows as T;
  } finally {
    connection.release();
  }
}

export { pool, executeQuery, testDatabaseConnection };