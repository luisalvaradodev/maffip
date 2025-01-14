'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/hooks/use-toast'
import InstanceController from '@/lib/instanceController'

interface Instance {
  instanceName: string
  phoneNumber: string
  state: string
}

export default function InstanceManager() {
  const [instances, setInstances] = useState<Instance[]>([])
  const [newInstanceName, setNewInstanceName] = useState('')
  const [newPhoneNumber, setNewPhoneNumber] = useState('')
  const [selectedInstance, setSelectedInstance] = useState<string | null>(null)

  useEffect(() => {
    fetchInstances()
  }, [])

  const fetchInstances = async () => {
    try {
      const data = await InstanceController.fetchInstances('')
      setInstances(data)
    } catch (error) {
      console.error('Error fetching instances:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch instances',
        variant: 'destructive',
      })
    }
  }

  const createInstance = async () => {
    try {
      await InstanceController.createInstance(newInstanceName, newPhoneNumber)
      toast({
        title: 'Success',
        description: 'Instance created successfully',
      })
      setNewInstanceName('')
      setNewPhoneNumber('')
      fetchInstances()
    } catch (error) {
      console.error('Error creating instance:', error)
      toast({
        title: 'Error',
        description: 'Failed to create instance',
        variant: 'destructive',
      })
    }
  }

  const deleteInstance = async (instanceName: string) => {
    try {
      await InstanceController.deleteInstance(instanceName)
      toast({
        title: 'Success',
        description: 'Instance deleted successfully',
      })
      fetchInstances()
    } catch (error) {
      console.error('Error deleting instance:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete instance',
        variant: 'destructive',
      })
    }
  }

  const selectInstance = (instanceName: string) => {
    setSelectedInstance(instanceName)
    toast({
      title: 'Instance Selected',
      description: `Selected instance: ${instanceName}`,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Instance Manager</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="instanceName">Instance Name</Label>
              <Input
                id="instanceName"
                value={newInstanceName}
                onChange={(e) => setNewInstanceName(e.target.value)}
                placeholder="Enter instance name"
              />
            </div>
            <div>
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                value={newPhoneNumber}
                onChange={(e) => setNewPhoneNumber(e.target.value)}
                placeholder="Enter phone number"
              />
            </div>
          </div>
          <Button onClick={createInstance}>Create Instance</Button>
        </div>
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Existing Instances</h3>
          {instances.map((instance) => (
            <div key={instance.instanceName} className="flex items-center justify-between py-2 border-b">
              <div>
                <p className="font-medium">{instance.instanceName}</p>
                <p className="text-sm text-gray-500">{instance.phoneNumber}</p>
              </div>
              <div>
                <span className={`mr-2 px-2 py-1 rounded text-xs ${instance.state === 'CONNECTED' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {instance.state}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="mr-2"
                  onClick={() => selectInstance(instance.instanceName)}
                  disabled={selectedInstance === instance.instanceName}
                >
                  {selectedInstance === instance.instanceName ? 'Selected' : 'Select'}
                </Button>
                <Button variant="destructive" size="sm" onClick={() => deleteInstance(instance.instanceName)}>
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

