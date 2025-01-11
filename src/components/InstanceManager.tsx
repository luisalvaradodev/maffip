'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, LogOut, PhoneCall, Loader2, MoreVertical, Server, Wifi, WifiOff } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { motion, AnimatePresence } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface Instance {
  instance: {
    instanceName: string
    status: string
    serverUrl: string
    state: string
  }
}

export function InstanceManager() {
  const [instances, setInstances] = useState<Instance[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [connectingInstance, setConnectingInstance] = useState<string | null>(null)
  const [, setDeletingInstance] = useState<string | null>(null)

  useEffect(() => {
    fetchInstances()
  }, [])

  const fetchInstances = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/instances')
      const data = await response.json()
      if (Array.isArray(data)) {
        const instancesWithState = await Promise.all(data.map(async (instance) => {
          const stateResponse = await fetch(`/api/instances/${instance.instance.instanceName}/state`)
          const stateData = await stateResponse.json()
          return {
            ...instance,
            instance: {
              ...instance.instance,
              state: stateData.instance.state,
            }
          }
        }))
        setInstances(instancesWithState)
      } else {
        console.error('Formato de dados inesperado:', data)
        setError('Formato de dados inesperado recebido do servidor.')
      }
    } catch (error) {
      console.error('Falha ao buscar instâncias:', error)
      setError('Falha ao buscar instâncias. Por favor, tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleRestart = async (instanceName: string) => {
    try {
      const response = await fetch(`/api/instances/${instanceName}/restart`, { method: 'PUT' })
      if (response.ok) {
        toast({
          title: "Instância reiniciada",
          description: `A instância ${instanceName} foi reiniciada.`,
        })
        fetchInstances()
      } else {
        throw new Error('Falha ao reiniciar a instância')
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao reiniciar a instância. Por favor, tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleLogout = async (instanceName: string) => {
    try {
      const response = await fetch(`/api/instances/${instanceName}/logout`, { method: 'DELETE' })
      if (response.ok) {
        toast({
          title: "Instância desconectada",
          description: `A instância ${instanceName} foi desconectada.`,
        })
        fetchInstances()
      } else {
        throw new Error('Falha ao desconectar a instância')
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao desconectar a instância. Por favor, tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (instanceName: string) => {
    try {
      setDeletingInstance(instanceName);
      const response = await fetch(`/api/instances?instanceName=${instanceName}`, {
        method: 'DELETE',
      });
  
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        if (response.ok) {
          toast({
            title: "Instância excluída",
            description: `A instância ${instanceName} foi excluída.`,
          });
          fetchInstances();
        } else {
          throw new Error(data.error || 'Falha ao excluir a instância');
        }
      } else {
        const text = await response.text();
        throw new Error(`Resposta inesperada: ${text}`);
      }
    } catch (error) {
      console.error('Erro ao excluir a instância:', error);
      toast({
        title: "Erro",
        description: error.message || "Falha ao excluir a instância. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setDeletingInstance(null);
    }
  };

  const handleConnect = async (instanceName: string) => {
    try {
      setConnectingInstance(instanceName)
      const response = await fetch(`/api/instances/${instanceName}/connect`)
      const data = await response.json()
      if (data.code) {
        setQrCode(data.code)
        const intervalId = setInterval(async () => {
          const stateResponse = await fetch(`/api/instances/${instanceName}/state`)
          const stateData = await stateResponse.json()
          if (stateData.instance.state === 'open') {
            clearInterval(intervalId)
            setQrCode(null)
            setConnectingInstance(null)
            fetchInstances()
          }
        }, 5000)
      } else {
        throw new Error('Falha ao obter o QR code')
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao conectar a instância. Por favor, tente novamente.",
        variant: "destructive",
      })
      setConnectingInstance(null)
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin" /></div>
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gerenciamento de Instâncias</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {instances.map((instance, index) => (
            <motion.div
              key={instance.instance.instanceName}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow duration-300 border border-muted/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${instance.instance.instanceName}`} />
                      <AvatarFallback>{instance.instance.instanceName.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg font-bold truncate">
                        {instance.instance.instanceName}
                      </CardTitle>
                      <span className="text-sm text-muted-foreground truncate">
                        {instance.instance.serverUrl}
                      </span>
                    </div>
                  </div>
                  <Badge 
                    variant={instance.instance.state === 'open' ? 'success' : 'destructive'}
                    className="flex items-center gap-1 truncate"
                  >
                    {instance.instance.state === 'open' ? (
                      <Wifi className="h-4 w-4" />
                    ) : (
                      <WifiOff className="h-4 w-4" />
                    )}
                    <span className="truncate">
                      {instance.instance.state === 'open' ? 'Conectado' : 'Desconectado'}
                    </span>
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Status:</span>
                    <Badge variant="outline" className="text-sm">
                      {instance.instance.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Tipo:</span>
                    <Badge variant="outline" className="text-sm">
                      <Server className="h-4 w-4 mr-1" />
                      Servidor
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            onClick={() => handleRestart(instance.instance.instanceName)} 
                            size="sm"
                            variant="outline"
                            disabled={instance.instance.state === 'open'}
                          >
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Reiniciar Instância</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            onClick={() => handleLogout(instance.instance.instanceName)} 
                            size="sm" 
                            variant="outline"
                            disabled={instance.instance.state === 'open'}
                          >
                            <LogOut className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Desconectar Instância</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          onClick={() => handleConnect(instance.instance.instanceName)} 
                          size="sm"
                          variant="outline"
                          disabled={instance.instance.state === 'open'}
                        >
                          <PhoneCall className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Conectar Instância</DialogTitle>
                          <DialogDescription>
                            Escaneie o QR code para conectar a instância.
                          </DialogDescription>
                        </DialogHeader>
                        {qrCode && (
                          <div className="flex justify-center">
                            <QRCodeSVG value={qrCode} size={256} />
                          </div>
                        )}
                        {connectingInstance === instance.instance.instanceName && !qrCode && (
                          <div className="text-center">Gerando QR code...</div>
                        )}
                      </DialogContent>
                    </Dialog>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleRestart(instance.instance.instanceName)}>
                          Reiniciar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleLogout(instance.instance.instanceName)}>
                          Desconectar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleConnect(instance.instance.instanceName)}>
                          Conectar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDelete(instance.instance.instanceName)}
                          className="text-red-600"
                        >
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}