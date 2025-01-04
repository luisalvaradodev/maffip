// app/features/data/actions/contacts.ts
'use server'

import { executeQuery } from './db';
import { Contact } from '@/features/data/types';

export async function getAllContacts() {
  try {
    const contacts = await executeQuery<Contact[]>(  // Tipo explícito de Contact[] aquí
      'SELECT * FROM contatos LIMIT 100'  // Limitar los resultados para evitar sobrecargar
    );
    return { success: true, data: contacts };
  } catch (error) {
    console.error('Failed to fetch contacts:', error);
    return { success: false, error: 'Failed to fetch contacts' };
  }
}
