// app/instances/page.tsx
import { fetchInstances } from '@/features/instances/actions'
import { InstanceForm } from '@/features/instances/components/InstanceForm'
import { InstancesList } from '@/features/instances/components/InstancesList'
import { Suspense } from 'react'

export default async function InstancesPage() {
  const { data: instances } = await fetchInstances()

  return (
    <div className="w-full min-h-screen p-4 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="w-full max-w-4xl mx-auto space-y-8">
Gestión de Instancias
        
        <div className="bg-white shadow-lg rounded-lg p-6">
          <Suspense fallback={<div>Loading form...</div>}>
            <InstanceForm />
          </Suspense>

          <Suspense fallback={<div>Loading instances...</div>}>
            <InstancesList initialInstances={instances} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}