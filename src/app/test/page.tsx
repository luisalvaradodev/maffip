// app/test/page.tsx

import { testConnection } from "@/features/data/actions/test";


export default async function TestPage() {
  const result = await testConnection();
  
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Database Connection Test</h1>
      
      <div className={`p-4 rounded-md ${result.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
        {result.success ? result.message : result.error}
      </div>
    </div>
  );
}