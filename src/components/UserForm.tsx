'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, Save, X } from 'lucide-react'
import { cn } from "@/lib/utils"

interface UserFormProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (userData: any, instanceData: any) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialData?: any
  mode: 'create' | 'edit'
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UserForm({ onSubmit, initialData, mode, open, onOpenChange }: UserFormProps) {
  const [formData, setFormData] = useState(initialData || {
    login: '',
    senha: '',
    permissao: '0',
    img: '',
    token: '',
    jwt: '',
    data: new Date().toISOString().split('T')[0],
    expirado: '0',
    status: '',
    numero: '',
    bot: '0',
    bonus: '0',
    afiliado: '0',
    tokenmp: '',
    dono: '0',
    bonus_pix: '0',
    bonus_pix_minimo: '0',
  })

  const [instanceData, setInstanceData] = useState({
    instanceName: '',
    phoneNumber: ''
  })

  const [activeTab, setActiveTab] = useState('basic')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    }
  }, [initialData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | { target: { name: string; value: string } }) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleInstanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInstanceData({ ...instanceData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    if (Object.values(formData).some(value => value === '') || (mode === 'create' && Object.values(instanceData).some(value => value === ''))) {
      toast({
        title: "Error",
        description: "All fields are required. Please fill in all the fields.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }
    try {
      await onSubmit(formData, instanceData)
      toast({
        title: mode === 'create' ? "User created" : "User updated",
        description: mode === 'create' ? "The user and instance have been successfully created." : "The user has been successfully updated.",
      })
      onOpenChange(false)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${mode === 'create' ? 'create' : 'update'} user. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const formFields = {
    basic: ['login', 'senha', 'permissao', 'numero'],
    advanced: ['img', 'token', 'jwt', 'data', 'expirado', 'status', 'bot', 'bonus', 'afiliado', 'tokenmp', 'dono', 'bonus_pix', 'bonus_pix_minimo']
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {mode === 'create' ? 'Create New User' : 'Edit User'}
            </motion.span>
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' 
              ? 'Fill in all the details to create a new user and instance.' 
              : 'Update the user details.'}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basic" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger 
              value="basic"
              className={cn(
                "transition-all data-[state=active]:scale-105",
                activeTab === "basic" && "font-semibold"
              )}
            >
              Basic
            </TabsTrigger>
            <TabsTrigger 
              value="advanced"
              className={cn(
                "transition-all data-[state=active]:scale-105",
                activeTab === "advanced" && "font-semibold"
              )}
            >
              Advanced
            </TabsTrigger>
            {mode === 'create' && (
              <TabsTrigger 
                value="instance"
                className={cn(
                  "transition-all data-[state=active]:scale-105",
                  activeTab === "instance" && "font-semibold"
                )}
              >
                Instance
              </TabsTrigger>
            )}
          </TabsList>

          <ScrollArea className="flex-grow pr-4 mt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <TabsContent value="basic" className="space-y-4">
                    {formFields.basic.map((key) => (
                      <div key={key} className="space-y-2">
                        <Label htmlFor={key} className="capitalize">{key.replace('_', ' ')}</Label>
                        {key === 'permissao' ? (
                          <Select name={key} value={formData[key]} onValueChange={(value) => handleChange({ target: { name: key, value } })}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select permission" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0">User</SelectItem>
                              <SelectItem value="1">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <Input
                            id={key}
                            name={key}
                            type={key === 'senha' ? 'password' : 'text'}
                            value={formData[key]}
                            onChange={handleChange}
                            required
                          />
                        )}
                      </div>
                    ))}
                  </TabsContent>
                  <TabsContent value="advanced" className="space-y-4">
                  <ScrollArea className="h-60">
                    {formFields.advanced.map((key) => (
                      <div key={key} className="space-y-2">
                        <Label htmlFor={key} className="capitalize">{key.replace('_', ' ')}</Label>
                        <Input
                          id={key}
                          name={key}
                          type={key === 'data' ? 'date' : 'text'}
                          value={formData[key]}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    ))}
                    </ScrollArea>
                  </TabsContent>
                  {mode === 'create' && (
                    <TabsContent value="instance" className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="instanceName">Instance Name</Label>
                        <Input
                          id="instanceName"
                          name="instanceName"
                          value={instanceData.instanceName}
                          onChange={handleInstanceChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phoneNumber">Phone Number</Label>
                        <Input
                          id="phoneNumber"
                          name="phoneNumber"
                          value={instanceData.phoneNumber}
                          onChange={handleInstanceChange}
                          required
                        />
                      </div>
                    </TabsContent>
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="transition-all hover:scale-105"
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="transition-all hover:scale-105"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {mode === 'create' ? 'Creating...' : 'Updating...'}
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      {mode === 'create' ? 'Create User' : 'Update User'}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
