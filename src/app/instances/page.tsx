// app/instances/page.tsx
import { Suspense } from 'react'
import { fetchInstances } from '@/app/_actions/instance'
import { InstancesList } from './components/instances-list'
import { InstanceForm } from './components/instance-form'
import { PageHeader } from '@/components/ui/page-header'

export default async function InstancesPage() {
  const { data: instances } = await fetchInstances()

  return (
    <div className="w-full min-h-screen p-4 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="w-full max-w-4xl mx-auto space-y-8">
        <PageHeader
          title="Gestión de Instancias"
          description="Administra tus instancias de WhatsApp"
        />
        
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