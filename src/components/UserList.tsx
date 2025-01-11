'use client'

import { useState, useMemo } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { UserForm } from "./UserForm"
import { motion, AnimatePresence } from "framer-motion"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Edit, Trash2 } from 'lucide-react'
import { Pagination } from "@/components/shared/pagination"
import { SkeletonTable } from "@/components/ui/skeleton-table"
import { DataTableToolbar } from "@/components/ui/data-table-toolbar"
import { cn } from "@/lib/utils"

export interface User {
  id: number
  login: string
  senha: string
  permissao: number
  img: string
  token: string
  jwt: string
  data: string
  expirado: number
  status: string
  numero: string
  bot: number
  bonus: number
  afiliado: number
  tokenmp: string
  dono: number
  bonus_pix: number
  bonus_pix_minimo: number
}

interface UserListProps {
  users: User[]
  onUpdate: (user: User) => void
  onDelete: (userId: number) => void
}

const ITEMS_PER_PAGE = 5

export function UserList({ users, onUpdate, onDelete }: UserListProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(false)

  const filteredUsers = useMemo(() => {
    return users.filter(user => 
      user.login.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.numero.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [users, searchQuery])

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setIsEditDialogOpen(true)
  }

  const handleUpdate = async (updatedUser: User) => {
    setLoading(true)
    try {
      await onUpdate(updatedUser)
      setSelectedUser(null)
      setIsEditDialogOpen(false)
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div className="space-y-4">
      <DataTableToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        placeholder="Pesquisar usuários..."
      />
      
      <div className="rounded-md border overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Usuário</TableHead>
              <TableHead>Permissão</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Número</TableHead>
              <TableHead>Bônus</TableHead>
              <TableHead>Afiliado</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <SkeletonTable columns={8} />
            ) : (
              <AnimatePresence mode="wait">
                {paginatedUsers.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={cn(
                      "group hover:bg-muted/50 transition-colors",
                      index % 2 === 0 ? "bg-background" : "bg-muted/20"
                    )}
                  >
                    <TableCell className="font-medium">{user.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8 transition-transform group-hover:scale-110">
                          <AvatarImage 
                            src={user.img || `https://api.dicebear.com/6.x/initials/svg?seed=${user.login}`} 
                            className="object-cover"
                          />
                          <AvatarFallback>{user.login.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{user.login}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={user.permissao === 1 ? "default" : "secondary"}
                        className="transition-all hover:scale-105"
                      >
                        {user.permissao === 1 ? 'Admin' : 'Usuário'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={user.status === 'active' ? "success" : "warning"}
                        className="transition-all hover:scale-105"
                      >
                        {user.status === 'active' ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.numero}</TableCell>
                    <TableCell>{user.bonus}</TableCell>
                    <TableCell>{user.afiliado}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          onClick={() => handleEdit(user)} 
                          size="sm" 
                          variant="outline"
                          className="transition-all hover:scale-105"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              className="transition-all hover:scale-105"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Excluir
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta ação não pode ser desfeita. Isso excluirá permanentemente o usuário
                                e removerá seus dados de nossos servidores.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => onDelete(user.id)}
                                className="transition-all hover:scale-105"
                              >
                                Continuar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

      {selectedUser && (
        <UserForm
          mode="edit"
          initialData={selectedUser}
          onSubmit={handleUpdate}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
        />
      )}
    </div>
  )
}