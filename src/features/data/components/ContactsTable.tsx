// components/ContactsTable.tsx
'use client'

import { Contact } from '@/features/data/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ContactsTableProps {
  contacts: Contact[];
}

export function ContactsTable({ contacts }: ContactsTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Balance</TableHead>
            <TableHead>Added Balance</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.map((contact) => (
            <TableRow key={contact.id}>
              <TableCell>{contact.id}</TableCell>
              <TableCell>{contact.nome}</TableCell>
              <TableCell>{contact.numero}</TableCell>
              <TableCell>{contact.saldo}</TableCell>
              <TableCell>{contact.saldoadd || 0}</TableCell>
            </TableRow>
          ))}
          {contacts.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No contacts found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}