'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, LogOut, PhoneCall, Loader2, Plus, MoreVertical } from 'lucide-react'
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
    lastSeen?: string
    phoneNumber?: string
  }
}

export function InstanceManager() {
  const [instances, setInstances] = useState<Instance[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [connectingInstance, setConnectingInstance] = useState<string | null>(null)
  const [, setDeletingInstance] = useState<string | null>(null)
  const [isCreateInstanceDialogOpen, setIsCreateInstanceDialogOpen] = useState(false)
  const [newInstanceData, setNewInstanceData] = useState({ instanceName: '', phoneNumber: '' })

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
              lastSeen: new Date().toISOString(), // Simulated last seen time
              phoneNumber: instance.instance.phoneNumber || 'N/A'
            }
          }
        }))
        setInstances(instancesWithState)
      } else {
        console.error('Unexpected data format:', data)
        setError('Unexpected data format received from server.')
      }
    } catch (error) {
      console.error('Failed to fetch instances:', error)
      setError('Failed to fetch instances. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleRestart = async (instanceName: string) => {
    try {
      const response = await fetch(`/api/instances/${instanceName}/restart`, { method: 'PUT' })
      if (response.ok) {
        toast({
          title: "Instance restarted",
          description: `Instance ${instanceName} has been restarted.`,
        })
        fetchInstances()
      } else {
        throw new Error('Failed to restart instance')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to restart instance. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleLogout = async (instanceName: string) => {
    try {
      const response = await fetch(`/api/instances/${instanceName}/logout`, { method: 'DELETE' })
      if (response.ok) {
        toast({
          title: "Instance logged out",
          description: `Instance ${instanceName} has been logged out.`,
        })
        fetchInstances()
      } else {
        throw new Error('Failed to logout instance')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout instance. Please try again.",
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
  
      // Verificar si la respuesta es JSON
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        if (response.ok) {
          toast({
            title: "Instance deleted",
            description: `Instance ${instanceName} has been deleted.`,
          });
          fetchInstances();
        } else {
          throw new Error(data.error || 'Failed to delete instance');
        }
      } else {
        // Si la respuesta no es JSON, manejar el error
        const text = await response.text();
        throw new Error(`Unexpected response: ${text}`);
      }
    } catch (error) {
      console.error('Error deleting instance:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete instance. Please try again.",
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
        // Start polling for connection state
        const intervalId = setInterval(async () => {
          const stateResponse = await fetch(`/api/instances/${instanceName}/state`)
          const stateData = await stateResponse.json()
          if (stateData.instance.state === 'open') {
            clearInterval(intervalId)
            setQrCode(null)
            setConnectingInstance(null)
            fetchInstances()
          }
        }, 5000) // Poll every 5 seconds
      } else {
        throw new Error('Failed to get QR code')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect instance. Please try again.",
        variant: "destructive",
      })
      setConnectingInstance(null)
    }
  }

  const handleCreateInstance = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/instances', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newInstanceData),
      })
      if (response.ok) {
        toast({
          title: "Instance created",
          description: `Instance ${newInstanceData.instanceName} has been created.`,
        })
        setIsCreateInstanceDialogOpen(false)
        setNewInstanceData({ instanceName: '', phoneNumber: '' })
        fetchInstances()
      } else {
        throw new Error('Failed to create instance')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create instance. Please try again.",
        variant: "destructive",
      })
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
        <h2 className="text-2xl font-bold">Instance Management</h2>
        <Button onClick={() => setIsCreateInstanceDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create New Instance
        </Button>
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
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-bold truncate">{instance.instance.instanceName}</CardTitle>
                  <Avatar>
                    <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${instance.instance.instanceName}`} />
                    <AvatarFallback>{instance.instance.instanceName.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Status:</span>
                      <Badge variant={instance.instance.state === 'open' ? 'success' : 'warning'}>
                        {instance.instance.state}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Phone:</span>
                      <span className="text-sm">{instance.instance.phoneNumber}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Last Seen:</span>
                      <span className="text-sm">{new Date(instance.instance.lastSeen!).toLocaleString()}</span>
                    </div>
                    <div className="text-sm text-muted-foreground truncate">
                      {instance.instance.serverUrl}
                    </div>
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
                          <p>Restart Instance</p>
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
                          <p>Logout Instance</p>
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
                          <DialogTitle>Connect Instance</DialogTitle>
                          <DialogDescription>
                            Scan the QR code to connect the instance.
                          </DialogDescription>
                        </DialogHeader>
                        {qrCode && (
                          <div className="flex justify-center">
                            <QRCodeSVG value={qrCode} size={256} />
                          </div>
                        )}
                        {connectingInstance === instance.instance.instanceName && !qrCode && (
                          <div className="text-center">Generating QR code...</div>
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
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleRestart(instance.instance.instanceName)}>
                          Restart
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleLogout(instance.instance.instanceName)}>
                          Logout
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleConnect(instance.instance.instanceName)}>
                          Connect
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDelete(instance.instance.instanceName)}
                          className="text-red-600"
                        >
                          Delete
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
      <Dialog open={isCreateInstanceDialogOpen} onOpenChange={setIsCreateInstanceDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Instance</DialogTitle>
            <DialogDescription>
              Enter the details for the new instance.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateInstance} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="instanceName">Instance Name</Label>
              <Input
                id="instanceName"
                value={newInstanceData.instanceName}
                onChange={(e) => setNewInstanceData({ ...newInstanceData, instanceName: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                value={newInstanceData.phoneNumber}
                onChange={(e) => setNewInstanceData({ ...newInstanceData, phoneNumber: e.target.value })}
                required
              />
            </div>
            <Button type="submit">Create Instance</Button>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}

