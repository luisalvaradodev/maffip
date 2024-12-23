// app/diagnostic/page.tsx

import { testDatabaseConnection } from "@/features/data/actions/db";


export default async function DiagnosticPage() {
  const connectionResult = await testDatabaseConnection();

  return (
    <div className="container mx-auto py-10 space-y-6">
      <h1 className="text-2xl font-bold">Database Connection Diagnostic</h1>
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Connection Settings</h2>
        <div className="grid grid-cols-2 gap-2">
          <div>Host:</div>
          <div>{process.env.DB_HOST}</div>
          
          <div>Port:</div>
          <div>{process.env.DB_PORT || '3306'}</div>
          
          <div>Database:</div>
          <div>{process.env.DB_NAME}</div>
          
          <div>Connection Status:</div>
          <div className={connectionResult ? 'text-green-600' : 'text-red-600'}>
            {connectionResult ? 'Connected' : 'Failed to Connect'}
          </div>
        </div>
      </div>

      <div className="p-4 bg-yellow-50 text-yellow-800 rounded">
        <h3 className="font-semibold">Troubleshooting Steps:</h3>
        <ol className="list-decimal list-inside space-y-2 mt-2">
          <li>Verify MySQL is running on the specified port</li>
          <li>Check if the server allows remote connections</li>
          <li>Verify firewall settings allow incoming connections to MySQL port</li>
          <li>Confirm MySQL user has proper permissions for remote access</li>
          <li>Try connecting using a MySQL client (like MySQL Workbench) with the same credentials</li>
        </ol>
      </div>
    </div>
  );
}