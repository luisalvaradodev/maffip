// app/actions/test.ts
'use server'

import { executeQuery } from "./db";



export async function testConnection() {
  try {
    const result = await executeQuery('SELECT 1 as test');
    console.log('Test query result:', result);
    return { success: true, message: 'Database connected successfully' };
  } catch (error) {
    console.error('Database connection test failed:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}