import { executeQuery } from '@/features/data/actions/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { mainid, message, selectedContacts } = await req.json();
    
    // Get contacts if no specific contacts are selected
    const contacts = selectedContacts || await executeQuery(
      'SELECT numero FROM contatos WHERE mainid = ? AND bloqueado = 0',
      [mainid]
    );

    // Send message to each contact using Evolution API
    const results = await Promise.all(
      contacts.map(async (contact) => {
        const options = {
          method: 'POST',
          headers: {
            'apikey': 'mude-me',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            options: {
              delay: 1000,
              presence: "composing"
            },
            number: contact.numero,
            textMessage: {
              text: message
            }
          })
        };

        try {
          const response = await fetch('http://46.202.150.164:8080/message/sendText/Test2', options);
          return response.json();
        } catch (error) {
          console.error(`Failed to send message to ${contact.numero}:`, error);
          return null;
        }
      })
    );

    return NextResponse.json({ success: true, results });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to send messages' },
      { status: 500 }
    );
  }
}