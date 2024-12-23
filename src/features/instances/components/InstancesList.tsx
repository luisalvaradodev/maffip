// app/instances/components/instances-list.tsx
'use client'

import { useState, useCallback } from 'react'
import { connectInstance, deleteInstance, logoutInstance } from '@/features/instances/actions'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Loader2, QrCode, LogOut, Trash2, Search, RefreshCcw } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useToast } from '@/hooks/use-toast'
import { QRCodeDialog } from './QRCodedialog'

interface Instance {
  instanceName: string;
  instanceId: string;
  status: string;
  serverUrl: string;
  apikey: string;
  integration: unknown;
  profilePictureUrl?: string;
  profileName?: string;
}

interface APIInstance {
  instance: Instance;
}

interface DisplayInstance {
  instanceName: string;
  status: string;
  profilePictureUrl?: string;
  profileName?: string;
}

interface InstancesListProps {
  initialInstances: Instance[] // Changed from APIInstance[]
}

export function InstancesList({ initialInstances }: InstancesListProps) {
  // Create a safer transform function with error handling
  const transformInstances = useCallback((instances: Instance[]): DisplayInstance[] => {
    return instances.map(instance => ({
      instanceName: instance.instanceName,
      status: instance.status,
      profilePictureUrl: instance.profilePictureUrl,
      profileName: instance.profileName,
    }))
  }, [])

  const [instances, setInstances] = useState<DisplayInstance[]>(transformInstances(initialInstances))
  const [searchTerm, setSearchTerm] = useState('')
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({})
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { toast } = useToast()

  const setLoading = (instanceName: string, isLoading: boolean) => {
    setLoadingStates(prev => ({ ...prev, [instanceName]: isLoading }))
  }

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value.toLowerCase())
  }, [])

  // Add type guard to ensure instanceName exists
  const filteredInstances = instances.filter((instance): instance is DisplayInstance => {
    if (!instance || typeof instance.instanceName !== 'string') {
      console.warn('Invalid instance found:', instance)
      return false
    }
    return instance.instanceName.toLowerCase().includes(searchTerm)
  })

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/instance/fetchInstances`, {
        headers: {
          'apikey': process.env.API_KEY || 'mude-me',
          'Content-Type': 'application/json',
        },
      })
      const data: APIInstance[] = await response.json()
      
      // Extract instances from the nested structure
      const extractedInstances = data.map(item => item.instance)
      
      // Transform the instances to DisplayInstance format
      const transformedInstances = transformInstances(extractedInstances)
      
      setInstances(transformedInstances)
      
      toast({
        title: 'Refreshed',
        description: 'Instance list has been updated',
      })
    } catch (error) {
      console.error('Refresh error:', error)
      toast({
        title: 'Refresh Failed',
        description: 'Could not refresh instance list',
        variant: 'destructive',
      })
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleConnect = async (instanceName: string) => {
    setLoading(instanceName, true)
    try {
      const result = await connectInstance(instanceName)
      if (result.success && result.data.qrcode_url) {
        setQrCode(result.data.qrcode_url)
        toast({
          title: 'QR Code Generated',
          description: 'Scan the QR code with your WhatsApp',
        })
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      toast({
        title: 'Connection Failed',
        description: 'Could not generate QR code for the instance',
        variant: 'destructive',
      })
    } finally {
      setLoading(instanceName, false)
    }
  }

  const handleLogout = async (instanceName: string) => {
    setLoading(instanceName, true)
    try {
      const result = await logoutInstance(instanceName)
      if (result.success) {
        setInstances(prev =>
          prev.map(instance =>
            instance.instanceName === instanceName
              ? { ...instance, status: 'close' }
              : instance
          )
        )
        toast({
          title: 'Logged Out',
          description: `Successfully logged out of instance "${instanceName}"`,
        })
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      toast({
        title: 'Logout Failed',
        description: `Could not log out of instance "${instanceName}"`,
        variant: 'destructive',
      })
    } finally {
      setLoading(instanceName, false)
    }
  }

  const handleDelete = async (instanceName: string) => {
    setLoading(instanceName, true)
    try {
      const result = await deleteInstance(instanceName)
      if (result.success) {
        setInstances(prev => prev.filter(instance => instance.instanceName !== instanceName))
        toast({
          title: 'Instance Deleted',
          description: `Successfully deleted instance "${instanceName}"`,
        })
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      toast({
        title: 'Deletion Failed',
        description: `Could not delete instance "${instanceName}"`,
        variant: 'destructive',
      })
    } finally {
      setLoading(instanceName, false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Search className="w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search instances..."
            onChange={(e) => handleSearch(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          {isRefreshing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCcw className="h-4 w-4" />
          )}
          <span className="ml-2">Refresh</span>
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Status</TableHead>
              <TableHead>Instance</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence mode="wait">
              {filteredInstances.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                    No instances found
                  </TableCell>
                </TableRow>
              ) : (
                filteredInstances.map((instance) => (
                  <motion.tr
                    key={instance.instanceName}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                    className="group"
                  >
                    <TableCell>
                      <Badge
                        variant={instance.status === 'open' ? 'default' : 'destructive'}
                        className="whitespace-nowrap"
                      >
                        {instance.status === 'open' ? 'Connected' : 'Disconnected'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={instance.profilePictureUrl} />
                          <AvatarFallback>
                            {instance.instanceName.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{instance.instanceName}</div>
                          <div className="text-sm text-muted-foreground">
                            {instance.profileName || 'No profile name'}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleConnect(instance.instanceName)}
                          disabled={loadingStates[instance.instanceName] || instance.status === 'open'}
                        >
                          {loadingStates[instance.instanceName] ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <QrCode className="h-4 w-4 mr-2" />
                          )}
                          Connect
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleLogout(instance.instanceName)}
                          disabled={loadingStates[instance.instanceName] || instance.status === 'close'}
                        >
                          {loadingStates[instance.instanceName] ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <LogOut className="h-4 w-4 mr-2" />
                          )}
                          Logout
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="sm"
                              disabled={loadingStates[instance.instanceName] || instance.status === 'open'}
                            >
                              {loadingStates[instance.instanceName] ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4 mr-2" />
                              )}
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Instance</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete the instance "{instance.instanceName}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(instance.instanceName)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))
              )}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>

      <QRCodeDialog
        isOpen={!!qrCode}
        onClose={() => setQrCode(null)}
        qrCodeUrl={qrCode || ''}
      />
    </div>
  )
}