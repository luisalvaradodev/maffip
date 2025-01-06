'use client'

import { useState, useEffect, useCallback } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Loader2, MoreHorizontal } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"

interface Group {
  id: number
  jid: string
  nome: string
  participantes: number
  log: boolean
  log_adm: boolean
}

interface GroupListProps {
  groups: Group[]
  loading: boolean
  onRefresh: () => void
  entriesPerPage: number
}

export function GroupList({ groups, loading, entriesPerPage }: GroupListProps) {
  const [localGroups, setLocalGroups] = useState<Group[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const fetchGroups = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/groups')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      console.log('Fetched groups:', data)
      setLocalGroups(data)
    } catch (error) {
      console.error('Error fetching groups:', error)
      toast({
        title: "Error",
        description: `Failed to fetch groups: ${error.message}`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchGroups()
  }, [fetchGroups])

  useEffect(() => {
    setLocalGroups(groups)
  }, [groups])

  const totalPages = Math.ceil(localGroups.length / entriesPerPage)
  const paginatedGroups = localGroups.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  )

  const toggleLog = useCallback(async (group: Group, type: 'log' | 'log_adm') => {
    try {
      const updatedGroup = { ...group, [type]: !group[type] }
      const response = await fetch(`/api/groups/${group.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedGroup),
      })
      if (!response.ok) throw new Error('Failed to update group')
      setLocalGroups(prevGroups => prevGroups.map(g => g.id === group.id ? updatedGroup : g))
      toast({ title: "Success", description: `${type === 'log' ? 'Logging' : 'Admin logging'} ${updatedGroup[type] ? 'enabled' : 'disabled'} for ${group.nome}` })
    } catch (error) {
      console.error('Error updating group:', error)
      toast({
        title: "Error",
        description: "Failed to update group. Please try again.",
        variant: "destructive",
      })
    }
  }, [toast])

  const handleDelete = useCallback(async (group: Group) => {
    if (window.confirm(`Are you sure you want to delete ${group.nome}?`)) {
      try {
        const response = await fetch(`/api/groups/${group.id}`, { method: 'DELETE' })
        if (!response.ok) throw new Error('Failed to delete group')
        setLocalGroups(prevGroups => prevGroups.filter(g => g.id !== group.id))
        toast({ title: "Success", description: `${group.nome} has been deleted.` })
      } catch (error) {
        console.error('Error deleting group:', error)
        toast({
          title: "Error",
          description: "Failed to delete group. Please try again.",
          variant: "destructive",
        })
      }
    }
  }, [toast])

  if (isLoading || loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">#</TableHead>
            <TableHead>ID Grupo</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Users</TableHead>
            <TableHead>Logs</TableHead>
            <TableHead>Logs Admin</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <AnimatePresence>
            {paginatedGroups.map((group, index) => (
              <motion.tr
                key={group.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <TableCell>{(currentPage - 1) * entriesPerPage + index + 1}</TableCell>
                <TableCell>{group.jid}</TableCell>
                <TableCell>{group.nome}</TableCell>
                <TableCell>{group.participantes}</TableCell>
                <TableCell>
                  <Badge 
                    variant={group.log ? "default" : "secondary"}
                    className="cursor-pointer"
                    onClick={() => toggleLog(group, 'log')}
                  >
                    {group.log ? "Ativo" : "Desativado"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={group.log_adm ? "default" : "secondary"}
                    className="cursor-pointer"
                    onClick={() => toggleLog(group, 'log_adm')}
                  >
                    {group.log_adm ? "Ativo" : "Desativado"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => toggleLog(group, 'log')}>
                        Toggle Logging
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toggleLog(group, 'log_adm')}>
                        Toggle Admin Logging
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleDelete(group)}>
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </motion.tr>
            ))}
          </AnimatePresence>
        </TableBody>
      </Table>
      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-muted-foreground">
          Showing {(currentPage - 1) * entriesPerPage + 1} to {Math.min(currentPage * entriesPerPage, localGroups.length)} of {localGroups.length} entries
        </p>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

