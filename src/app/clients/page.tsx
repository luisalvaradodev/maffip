import { Suspense } from 'react';
import ClientList from '@/components/clients/client-list';
import { Skeleton } from '@/components/ui/skeleton';

export default function ClientsPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">Client Management</h1>
      <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
        <ClientList />
      </Suspense>
    </div>
  );
}