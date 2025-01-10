'use client'

import { useState, useEffect } from 'react'
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
  onRefresh: () => void // Función para refrescar la lista de grupos
  entriesPerPage: number
  onToggleLog: (groupId: number, type: 'log' | 'log_adm') => Promise<void>
}

export function GroupList({ groups, loading, entriesPerPage, onRefresh, onToggleLog }: GroupListProps) {
  const [localGroups, setLocalGroups] = useState<Group[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const { toast } = useToast()

  // Sincronizar el estado local con los grupos recibidos como prop
  useEffect(() => {
    setLocalGroups(groups)
  }, [groups])

  // Calcular el número total de páginas y los grupos paginados
  const totalPages = Math.ceil(localGroups.length / entriesPerPage)
  const paginatedGroups = localGroups.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  )

  // Función para alternar el estado de log o log_adm
  const handleToggleLog = async (group: Group, type: 'log' | 'log_adm') => {
    try {
      await onToggleLog(group.id, type)
      setLocalGroups(prevGroups =>
        prevGroups.map(g => (g.id === group.id ? { ...g, [type]: !g[type] } : g))
      )
      toast({
        title: "Success",
        description: `${type === 'log' ? 'Logging' : 'Admin logging'} ${!group[type] ? 'enabled' : 'disabled'} for ${group.nome}`,
      })
    } catch (error) {
      console.error('Error toggling log:', error)
      toast({
        title: "Error",
        description: "Failed to toggle log. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Función para eliminar un grupo
  const handleDelete = async (group: Group) => {
    toast({
      title: "Confirm Delete",
      description: `Are you sure you want to delete ${group.nome}?`,
      variant: "destructive",
      action: (
        <Button
          variant="destructive"
          size="sm"
          onClick={async () => {
            try {
              const response = await fetch(`/api/groups/${group.id}`, { method: 'DELETE' })
              if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Failed to delete group')
              }

              // Refrescar la lista de grupos desde el servidor
              onRefresh()

              // Mostrar un toast de éxito
              toast({
                title: "Success",
                description: `${group.nome} has been deleted.`,
                variant: "default",
              })
            } catch (error) {
              console.error('Error deleting group:', error)
              toast({
                title: "Error",
                description: error.message || "Failed to delete group. Please try again.",
                variant: "destructive",
              })
            }
          }}
        >
          Confirm
        </Button>
      ),
    })
  }

  // Mostrar un spinner si la tabla está cargando
  if (loading) {
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
                    onClick={() => handleToggleLog(group, 'log')}
                  >
                    {group.log ? "Ativo" : "Desativado"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={group.log_adm ? "default" : "secondary"}
                    className="cursor-pointer"
                    onClick={() => handleToggleLog(group, 'log_adm')}
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
                      <DropdownMenuItem onClick={() => handleToggleLog(group, 'log')}>
                        Toggle Logging
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleToggleLog(group, 'log_adm')}>
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