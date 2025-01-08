import { Suspense } from 'react';
import ClientList from '@/components/clients/client-list';
import { Skeleton } from '@/components/ui/skeleton';

export default function ClientsPage({
  params,
}: {
  params: { mainid: string };
}) {
  const mainid = parseInt(params.mainid, 10); // Convertir el mainid a número

  return (
    <div className="container mx-auto py-10">
      <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
        <ClientList mainid={mainid} />
      </Suspense>
    </div>
  );
}