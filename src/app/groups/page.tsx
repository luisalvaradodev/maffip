'use client'

import { useState, useEffect } from 'react'
import { GroupList } from '@/components/groups/GroupList'
import { GroupActions } from '@/components/groups/GroupActions'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Plus, Loader2 } from 'lucide-react'
import { CreateGroupDialog } from '@/components/groups/CreateGroupDialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Group {
  id: number
  jid: string
  nome: string
  participantes: number
  log: boolean
  log_adm: boolean
}

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('all')
  const { toast } = useToast()

  useEffect(() => {
    fetchGroups()
  }, [])

  const fetchGroups = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/groups')
      if (!response.ok) {
        throw new Error('Failed to fetch groups')
      }
      const data: Group[] = await response.json()
      setGroups(data)
    } catch (error) {
      console.error('Error fetching groups:', error)
      toast({
        title: "Error",
        description: "Failed to fetch groups. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAll = async () => {
    try {
      const response = await fetch('/api/groups', { method: 'DELETE' })
      if (!response.ok) {
        throw new Error('Failed to delete all groups')
      }
      setGroups([])
      toast({
        title: "Success",
        description: "All groups have been deleted.",
      })
    } catch (error) {
      console.error('Error deleting all groups:', error)
      toast({
        title: "Error",
        description: "Failed to delete all groups. Please try again.",
        variant: "destructive",
      })
    }
  }

  const filteredGroups = groups.filter(group =>
    (group.nome?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (group.jid || '').includes(searchTerm)
  )

  const tabGroups = {
    all: filteredGroups,
    logged: filteredGroups.filter(group => group.log),
    admin: filteredGroups.filter(group => group.log_adm),
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-8"
    >
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Group Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button onClick={() => setIsCreateDialogOpen(true)} size="lg" className="w-full md:w-auto">
                <Plus className="mr-2 h-5 w-5" />
                Create Group
              </Button>
            </motion.div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
              <Input
                placeholder="Search groups..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full"
              />
            </div>
          </div>
          <GroupActions 
            groupCount={filteredGroups.length} 
            onRefresh={fetchGroups} 
            onDeleteAll={handleDeleteAll}
          />
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="all">All Groups</TabsTrigger>
              <TabsTrigger value="logged">Logged Groups</TabsTrigger>
              <TabsTrigger value="admin">Admin Logged</TabsTrigger>
            </TabsList>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <TabsContent value={activeTab}>
                  {loading ? (
                    <div className="flex justify-center items-center h-64">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  ) : (
                    <GroupList 
                        groups={tabGroups[activeTab as keyof typeof tabGroups]}
                        onRefresh={fetchGroups} loading={false}                    />
                  )}
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </Tabs>
        </CardContent>
      </Card>
      <CreateGroupDialog 
        open={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen}
        onGroupCreated={fetchGroups}
      />
    </motion.div>
  )
}

