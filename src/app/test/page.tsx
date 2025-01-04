/* eslint-disable @next/next/no-img-element */
// app/test/page.tsx
'use client'

import { useState } from "react";
import { getAllContacts } from "@/features/data/actions/contacts";

// Definir el tipo de Contact según lo que tienes en tu archivo types.ts
interface Contact {
  id: number;
  mainid: string;
  numero: string;
  nome: string;
  foto: string;
  saldo: number;
  saldoadd?: number;
}

export default function TestPage() {
  // Estado para almacenar los contactos
  const [contacts, setContacts] = useState<Contact[]>([]);
  // Estado para manejar errores
  const [error, setError] = useState<string | null>(null);
  // Estado de carga
  const [loading, setLoading] = useState<boolean>(false);

  // Función para hacer el fetch y mostrar los datos
  const handleFetchContacts = async () => {
    setLoading(true);
    setError(null); // Resetear error previo

    try {
      const result = await getAllContacts();
      console.log(result); // Para verificar la estructura de los datos recibidos
      if (result.success) {
        setContacts(result.data || []); // Si hay datos, actualizamos el estado
      } else {
        setError(result.error || "Unknown error");
      }
    } catch (err) {
      setError("Failed to fetch contacts");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Test Database Connection</h1>

      <button
        onClick={handleFetchContacts}
        className="bg-blue-500 text-white py-2 px-4 rounded-md mb-6"
      >
        Fetch Contacts
      </button>

      {loading && <p>Loading...</p>}
      {error && <div className="text-red-500">{error}</div>}

      {contacts.length > 0 && (
        <table className="min-w-full table-auto mt-6">
          <thead>
            <tr>
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Main ID</th>
              <th className="px-4 py-2 border">Phone</th>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Photo</th>
              <th className="px-4 py-2 border">Balance</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <tr key={contact.id}>
                <td className="px-4 py-2 border">{contact.id}</td>
                <td className="px-4 py-2 border">{contact.mainid}</td>
                <td className="px-4 py-2 border">{contact.numero}</td>
                <td className="px-4 py-2 border">{contact.nome}</td>
                <td className="px-4 py-2 border">
                  <img src={contact.foto} alt="Contact Foto" className="w-16 h-16 rounded-full" />
                </td>
                <td className="px-4 py-2 border">{contact.saldo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
