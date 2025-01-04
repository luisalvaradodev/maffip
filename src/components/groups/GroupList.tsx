'use client'

import { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { GroupActions } from './GroupActions'
import { Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"

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
}

export function GroupList({ groups, loading, onRefresh }: GroupListProps) {
  const [localGroups, setLocalGroups] = useState<Group[]>([])

  useEffect(() => {
    setLocalGroups(groups)
  }, [groups])

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
            {localGroups.map((group, index) => (
              <motion.tr
                key={group.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell>{group.jid}</TableCell>
                <TableCell>{group.nome}</TableCell>
                <TableCell>{group.participantes}</TableCell>
                <TableCell>
                  <Badge variant={group.log ? "default" : "secondary"}>
                    {group.log ? "Ativo" : "Desativado"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={group.log_adm ? "default" : "secondary"}>
                    {group.log_adm ? "Ativo" : "Desativado"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <GroupActions group={group} onRefresh={onRefresh} />
                </TableCell>
              </motion.tr>
            ))}
          </AnimatePresence>
        </TableBody>
      </Table>
    </div>
  )
}

