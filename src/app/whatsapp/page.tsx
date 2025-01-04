import WhatsAppStatus from '@/components/whatsapp/WhatsAppStatus'

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">WhatsApp Bot Dashboard</h1>
      <WhatsAppStatus />
    </main>
  )
}

