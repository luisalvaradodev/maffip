'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ContactList } from '@/components/contacts/ContactList';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Search, Plus, Send, RefreshCcw, Filter } from 'lucide-react';
import { CreateContactDialog } from '@/components/contacts/CreateContactDialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { WhatsAppService } from '@/services/whatsapp';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Contact, Instance, PrefabText } from '@/features/data/types/contacts';

const ITEMS_PER_PAGE = 10;

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [instances, setInstances] = useState<Instance[]>([]);
  const [selectedInstance, setSelectedInstance] = useState<string>('');
  const [messageText, setMessageText] = useState('');
  const [selectedContacts, setSelectedContacts] = useState<number[]>([]);
  const [prefabTexts, setPrefabTexts] = useState<PrefabText[]>([]);
  const [selectedPrefabText, setSelectedPrefabText] = useState<PrefabText | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'blocked'>('all');
  const { toast } = useToast();

  const fetchContacts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/contacts?mainid=88');
      if (!response.ok) throw new Error('Failed to fetch contacts');
      const data: Contact[] = await response.json();
      setContacts(data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast({
        title: "Error",
        description: "Failed to fetch contacts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const fetchInstances = useCallback(async () => {
    try {
      const data = await WhatsAppService.fetchInstances();
      setInstances(data);
    } catch (error) {
      console.error('Error fetching instances:', error);
      toast({
        title: "Error",
        description: "Failed to fetch WhatsApp instances. Please try again.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const fetchPrefabTexts = useCallback(async () => {
    try {
      const response = await fetch('/api/texts?mainid=88');
      if (!response.ok) throw new Error('Failed to fetch prefab texts');
      const data: PrefabText[] = await response.json();
      setPrefabTexts(data);
    } catch (error) {
      console.error('Error fetching prefab texts:', error);
      toast({
        title: "Error",
        description: "Failed to fetch prefab texts. Please try again.",
        variant: "destructive",
      });
    }
  }, [toast]);

  useEffect(() => {
    fetchContacts();
    fetchInstances();
    fetchPrefabTexts();
  }, [fetchContacts, fetchInstances, fetchPrefabTexts]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchContacts();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const formatPhoneNumber = (number: string): string => {
    const cleaned = number.replace(/\D/g, ""); // Elimina caracteres no numéricos
    return cleaned.startsWith("0") ? `+58${cleaned.slice(1)}` : cleaned; // Agrega el código de país si es necesario
  };
  
  const checkInstanceStatus = async (instanceName: string): Promise<boolean> => {
    const response = await fetch(
      `http://46.202.150.164:8080/instance/connectionState/${instanceName}`,
      { headers: { apikey: "mude-me" } }
    );
    if (!response.ok) {
      console.error("Error al verificar el estado de la instancia");
      return false;
    }
    const { instance } = await response.json();
    return instance.state === "open"; // Verifica que la instancia esté abierta
  };
  
  const handleSendMessage = async () => {
    if (!selectedInstance || !selectedPrefabText || selectedContacts.length === 0) {
      toast({
        title: "Error",
        description: "Por favor, selecciona una instancia, un mensaje prefabricado y al menos un contacto.",
        variant: "destructive",
      });
      return;
    }
  
    try {
      let successCount = 0;
      let failureCount = 0;
  
      // Verifica el estado de la instancia antes de continuar
      const isInstanceConnected = await checkInstanceStatus(selectedInstance);
      if (!isInstanceConnected) {
        toast({
          title: "Error",
          description: "La instancia seleccionada no está conectada.",
          variant: "destructive",
        });
        return;
      }
  
      await Promise.all(
        selectedContacts.map(async (contactId) => {
          const contact = contacts.find((c) => c.id === contactId);
          if (!contact) return;
  
          // Formatea el número antes de enviarlo
          const formattedNumber = formatPhoneNumber(contact.numero);
  
          const options = {
            method: "POST",
            headers: {
              apikey: "mude-me",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              options: {
                delay: 1000,
                presence: "composing",
              },
              number: formattedNumber, // Número del contacto formateado
              textMessage: { text: selectedPrefabText.texto_contas }, // Mensaje seleccionado
            }),
          };
  
          try {
            const response = await fetch(
              `http://46.202.150.164:8080/message/sendText/${selectedInstance}`,
              options
            );
            
            // Capturar la respuesta completa
            const responseBody = await response.json();
            if (!response.ok) {
              throw new Error(`Error al enviar mensaje a ${contact.numero}: ${JSON.stringify(responseBody)}`);
            }
  
            console.log(`Mensaje enviado a ${contact.numero}:`, responseBody);
            successCount++;
  
            toast({
              title: "Éxito",
              description: `Mensaje enviado a ${contact.nome}`,
            });
          } catch (error) {
            console.error(`Error al enviar mensaje a ${contact.nome}:`, error);
            failureCount++;
  
            toast({
              title: "Error",
              description: `Error al enviar mensaje a ${contact.nome}: ${error.message}`,
              variant: "destructive",
            });
          }
        })
      );
  
      toast({
        title: "Resumen",
        description: `${successCount} mensaje${successCount > 1 ? "s" : ""} enviado${successCount > 1 ? "s" : ""} exitosamente. ${
          failureCount > 0 ? `${failureCount} fallido${failureCount > 1 ? "s" : ""}.` : ""
        }`,
      });
  
      if (successCount > 0) {
        setSelectedContacts([]); // Limpiar selección después de enviar
      }
    } catch (error) {
      console.error("Error enviando mensajes:", error);
      toast({
        title: "Error",
        description: "Ocurrió un error inesperado al enviar mensajes.",
        variant: "destructive",
      });
    }
  };
  
  

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = (
      (contact.nome?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (contact.numero || '').includes(searchTerm)
    );
    
    const matchesStatus = statusFilter === 'all' 
      ? true 
      : statusFilter === 'blocked' 
        ? contact.bloqueado === 1
        : contact.bloqueado === 0;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredContacts.length / ITEMS_PER_PAGE);
  const paginatedContacts = filteredContacts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-8 space-y-6 px-4 sm:px-6 lg:px-8"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="w-full shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-2xl font-bold">Gerenciamento de Contatos</CardTitle>
            <div className="flex items-center space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                    Todos
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('active')}>
                    Ativos
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('blocked')}>
                    Bloqueados
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                onClick={handleRefresh}
                variant="ghost"
                size="icon"
                className={`transition-transform duration-700 ${isRefreshing ? 'animate-spin' : ''}`}
              >
                <RefreshCcw className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                Novo Contato
              </Button>
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                <Input
                  placeholder="Buscar contatos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 w-full"
                />
              </div>
            </div>
            
            <ScrollArea className="h-[600px]">
              <ContactList
                contacts={paginatedContacts}
                loading={loading}
                onRefresh={fetchContacts}
                selectedContacts={selectedContacts}
                setSelectedContacts={setSelectedContacts}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="w-full shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Mensagem em Massa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Select onValueChange={setSelectedInstance}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a Instância WhatsApp" />
                </SelectTrigger>
                <SelectContent>
                  {instances.map(instance => (
                    <SelectItem
                      key={instance.instance.instanceName}
                      value={instance.instance.instanceName}
                    >
                      {instance.instance.instanceName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select onValueChange={(value) => {
                const text = prefabTexts.find(t => t.id.toString() === value);
                if (text) {
                  setSelectedPrefabText(text);
                  setMessageText(text.texto_contas || '');
                }
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o Texto Predefinido" />
                </SelectTrigger>
                <SelectContent>
                  {prefabTexts.map(text => (
                    <SelectItem
                      key={text.id}
                      value={text.id.toString()}
                    >
                      {text.texto_titulo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Textarea
                placeholder="A mensagem selecionada aparecerá aqui..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                rows={4}
                className="resize-none"
              />

<Button
  disabled={!selectedInstance || !selectedPrefabText || selectedContacts.length === 0}
  onClick={handleSendMessage}
  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
>
  <Send className="mr-2 h-4 w-4" />
  Enviar Mensajes ({selectedContacts.length})
</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <CreateContactDialog
        open={isCreateDialogOpen}
        onOpenChange={() => setIsCreateDialogOpen(false)}
        onContactCreated={fetchContacts}
      />
    </motion.div>
  );
}
