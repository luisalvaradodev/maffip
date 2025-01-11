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
import { Loader2, Save, X, User, Shield, Settings, Smartphone } from 'lucide-react'
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

const sanitizeInitialData = (data: any) => {
  const defaultData = {
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
  }

  if (!data) return defaultData

  return Object.keys(defaultData).reduce((acc, key) => {
    acc[key] = data[key] !== null ? data[key] : defaultData[key]
    return acc
  }, {} as any)
}

export function UserForm({ onSubmit, initialData, mode, open, onOpenChange }: UserFormProps) {
  const [formData, setFormData] = useState(sanitizeInitialData(initialData))
  const [instanceData, setInstanceData] = useState({
    instanceName: '',
    phoneNumber: ''
  })
  const [activeTab, setActiveTab] = useState('basic')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (initialData) {
      setFormData(sanitizeInitialData(initialData))
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
        title: "Erro",
        description: "Todos os campos são obrigatórios. Por favor, preencha todos os campos.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }
    try {
      await onSubmit(formData, instanceData)
      toast({
        title: mode === 'create' ? "Usuário criado" : "Usuário atualizado",
        description: mode === 'create' ? "O usuário e a instância foram criados com sucesso." : "O usuário foi atualizado com sucesso.",
      })
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Erro",
        description: `Falha ao ${mode === 'create' ? 'criar' : 'atualizar'} o usuário. Por favor, tente novamente.`,
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
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-hidden flex flex-col p-4">
        <DialogHeader className="text-center">
          <DialogTitle className="flex items-center justify-center space-x-2">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {mode === 'create' ? 'Criar Novo Usuário' : 'Editar Usuário'}
            </motion.span>
          </DialogTitle>
          <DialogDescription className="text-center">
            {mode === 'create' 
              ? 'Preencha todos os detalhes para criar um novo usuário e instância.' 
              : 'Atualize os detalhes do usuário.'}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basic" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 gap-1">
            <TabsTrigger 
              value="basic"
              className={cn(
                "transition-all data-[state=active]:scale-105 data-[state=active]:shadow-sm",
                activeTab === "basic" && "font-semibold"
              )}
            >
              <User className="mr-2 h-4 w-4" />
              Básico
            </TabsTrigger>
            <TabsTrigger 
              value="advanced"
              className={cn(
                "transition-all data-[state=active]:scale-105 data-[state=active]:shadow-sm",
                activeTab === "advanced" && "font-semibold"
              )}
            >
              <Settings className="mr-2 h-4 w-4" />
              Avançado
            </TabsTrigger>
            {mode === 'create' && (
              <TabsTrigger 
                value="instance"
                className={cn(
                  "transition-all data-[state=active]:scale-105 data-[state=active]:shadow-sm",
                  activeTab === "instance" && "font-semibold"
                )}
              >
                <Smartphone className="mr-2 h-4 w-4" />
                Instância
              </TabsTrigger>
            )}
          </TabsList>

          <ScrollArea className="flex-grow pr-2 mt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <TabsContent value="basic" className="space-y-3">
                    {formFields.basic.map((key) => (
                      <div key={key} className="space-y-1">
                        <Label htmlFor={key} className="capitalize flex items-center">
                          {key === 'permissao' ? <Shield className="mr-2 h-4 w-4" /> : null}
                          {key.replace('_', ' ')}
                        </Label>
                        {key === 'permissao' ? (
                          <Select name={key} value={formData[key]} onValueChange={(value) => handleChange({ target: { name: key, value } })}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Selecione a permissão" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0">Usuário</SelectItem>
                              <SelectItem value="1">Administrador</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <Input
                            id={key}
                            name={key}
                            type={key === 'senha' ? 'password' : 'text'}
                            value={formData[key] || ''}
                            onChange={handleChange}
                            required
                            className="w-full"
                          />
                        )}
                      </div>
                    ))}
                  </TabsContent>
                  <TabsContent value="advanced" className="space-y-3">
                    <ScrollArea className="h-[200px]">
                      {formFields.advanced.map((key) => (
                        <div key={key} className="space-y-1">
                          <Label htmlFor={key} className="capitalize">
                            {key.replace('_', ' ')}
                          </Label>
                          <Input
                            id={key}
                            name={key}
                            type={key === 'data' ? 'date' : 'text'}
                            value={formData[key] || ''}
                            onChange={handleChange}
                            required
                            className="w-full"
                          />
                        </div>
                      ))}
                    </ScrollArea>
                  </TabsContent>
                  {mode === 'create' && (
                    <TabsContent value="instance" className="space-y-3">
                      <div className="space-y-1">
                        <Label htmlFor="instanceName">Nome da Instância</Label>
                        <Input
                          id="instanceName"
                          name="instanceName"
                          value={instanceData.instanceName}
                          onChange={handleInstanceChange}
                          required
                          className="w-full"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="phoneNumber">Número de Telefone</Label>
                        <Input
                          id="phoneNumber"
                          name="phoneNumber"
                          value={instanceData.phoneNumber}
                          onChange={handleInstanceChange}
                          required
                          className="w-full"
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
                  className="transition-all hover:scale-105 hover:shadow-sm"
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="transition-all hover:scale-105 hover:shadow-sm"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {mode === 'create' ? 'Criando...' : 'Atualizando...'}
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      {mode === 'create' ? 'Criar Usuário' : 'Atualizar Usuário'}
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