'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ContactList } from '@/components/contacts/ContactList';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, Send, RefreshCcw, Filter, MessageSquare, Users } from 'lucide-react';
import { CreateContactDialog } from '@/components/contacts/CreateContactDialog';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const ITEMS_PER_PAGE = 10;

// Animaciones para el contenedor y los elementos
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

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
  const [selectedTextPart, setSelectedTextPart] = useState<'texto_titulo' | 'texto_contas' | 'texto_info' | 'texto_suporte' | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'blocked'>('all');
  const { toast } = useToast();

  // Fetch contacts from the API
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
        title: "Erro",
        description: "Falha ao buscar contatos. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Fetch WhatsApp instances
  const fetchInstances = useCallback(async () => {
    try {
      const data = await WhatsAppService.fetchInstances();
      setInstances(data);
    } catch (error) {
      console.error('Error fetching instances:', error);
      toast({
        title: "Erro",
        description: "Falha ao buscar instâncias do WhatsApp. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  }, [toast]);

  // Fetch prefab texts
  const fetchPrefabTexts = useCallback(async () => {
    try {
      const response = await fetch('/api/texts?mainid=88');
      if (!response.ok) throw new Error('Failed to fetch prefab texts');
      const data: PrefabText[] = await response.json();
      setPrefabTexts(data);
    } catch (error) {
      console.error('Error fetching prefab texts:', error);
      toast({
        title: "Erro",
        description: "Falha ao buscar textos pré-fabricados. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  }, [toast]);

  useEffect(() => {
    fetchContacts();
    fetchInstances();
    fetchPrefabTexts();
  }, [fetchContacts, fetchInstances, fetchPrefabTexts]);

  // Handle refresh action
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchContacts();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  // Format phone number
  const formatPhoneNumber = (number: string): string => {
    const cleaned = number.replace(/\D/g, "");
    return cleaned.startsWith("0") ? `+58${cleaned.slice(1)}` : cleaned;
  };

  // Check instance status
  const checkInstanceStatus = async (instanceName: string): Promise<boolean> => {
    const response = await fetch(
      `http://46.202.150.164:8080/instance/connectionState/${instanceName}`,
      { headers: { apikey: "mude-me" } }
    );
    if (!response.ok) {
      console.error("Error checking instance status");
      return false;
    }
    const { instance } = await response.json();
    return instance.state === "open";
  };

  // Replace contact data in the message template
  const replaceContactData = (text: string, contact: Contact) => {
    return text
      .replace(/{user}/g, contact.nome || '')
      .replace(/{numero}/g, contact.numero || '')
      .replace(/{saldo}/g, contact.saldo?.toString() || '');
  };

  // Handle sending messages
  const handleSendMessage = async () => {
    if (selectedContacts.length === 0) {
      toast({
        title: "Aviso",
        description: "Por favor, selecione pelo menos um contato.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedInstance) {
      toast({
        title: "Aviso",
        description: "Por favor, selecione uma instância do WhatsApp.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedPrefabText) {
      toast({
        title: "Aviso",
        description: "Por favor, selecione um modelo de mensagem.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedTextPart) {
      toast({
        title: "Aviso",
        description: "Por favor, selecione o tipo de mensagem.",
        variant: "destructive",
      });
      return;
    }

    try {
      let successCount = 0;
      let failureCount = 0;

      const isInstanceConnected = await checkInstanceStatus(selectedInstance);
      if (!isInstanceConnected) {
        toast({
          title: "Erro",
          description: "A instância selecionada não está conectada.",
          variant: "destructive",
        });
        return;
      }

      await Promise.all(
        selectedContacts.map(async (contactId) => {
          const contact = contacts.find((c) => c.id === contactId);
          if (!contact) return;

          const formattedNumber = formatPhoneNumber(contact.numero);
          const selectedText = selectedPrefabText[selectedTextPart] || '';
          const message = replaceContactData(selectedText, contact);

          try {
            const response = await fetch(
              `http://46.202.150.164:8080/message/sendText/${selectedInstance}`,
              {
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
                  number: formattedNumber,
                  textMessage: { text: message },
                }),
              }
            );

            if (!response.ok) {
              throw new Error(`Failed to send message to ${contact.numero}`);
            }

            successCount++;
            toast({
              title: "Sucesso",
              description: `Mensagem enviada para ${contact.nome}`,
            });
          } catch (error) {
            failureCount++;
            toast({
              title: "Erro",
              description: `Falha ao enviar mensagem para ${contact.nome}`,
              variant: "destructive",
            });
          }
        })
      );

      toast({
        title: "Resumo",
        description: `${successCount} mensagem${successCount !== 1 ? 's' : ''} enviada${successCount !== 1 ? 's' : ''} com sucesso. ${
          failureCount > 0 ? `${failureCount} falha${failureCount !== 1 ? 's' : ''}.` : ''
        }`,
      });

      if (successCount > 0) {
        setSelectedContacts([]);
      }
    } catch (error) {
      console.error("Error sending messages:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro inesperado ao enviar as mensagens.",
        variant: "destructive",
      });
    }
  };

  // Filter contacts based on search term and status
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

  // Pagination logic
  const totalPages = Math.ceil(filteredContacts.length / ITEMS_PER_PAGE);
  const paginatedContacts = filteredContacts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Update message text when selected contacts or prefab text changes
  useEffect(() => {
    if (selectedContacts.length > 0 && selectedPrefabText && selectedTextPart) {
      const contact = contacts.find((c) => c.id === selectedContacts[0]);
      if (contact) {
        const selectedText = selectedPrefabText[selectedTextPart] || '';
        const message = replaceContactData(selectedText, contact);
        setMessageText(message);
      }
    } else {
      setMessageText('');
    }
  }, [selectedContacts, selectedPrefabText, selectedTextPart, contacts]);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-background text-foreground">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="container mx-auto max-w-7xl space-y-12"
      >
        {/* Header Section */}
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              Gerenciamento de Contatos
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Gerencie seus contatos e envie mensagens em massa de forma eficiente
            </p>
          </div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              size="lg"
              className="shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus className="mr-2 h-5 w-5" />
              Novo Contato
            </Button>
          </motion.div>
        </motion.div>

        {/* Tabs Section */}
        <Tabs defaultValue="contacts" className="space-y-8">
          <motion.div variants={itemVariants}>
            <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
              <TabsTrigger value="contacts" className="flex items-center">
                <Users className="mr-2 h-4 w-4" />
                Contatos
              </TabsTrigger>
              <TabsTrigger value="messaging" className="flex items-center">
                <MessageSquare className="mr-2 h-4 w-4" />
                Mensagens
              </TabsTrigger>
            </TabsList>
          </motion.div>

          {/* Contacts Tab */}
          <TabsContent value="contacts">
            <motion.div variants={itemVariants}>
              <Card className="shadow-lg">
                <CardHeader className="border-b">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          placeholder="Pesquisar contatos..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 w-full sm:w-[300px]"
                        />
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Filter className="h-4 w-4 mr-2" />
                            Filtrar
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[200px]">
                          <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                            Todos os Contatos
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setStatusFilter('active')}>
                            Somente Ativos
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setStatusFilter('blocked')}>
                            Bloqueados
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <motion.div
                      whileHover={{ rotate: 180 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Button
                        onClick={handleRefresh}
                        variant="ghost"
                        size="sm"
                        className={`transition-all duration-500 ${isRefreshing ? 'animate-spin' : ''}`}
                      >
                        <RefreshCcw className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[600px]">
                    <AnimatePresence mode="wait">
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
                    </AnimatePresence>
                  </ScrollArea>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Messaging Tab */}
          <TabsContent value="messaging">
            <motion.div variants={itemVariants}>
              <Card className="shadow-lg">
                <CardHeader className="border-b">
                  <CardTitle className="flex items-center text-2xl">
                    <MessageSquare className="mr-3 h-6 w-6" />
                    Mensagens em Massa
                    {selectedContacts.length > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-3"
                      >
                        <Badge variant="secondary" className="text-sm px-3 py-1">
                          {selectedContacts.length} selecionado{selectedContacts.length !== 1 ? 's' : ''}
                        </Badge>
                      </motion.div>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* WhatsApp Instances and Prefab Texts */}
                    <motion.div
                      className="space-y-6"
                      variants={itemVariants}
                    >
                      <div>
                        <h3 className="text-xl font-semibold mb-4">Instância do WhatsApp</h3>
                        <div className="grid grid-cols-2 gap-3">
                          {instances.map(instance => (
                            <motion.div
                              key={instance.instance.instanceName}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Button
                                variant={selectedInstance === instance.instance.instanceName ? "default" : "outline"}
                                onClick={() => setSelectedInstance(instance.instance.instanceName)}
                                className="w-full justify-start h-auto py-3"
                              >
                                <div className="flex items-center">
                                  <div className={`w-2 h-2 rounded-full mr-2 ${
                                    instance.instance.state === "open" ? "bg-green-500" : "bg-gray-400"
                                  }`} />
                                  <span className="truncate">{instance.instance.instanceName}</span>
                                </div>
                              </Button>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      <Separator className="my-6" />

                      <div>
                        <h3 className="text-xl font-semibold mb-4">Modelo de Mensagem</h3>
                        <ScrollArea className="h-[300px] rounded-lg border">
                          <div className="p-4 space-y-3">
                            {prefabTexts.map(text => (
                              <motion.div
                                key={text.id}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => {
                                  setSelectedPrefabText(text);
                                  setSelectedTextPart(null);
                                  setMessageText('');
                                }}
                                className={`p-4 rounded-lg cursor-pointer transition-all ${
                                  selectedPrefabText?.id === text.id
                                    ? "bg-primary/10 border-primary shadow-sm"
                                    : "hover:bg-muted"
                                }`}
                              >
                                <p className="font-medium">{text.texto_titulo}</p>
                                <p className="text-sm text-muted-foreground truncate mt-1">
                                  {text.texto_contas.substring(0, 50)}...
                                </p>
                              </motion.div>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>
                    </motion.div>

                    {/* Message Content and Send Button */}
                    <motion.div
                      className="space-y-6"
                      variants={itemVariants}
                    >
                      {selectedPrefabText && (
                        <AnimatePresence mode="wait">
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-6"
                          >
                            <h3 className="text-xl font-semibold">Conteúdo da Mensagem</h3>
                            <div className="grid grid-cols-2 gap-3">
                              {['texto_titulo', 'texto_contas', 'texto_info', 'texto_suporte'].map((part) => (
                                <motion.div
                                  key={part}
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  <Button
                                    variant={selectedTextPart === part ? "default" : "outline"}
                                    onClick={() => setSelectedTextPart(part as any)}
                                    className="w-full justify-start"
                                  >
                                    {part.split('_')[1].charAt(0).toUpperCase() + part.split('_')[1].slice(1)}
                                  </Button>
                                </motion.div>
                              ))}
                            </div>

                            <Textarea
                              placeholder="A mensagem selecionada aparecerá aqui..."
                              value={messageText}
                              onChange={(e) => setMessageText(e.target.value)}
                              className="h-[200px] resize-none"
                            />

                            <motion.div
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Button
                                disabled={!selectedInstance || !selectedPrefabText || !selectedTextPart || selectedContacts.length === 0}
                                onClick={handleSendMessage}
                                className="w-full h-12 text-lg"
                                size="lg"
                              >
                                <Send className="mr-2 h-5 w-5" />
                                Enviar para {selectedContacts.length} contato{selectedContacts.length !== 1 ? 's' : ''}
                              </Button>
                            </motion.div>
                          </motion.div>
                        </AnimatePresence>
                      )}
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>

        {/* Create Contact Dialog */}
        <CreateContactDialog
          open={isCreateDialogOpen}
          onOpenChange={() => setIsCreateDialogOpen(false)}
          onContactCreated={fetchContacts}
        />
      </motion.div>
    </div>
  );
}