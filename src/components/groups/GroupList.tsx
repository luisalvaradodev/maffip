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
  onRefresh: () => void // Função para atualizar a lista de grupos
  entriesPerPage: number
  onToggleLog: (groupId: number, type: 'log' | 'log_adm') => Promise<void>
}

export function GroupList({ groups, loading, entriesPerPage, onRefresh, onToggleLog }: GroupListProps) {
  const [localGroups, setLocalGroups] = useState<Group[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const { toast } = useToast()

  // Sincronizar o estado local com os grupos recebidos como prop
  useEffect(() => {
    setLocalGroups(groups)
  }, [groups])

  // Calcular o número total de páginas e os grupos paginados
  const totalPages = Math.ceil(localGroups.length / entriesPerPage)
  const paginatedGroups = localGroups.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  )

  // Função para alternar o estado de log ou log_adm
  const handleToggleLog = async (group: Group, type: 'log' | 'log_adm') => {
    try {
      await onToggleLog(group.id, type)
      setLocalGroups(prevGroups =>
        prevGroups.map(g => (g.id === group.id ? { ...g, [type]: !g[type] } : g))
      )
      toast({
        title: "Sucesso",
        description: `${type === 'log' ? 'Log' : 'Log de admin'} ${!group[type] ? 'ativado' : 'desativado'} para ${group.nome}`,
      })
    } catch (error) {
      console.error('Erro ao alternar log:', error)
      toast({
        title: "Erro",
        description: "Falha ao alternar log. Por favor, tente novamente.",
        variant: "destructive",
      })
    }
  }

  // Função para excluir um grupo
  const handleDelete = async (group: Group) => {
    toast({
      title: "Confirmar Exclusão",
      description: `Tem certeza que deseja excluir o grupo ${group.nome}?`,
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
                throw new Error(errorData.error || 'Falha ao excluir grupo')
              }

              // Atualizar a lista de grupos
              onRefresh()

              // Mostrar um toast de sucesso
              toast({
                title: "Sucesso",
                description: `O grupo ${group.nome} foi excluído com sucesso.`,
                variant: "default",
              })
            } catch (error) {
              console.error('Erro ao excluir grupo:', error)
              toast({
                title: "Erro",
                description: error.message || "Falha ao excluir grupo. Por favor, tente novamente.",
                variant: "destructive",
              })
            }
          }}
        >
          Confirmar
        </Button>
      ),
    })
  }

  // Mostrar um spinner se a tabela estiver carregando
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <Table className="border rounded-lg shadow-sm">
        <TableHeader className="bg-gray-100 dark:bg-gray-800">
          <TableRow>
            <TableHead className="w-[50px]">#</TableHead>
            <TableHead>ID do Grupo</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Participantes</TableHead>
            <TableHead>Logs</TableHead>
            <TableHead>Logs de Admin</TableHead>
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
                className="hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <TableCell>{(currentPage - 1) * entriesPerPage + index + 1}</TableCell>
                <TableCell>{group.jid}</TableCell>
                <TableCell>{group.nome}</TableCell>
                <TableCell>{group.participantes}</TableCell>
                <TableCell>
                  <Badge
                    variant={group.log ? "default" : "secondary"}
                    className="cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900"
                    onClick={() => handleToggleLog(group, 'log')}
                  >
                    {group.log ? "Ativo" : "Desativado"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={group.log_adm ? "default" : "secondary"}
                    className="cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900"
                    onClick={() => handleToggleLog(group, 'log_adm')}
                  >
                    {group.log_adm ? "Ativo" : "Desativado"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleToggleLog(group, 'log')}>
                        Alternar Log
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleToggleLog(group, 'log_adm')}>
                        Alternar Log de Admin
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleDelete(group)}>
                        Excluir
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
          Mostrando {(currentPage - 1) * entriesPerPage + 1} a {Math.min(currentPage * entriesPerPage, localGroups.length)} de {localGroups.length} entradas
        </p>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Próxima
          </Button>
        </div>
      </div>
    </div>
  )
}