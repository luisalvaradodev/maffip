'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams } from 'next/navigation'; // Importamos useParams
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Gift, Send, Copy, Check, Phone, DollarSign, MessageSquare, Search, Filter } from "lucide-react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Contact } from '@/features/data/types';
import { useDebounce } from 'use-debounce'; // npm install use-debounce

export default function Home() {
  const { mainid } = useParams(); // Obtenemos el mainid de la ruta
  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<number[]>([]);
  const [generatedCodes, setGeneratedCodes] = useState<{ [key: number]: string }>({});
  const [message, setMessage] = useState('');
  const [giftData, setGiftData] = useState({
    valor: '',
    numero: '',
  });
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300); // Debounce de 300ms
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'blocked'>('all');
  const [selectedInstance, setSelectedInstance] = useState('');
  const [instances, setInstances] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [contactsPerPage] = useState(10); // Número de contactos por página

  useEffect(() => {
    fetchContacts();
    fetchInstances();
  }, [mainid]);

  useEffect(() => {
    if (selectedContacts.length > 0) {
      const selectedNumbers = selectedContacts
        .map(id => contacts.find(contact => contact.id === id)?.numero)
        .filter(Boolean)
        .join(', ');
      setGiftData(prev => ({ ...prev, numero: selectedNumbers }));
    } else {
      setGiftData(prev => ({ ...prev, numero: '' }));
    }
  }, [selectedContacts, contacts]);

  const fetchInstances = async () => {
    try {
      const response = await fetch('http://46.202.150.164:8080/instance/fetchInstances', {
        headers: { apikey: 'mude-me' }
      });
      const data = await response.json();
      setInstances(data);
    } catch (error) {
      toast.error('Falha ao buscar instâncias do WhatsApp');
    }
  };

  const fetchContacts = async () => {
    try {
      const response = await fetch(`/api/contacts?mainid=${mainid}`);
      const data = await response.json();
      setContacts(data || []);
    } catch (error) {
      toast.error('Falha ao buscar contatos');
    }
  };

  const filteredContacts = useMemo(() => {
    return contacts.filter(contact => {
      const matchesSearch = (
        (contact.nome?.toLowerCase() || '').includes(debouncedSearchTerm.toLowerCase()) ||
        (contact.numero || '').includes(debouncedSearchTerm)
      );
      
      const matchesStatus = statusFilter === 'all' 
        ? true 
        : statusFilter === 'blocked' 
          ? contact.bloqueado === 1
          : contact.bloqueado === 0;

      return matchesSearch && matchesStatus;
    });
  }, [contacts, debouncedSearchTerm, statusFilter]);

  // Paginación
  const indexOfLastContact = currentPage * contactsPerPage;
  const indexOfFirstContact = indexOfLastContact - contactsPerPage;
  const currentContacts = filteredContacts.slice(indexOfFirstContact, indexOfLastContact);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const generateCode = useCallback(() => {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  }, []);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Código copiado para a área de transferência!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Falha ao copiar código');
    }
  };

  const createGift = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedContacts.length === 0) {
      toast.error('Selecione pelo menos um contato');
      return;
    }

    setLoading(true);
    const newGeneratedCodes: { [key: number]: string } = {};

    try {
      await Promise.all(
        selectedContacts.map(async (contactId) => {
          const code = generateCode();
          newGeneratedCodes[contactId] = code;

          const response = await fetch('/api/gifts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              mainid,
              valor: parseFloat(giftData.valor),
              numero: contacts.find(contact => contact.id === contactId)?.numero,
              codigo: code,
            }),
          });

          if (!response.ok) throw new Error('Falha ao criar presente');
        })
      );

      setGeneratedCodes(newGeneratedCodes);
      toast.success('Presentes criados com sucesso!');

      // Generar mensaje prefabricado para cada contacto
      const selectedContactDetails = selectedContacts.map(id => {
        const contact = contacts.find(c => c.id === id);
        return { nome: contact?.nome || contact?.numero, codigo: newGeneratedCodes[id] };
      });

      const prefabricatedMessage = selectedContactDetails
        .map(detail => `Código de presente para ${detail.nome}: ${detail.codigo}\nValor: R$${giftData.valor}`)
        .join('\n\n');

      setMessage(prefabricatedMessage);
    } catch (error) {
      toast.error('Falha ao criar presentes');
    } finally {
      setLoading(false);
    }
  };

  const formatPhoneNumber = (number: string): string => {
    const cleaned = number.replace(/\D/g, "");
    return cleaned.startsWith("0") ? `+58${cleaned.slice(1)}` : cleaned;
  };

  const sendMassMessage = async () => {
    if (!selectedInstance || selectedContacts.length === 0 || !message.trim()) {
      toast.error('Por favor, selecione uma instância, contatos e insira uma mensagem');
      return;
    }

    setLoading(true);
    try {
      let successCount = 0;
      let failureCount = 0;

      await Promise.all(
        selectedContacts.map(async (contactId) => {
          const contact = contacts.find(c => c.id === contactId);
          if (!contact) return;

          const formattedNumber = formatPhoneNumber(contact.numero);
          const code = generatedCodes[contactId];
          const personalizedMessage = `Código de presente para ${contact.nome || contact.numero}: ${code}\nValor: R$${giftData.valor}`;

          const options = {
            method: 'POST',
            headers: {
              apikey: 'mude-me',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              options: {
                delay: 1000,
                presence: "composing"
              },
              number: formattedNumber,
              textMessage: { text: personalizedMessage }
            })
          };

          try {
            const response = await fetch(
              `http://46.202.150.164:8080/message/sendText/${selectedInstance}`,
              options
            );
            
            if (!response.ok) throw new Error(`Falha ao enviar mensagem para ${contact.numero}`);
            
            successCount++;
            toast.success(`Mensagem enviada para ${contact.nome || contact.numero}`);
          } catch (error) {
            failureCount++;
            toast.error(`Falha ao enviar mensagem para ${contact.nome || contact.numero}`);
          }
        })
      );

      toast({
        title: "Status da Mensagem",
        description: `${successCount} enviadas com sucesso, ${failureCount} falhas`,
      });

      if (successCount > 0) {
        setSelectedContacts([]);
        setMessage('');
        setGeneratedCodes({});
      }
    } catch (error) {
      toast.error('Falha ao enviar mensagens');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600">
          Sistema de Gerenciamento de Presentes
        </h1>
        
        <div className="grid gap-6 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Gift className="h-6 w-6 text-blue-500" />
                  Criar Presente
                </CardTitle>
                <CardDescription className="text-base">
                  Gere novos códigos de presente para os clientes selecionados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={createGift} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Valor
                    </label>
                    <Input
                      type="number"
                      placeholder="Insira o valor"
                      value={giftData.valor}
                      onChange={(e) => setGiftData(prev => ({ ...prev, valor: e.target.value }))}
                      className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Números Selecionados
                    </label>
                    <Input
                      type="text"
                      placeholder="Números selecionados aparecerão aqui"
                      value={giftData.numero}
                      readOnly
                      className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 bg-gray-100 dark:bg-gray-800"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={loading || selectedContacts.length === 0}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 transition-all duration-200"
                  >
                    Gerar Códigos de Presente
                  </Button>
                </form>

                {Object.keys(generatedCodes).length > 0 && (
                  <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">Códigos Gerados:</p>
                    <div className="space-y-2">
                      {selectedContacts.map((contactId) => (
                        <div key={contactId} className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded border border-blue-200 dark:border-blue-800">
                          <code className="text-lg font-mono">{generatedCodes[contactId]}</code>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(generatedCodes[contactId])}
                            className="hover:bg-blue-50 dark:hover:bg-blue-900/50"
                          >
                            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <MessageSquare className="h-6 w-6 text-blue-500" />
                    Mensagens em Massa
                  </CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Filter className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                        Todos os Contatos
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatusFilter('active')}>
                        Apenas Ativos
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatusFilter('blocked')}>
                        Apenas Bloqueados
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardDescription className="text-base">
                  Envie mensagens para os contatos selecionados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                    <Input
                      placeholder="Pesquisar contatos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <Select onValueChange={setSelectedInstance}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma Instância do WhatsApp" />
                    </SelectTrigger>
                    <SelectContent>
                      {instances.map((instance: any) => (
                        <SelectItem
                          key={instance.instance.instanceName}
                          value={instance.instance.instanceName}
                        >
                          {instance.instance.instanceName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="h-[200px] overflow-y-auto border rounded-lg p-4">
                    {currentContacts.length > 0 ? (
                      <ul className="space-y-2">
                        {currentContacts.map((contact, index) => (
                          <motion.li
                            key={contact.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className={`
                              flex items-center gap-2 p-2 rounded-lg transition-all duration-200
                              ${contact.bloqueado ? 'bg-red-50 dark:bg-red-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}
                            `}
                          >
                            <Checkbox
                              checked={selectedContacts.includes(contact.id)}
                              onCheckedChange={(checked) => {
                                if (checked && selectedContacts.length >= 5) {
                                  toast.error('Você só pode selecionar até 5 contatos');
                                  return;
                                }
                                setSelectedContacts(
                                  checked
                                    ? [...selectedContacts, contact.id]
                                    : selectedContacts.filter(id => id !== contact.id)
                                );
                              }}
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{contact.nome || 'Sem Nome'}</span>
                                {contact.bloqueado === 1 && (
                                  <span className="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200">
                                    Bloqueado
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{contact.numero}</div>
                            </div>
                          </motion.li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500 text-center">Nenhum contato encontrado</p>
                    )}
                  </div>

                  {/* Paginación */}
                  <div className="flex justify-center gap-2 overflow-x-auto py-2">
                    {Array.from({ length: Math.ceil(filteredContacts.length / contactsPerPage) }, (_, i) => (
                      <Button
                        key={i + 1}
                        onClick={() => paginate(i + 1)}
                        variant={currentPage === i + 1 ? 'default' : 'outline'}
                        className="min-w-[40px]"
                      >
                        {i + 1}
                      </Button>
                    ))}
                  </div>

                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Insira sua mensagem... Use {codigo} para o código e {nome} para o nome do contato."
                    className="min-h-[100px] resize-none"
                  />

                  <Button
                    onClick={sendMassMessage}
                    disabled={loading || selectedContacts.length === 0 || !message.trim() || !selectedInstance}
                    className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 transition-all duration-200"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Enviar Mensagem ({selectedContacts.length} selecionados)
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="text-sm text-gray-500 dark:text-gray-400">
                Os contatos selecionados receberão a mensagem via WhatsApp
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}