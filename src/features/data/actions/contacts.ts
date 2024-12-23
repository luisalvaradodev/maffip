// app/actions/contacts.ts
'use server'


import { Contact } from '@/features/data/types';
import { executeQuery } from './db';

export async function getAllContacts() {
  try {
    const contacts = await executeQuery<Contact[]>(
      'SELECT * FROM contatos LIMIT 100'  // Added LIMIT for testing
    );
    return { success: true, data: contacts };
  } catch (error) {
    console.error('Failed to fetch contacts:', error);
    return { success: false, error: 'Failed to fetch contacts' };
  }
}