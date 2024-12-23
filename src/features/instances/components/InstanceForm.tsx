// app/instances/components/InstanceForm.tsx
'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Phone, Smartphone, Loader2 } from 'lucide-react'
import { createInstance, connectInstance } from '@/features/instances/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/hooks/use-toast'
import { QRCodeDialog } from './QRCodedialog'

const formSchema = z.object({
  instanceName: z.string().min(3, 'Instance name must be at least 3 characters'),
  countryCode: z.string(),
  phoneNumber: z.string().regex(/^\d{8,15}$/, 'Enter a valid phone number'),
})

const countryCodes = [
  { value: '+1', label: 'USA', code: 'US' },
  { value: '+44', label: 'UK', code: 'GB' },
  { value: '+34', label: 'Spain', code: 'ES' },
  { value: '+55', label: 'Brazil', code: 'BR' },
  { value: '+91', label: 'India', code: 'IN' },
  { value: '+86', label: 'China', code: 'CN' },
  { value: '+52', label: 'Mexico', code: 'MX' },
] as const

export function InstanceForm() {
  const [step, setStep] = useState(1)
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      instanceName: '',
      countryCode: '+1',
      phoneNumber: '',
    },
  })

  const { isSubmitting } = form.formState

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setProgress(33)
      const fullPhoneNumber = `${values.countryCode}${values.phoneNumber}`
      
      // Create instance
      const createResult = await createInstance({
        instanceName: values.instanceName,
        phoneNumber: fullPhoneNumber,
      })

      if (!createResult.success) {
        throw new Error(createResult.error)
      }

      setProgress(66)
      toast({
        title: 'Instance Created',
        description: 'Successfully created your WhatsApp instance',
      })

      // Connect instance
      const connectResult = await connectInstance(values.instanceName)
      
      if (!connectResult.success) {
        throw new Error(connectResult.error)
      }

      setProgress(100)
      setQrCode(connectResult.data.qrcode_url)
      setStep(2)

    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create instance',
        variant: 'destructive',
      })
      setProgress(0)
    }
  }

  const handleReset = () => {
    form.reset()
    setStep(1)
    setQrCode(null)
    setProgress(0)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create WhatsApp Instance</CardTitle>
        <CardDescription>
          Set up a new WhatsApp instance with your phone number
        </CardDescription>
      </CardHeader>
      <CardContent>
        {progress > 0 && <Progress value={progress} className="mb-4" />}
        
        {step === 1 && (
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
                        <Input placeholder="my-whatsapp" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="countryCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {countryCodes.map((country) => (
                            <SelectItem key={country.value} value={country.value}>
                              <span className="flex items-center space-x-2">
                                <span>{country.value}</span>
                                <span>{country.label}</span>
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <Input type="tel" placeholder="123456789" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Instance
              </Button>
            </form>
          </Form>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-medium">Instance Created Successfully!</h3>
              <p className="text-sm text-muted-foreground">
                Scan the QR code to connect your WhatsApp account
              </p>
            </div>
            <Button onClick={handleReset} className="w-full">
              Create Another Instance
            </Button>
          </div>
        )}

        <QRCodeDialog
          isOpen={!!qrCode}
          onClose={() => setQrCode(null)}
          qrCodeUrl={qrCode || ''}
        />
      </CardContent>
    </Card>
  )
}