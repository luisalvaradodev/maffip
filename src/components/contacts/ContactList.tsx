import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ContactActions } from './ContactActions';
import { Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import { Pagination } from "@/components/shared/pagination";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Contact {
  id: number;
  numero: string;
  nome: string;
  foto: string;
  mainid: number;
  saldo: number | null;
  saldoadd: string;
  bloqueado: number;
  comprando: number;
}

interface ContactListProps {
  contacts: Contact[];
  loading: boolean;
  onRefresh: () => void;
  selectedContacts: number[];
  setSelectedContacts: (ids: number[]) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const formatSaldo = (saldo: number | string | null | undefined): string => {
  if (saldo === null || saldo === undefined) return 'N/A';
  const numSaldo = typeof saldo === 'string' ? parseFloat(saldo) : saldo;
  return isNaN(numSaldo) ? 'N/A' : numSaldo.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
};

const getInitials = (name: string | null | undefined): string => {
  if (!name) return ''; // Devuelve un valor por defecto si el nombre no es válido
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};


export function ContactList({
  contacts,
  loading,
  onRefresh,
  selectedContacts,
  setSelectedContacts,
  currentPage,
  totalPages,
  onPageChange
}: ContactListProps) {
  const [localContacts, setLocalContacts] = useState<Contact[]>([]);

  useEffect(() => {
    setLocalContacts(contacts);
  }, [contacts]);

  const handleSelectContact = (id: number) => {
    setSelectedContacts(
      selectedContacts.includes(id)
        ? selectedContacts.filter((contactId) => contactId !== id)
        : [...selectedContacts, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedContacts.length === contacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(contacts.map(contact => contact.id));
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Carregando contatos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={selectedContacts.length === contacts.length && contacts.length > 0}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead>Contato</TableHead>
              <TableHead>Número</TableHead>
              <TableHead>Saldo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence mode="wait">
              {localContacts.map((contact) => (
                <motion.tr
                  key={contact.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="group hover:bg-muted/50"
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedContacts.includes(contact.id)}
                      onCheckedChange={() => handleSelectContact(contact.id)}
                      aria-label={`Select ${contact.nome}`}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={contact.foto} alt={contact.nome} />
                        <AvatarFallback>{getInitials(contact.nome)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium">{contact.nome}</span>
                        <span className="text-xs text-muted-foreground">ID: {contact.id}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{contact.numero}</TableCell>
                  <TableCell>
                    <span className={`font-medium ${contact.saldo ? 'text-green-600' : 'text-red-600'}`}>
                      {formatSaldo(contact.saldo)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={contact.bloqueado === 1 ? "destructive" : "success"}
                      className="capitalize"
                    >
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
      
      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}