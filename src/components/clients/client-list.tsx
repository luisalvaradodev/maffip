'use client';

import { useState, useEffect } from 'react';
import { Contact } from '@/features/data/types';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { 
  Edit2, 
  Trash2, 
  UserPlus, 
  Search, 
  Download,
  Calendar,
  Package,
  DollarSign
} from 'lucide-react';
import ClientDialog from './client-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/shared/pagination';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CardShineEffect } from '@/components/ui/card-shine-effect';
import { ReportPreviewDialog } from './ReportPreviewDialog';  // Importa el componente

const ITEMS_PER_PAGE = 10;

export default function ClientList({ mainid }: { mainid: number }) {
  const [clients, setClients] = useState<Contact[]>([]);
  const [filteredClients, setFilteredClients] = useState<Contact[]>([]);
  const [selectedClient, setSelectedClient] = useState<Contact | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedClientForReport, setSelectedClientForReport] = useState<Contact | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  useEffect(() => {
    fetchClients();
  }, [mainid]);

  useEffect(() => {
    if (Array.isArray(clients)) {
      const filtered = clients.filter((client) => {
        const searchFields = [
          client.nome || "",
          client.numero || "",
          client.produto || "",
        ].map(field => field.toLowerCase());
        
        return searchFields.some(field => 
          field.includes(searchTerm.toLowerCase())
        );
      });
      setFilteredClients(filtered);
      setCurrentPage(1);
    } else {
      setFilteredClients([]);
    }
  }, [searchTerm, clients]);

  const totalPages = Math.ceil(filteredClients.length / ITEMS_PER_PAGE);
  const paginatedClients = Array.isArray(filteredClients)
    ? filteredClients.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
      )
    : [];

  const fetchClients = async () => {
    try {
      const response = await fetch(`/api/clients?mainid=${mainid}`);
      const data = await response.json();

      if (Array.isArray(data)) {
        setClients(data);
        setFilteredClients(data);
      } else {
        throw new Error('La respuesta de la API no es un array');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch clients',
        variant: 'destructive',
      });
      setClients([]);
      setFilteredClients([]);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`/api/clients/${id}`, { method: 'DELETE' });
      toast({
        title: 'Success',
        description: 'Client deleted successfully',
      });
      fetchClients();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete client',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (client: Contact) => {
    setSelectedClient(client);
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedClient(null);
    setIsDialogOpen(true);
  };

  const handlePreviewReport = (client: Contact) => {
    setSelectedClientForReport(client);
    setIsPreviewOpen(true);
  };

  const handleDownloadReport = async () => {
    if (selectedClientForReport) {
      try {
        const response = await fetch(`/api/clients/${selectedClientForReport.id}/report`);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `client-report-${selectedClientForReport.nome}.txt`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to download report',
          variant: 'destructive',
        });
      } finally {
        setIsPreviewOpen(false);
      }
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-8 max-w-7xl mx-auto space-y-8"
    >
      <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"
        >
          Gerenciamento de Clientes
        </motion.h2>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex gap-4 w-full sm:w-auto"
        >
          <div className="relative flex-1 sm:flex-initial group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground group-hover:text-primary transition-colors duration-200 w-4 h-4" />
            <Input
              placeholder="Pesquisar clientes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full min-w-[300px] border-muted/40 focus:border-primary hover:border-primary/60 transition-all duration-200"
            />
          </div>
          <Button
            onClick={handleCreate}
            className="bg-primary hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 relative overflow-hidden group"
          >
            <span className="relative z-10 flex items-center">
              <UserPlus className="mr-2 h-4 w-4" />
              Novo Cliente
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-primary-foreground/0 via-primary-foreground/10 to-primary-foreground/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          </Button>
        </motion.div>
      </div>

      <motion.div
        className="rounded-xl border shadow-lg overflow-hidden bg-card/50 backdrop-blur-sm relative group"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <CardShineEffect />
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/40 transition-colors duration-200">
              <TableHead className="w-[50px] font-semibold">Nº</TableHead>
              <TableHead className="font-semibold">Nome</TableHead>
              <TableHead className="font-semibold">Validade</TableHead>
              <TableHead className="font-semibold">Valor</TableHead>
              <TableHead className="font-semibold">Produto</TableHead>
              <TableHead className="font-semibold text-right">Opções</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {paginatedClients.map((client, index) => (
                <motion.tr
                  key={client.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className="group hover:bg-muted/30 transition-all duration-300"
                >
                  <TableCell className="font-medium w-[50px]">
                    {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(client.nome || '')}`} />
                        <AvatarFallback>
                          {client.nome?.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{client.nome}</p>
                        <p className="text-sm text-muted-foreground">{client.numero}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {client.validade ? (
                        format(new Date(client.validade), "dd 'de' MMMM',' yyyy", { locale: ptBR })
                      ) : (
                        'N/A'
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className={`font-mono ${Number(client.valor) < 0 ? 'text-destructive' : 'text-green-600'}`}>
                        {formatCurrency(Number(client.valor))}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      {client.produto ? client.produto.substring(0, 20) + '...' : 'N/A'}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handlePreviewReport(client)}
                        className="hover:bg-primary/10 hover:text-primary transition-all duration-200 transform hover:scale-110"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(client)}
                        className="hover:bg-primary/10 hover:text-primary transition-all duration-200 transform hover:scale-110"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(client.id)}
                        className="hover:bg-destructive/10 hover:text-destructive transition-all duration-200 transform hover:scale-110"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
      </motion.div>

      {totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </motion.div>
      )}

      <ClientDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        client={selectedClient}
        onSuccess={fetchClients}
        mainid={mainid}
      />

      {selectedClientForReport && (
        <ReportPreviewDialog
          open={isPreviewOpen}
          onOpenChange={setIsPreviewOpen}
          client={selectedClientForReport}
          onDownload={handleDownloadReport}
        />
      )}
    </motion.div>
  );
}