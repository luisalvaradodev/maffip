'use client'

import { useState, useTransition } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Smartphone, Loader2 } from 'lucide-react'
import { QRCodeSVG } from "qrcode.react"
import { createInstance, connectInstance, getConnectionState } from '@/features/instances/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/hooks/use-toast'

const formSchema = z.object({
  instanceName: z
    .string()
    .min(3, 'Instance name must be at least 3 characters')
    .regex(/^[a-zA-Z0-9-_]+$/, 'Only letters, numbers, hyphens, and underscores allowed'),
})

type FormValues = z.infer<typeof formSchema>

interface InstanceFormProps {
  refreshInstances: () => void
}

export function InstanceForm({ refreshInstances }: InstanceFormProps) {
  const [isPending, startTransition] = useTransition()
  const [activeTab, setActiveTab] = useState<"create" | "connect" | "finish">("create")
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const { toast } = useToast()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      instanceName: '',
    },
  })

  const startConnectionCheck = async (instanceName: string) => {
    const checkInterval = setInterval(async () => {
      try {
        const stateResult = await getConnectionState(instanceName)
        
        if (stateResult.success && stateResult.data.instance.state === 'open') {
          clearInterval(checkInterval)
          toast({ 
            title: 'Connection Successful',
            description: 'WhatsApp instance is now connected'
          })
          refreshInstances()
          setActiveTab("finish")
        }
      } catch (error) {
        console.error('Connection check failed:', error)
      }
    }, 5000)

    // Clean up interval on component unmount
    return () => clearInterval(checkInterval)
  }

  const onSubmit = (values: FormValues) => {
    startTransition(async () => {
      try {
        setProgress(33)
        
        // Create instance
        const createResult = await createInstance(values.instanceName)
        if (!createResult.success) {
          throw new Error(createResult.error)
        }

        setProgress(66)
        toast({
          title: 'Instance Created',
          description: 'Successfully created your WhatsApp instance',
        })

        // Connect instance - Modified to handle QR code response
        const connectResult = await connectInstance(values.instanceName)
        if (!connectResult.success) {
          throw new Error(connectResult.error)
        }

        setProgress(100)
        
        // Check if qrcode_url exists in the response
        if (connectResult.data.qrcode_url) {
          setQrCode(connectResult.data.qrcode_url)
          setActiveTab("connect")
          // Start polling for connection state
          startConnectionCheck(values.instanceName)
        } else {
          throw new Error('QR code not received from server')
        }

      } catch (error) {
        toast({
          title: 'Error',
          description: error instanceof Error ? error.message : 'Failed to create instance',
          variant: 'destructive',
        })
        setProgress(0)
      }
    })
  }

  const handleReset = () => {
    form.reset()
    setActiveTab("create")
    setQrCode(null)
    setProgress(0)
    refreshInstances()
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Tabs value={activeTab} onValueChange={(value: string) => setActiveTab(value as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="create">Create Instance</TabsTrigger>
            <TabsTrigger value="connect" disabled={!form.getValues('instanceName')}>
              Connect Instance
            </TabsTrigger>
            <TabsTrigger value="finish" disabled={activeTab !== "finish"}>
              Finish
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="instanceName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instance Name</FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <Smartphone className="w-4 h-4 text-muted-foreground" />
                          <Input 
                            placeholder="my-whatsapp"
                            {...field}
                            disabled={isPending}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {progress > 0 && <Progress value={progress} className="mb-4" />}

                <Button type="submit" disabled={isPending} className="w-full">
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Instance
                </Button>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="connect">
            <div className="space-y-6">
              {qrCode ? (
                <div className="flex flex-col items-center space-y-4">
                  <p className="text-lg font-medium bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-md p-4 animate-pulse">
                    Scan this QR code to connect your WhatsApp:
                  </p>
                  <QRCodeSVG value={qrCode} size={256} />
                </div>
              ) : (
                <div className="text-center py-4">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                  <p>Generating QR Code...</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="finish">
            <div className="text-center space-y-4">
              <p className="text-lg font-medium">Instance setup completed successfully!</p>
              <Button onClick={handleReset} className="w-full">
                Create Another Instance
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}