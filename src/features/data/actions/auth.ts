'use server';

import { executeQuery } from './db';
import { User } from '@/features/data/types/index';
import { RowDataPacket } from 'mysql2';

interface UserRow extends User, RowDataPacket {}

export async function loginUser(login: string, senha: string) {
  try {
    const rows = await executeQuery<UserRow[]>(
      'SELECT * FROM auth WHERE login = ? AND senha = ?',
      [login, senha]
    );

    if (rows.length === 0) {
      return { success: false, message: 'Invalid credentials' };
    }

    const user = rows[0];

    if (user.status !== 'open' || user.expirado !== 0) {
      return { success: false, message: 'Account is inactive or expired' };
    }

    // Exclude the password field when returning the user
    const { senha: _, ...safeUser } = user;

    return { success: true, message: 'Login successful', user: safeUser };
  } catch (error) {
    console.error('Error while logging in:', error);
    return { success: false, message: 'Error during login' };
  }
}

