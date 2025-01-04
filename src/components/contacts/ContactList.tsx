'use client'

import { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ContactActions } from './ContactActions'
import { Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"
import { Checkbox } from "@/components/ui/checkbox"

interface Contact {
  id: number
  numero: string
  nome: string
  foto: string
  mainid: number
  saldo: number | null
  saldoadd: string
  bloqueado: number
  comprando: number
}

interface ContactListProps {
  contacts: Contact[]
  loading: boolean
  onRefresh: () => void
  selectedContacts: number[]
  setSelectedContacts: (ids: number[]) => void
}

export function ContactList({ contacts, loading, onRefresh, selectedContacts, setSelectedContacts }: ContactListProps) {
  const [localContacts, setLocalContacts] = useState<Contact[]>([])

  useEffect(() => {
    setLocalContacts(contacts)
  }, [contacts])

  const handleSelectContact = (id: number) => {
    setSelectedContacts(
      selectedContacts.includes(id)
        ? selectedContacts.filter((contactId) => contactId !== id)
        : [...selectedContacts, id]
    )
  }

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
            <TableHead className="w-[50px]">Select</TableHead>
            <TableHead>#</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Numero</TableHead>
            <TableHead>Saldo</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Opções</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <AnimatePresence>
            {localContacts.map((contact, index) => (
              <motion.tr
                key={contact.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <TableCell>
                  <Checkbox
                    checked={selectedContacts.includes(contact.id)}
                    onCheckedChange={() => handleSelectContact(contact.id)}
                  />
                </TableCell>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{contact.nome}</TableCell>
                <TableCell>{contact.numero}</TableCell>
                <TableCell>{contact.saldo !== null && contact.saldo !== undefined ? contact.saldo.toFixed(2) : 'N/A'}</TableCell>
                <TableCell>
                  <Badge variant={contact.bloqueado === 1 ? "destructive" : "success"}>
                    {contact.bloqueado === 1 ? "Bloqueado" : "Ativo"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <ContactActions 
                    contact={contact} 
                    onRefresh={onRefresh}
                    selectedContacts={selectedContacts}
                    setSelectedContacts={setSelectedContacts}
                  />
                </TableCell>
              </motion.tr>
            ))}
          </AnimatePresence>
        </TableBody>
      </Table>
    </div>
  )
}

