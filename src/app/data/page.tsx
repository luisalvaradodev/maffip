// app/page.tsx

import { getAllContacts } from "@/features/data/actions/contacts";
import { ContactsTable } from "@/features/data/components/ContactsTable";


export default async function Home() {
  const result = await getAllContacts();
  
  return (
    <main className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-8">Contacts Database Test</h1>
      
      {result.success ? (
        <ContactsTable contacts={result.data} />
      ) : (
        <div className="p-4 bg-red-50 text-red-500 rounded-md">
          {result.error}
        </div>
      )}
    </main>
  );
}