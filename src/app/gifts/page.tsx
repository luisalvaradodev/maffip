'use client';

import { useState, useEffect } from 'react';
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

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<number[]>([]);
  const [generatedCode, setGeneratedCode] = useState('');
  const [message, setMessage] = useState('');
  const [giftData, setGiftData] = useState({
    valor: '',
    numero: '',
  });
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'blocked'>('all');
  const [selectedInstance, setSelectedInstance] = useState('');
  const [instances, setInstances] = useState<any[]>([]);

  useEffect(() => {
    fetchContacts();
    fetchInstances();
  }, []);

  useEffect(() => {
    if (generatedCode) {
      setMessage(`Seu código de presente é: ${generatedCode}\nValor: R$${giftData.valor}`);
    }
  }, [generatedCode, giftData.valor]);

  const fetchInstances = async () => {
    try {
      const response = await fetch('http://46.202.150.164:8080/instance/fetchInstances', {
        headers: { apikey: 'mude-me' }
      });
      const data = await response.json();
      setInstances(data);
    } catch (error) {
      toast.error('Failed to fetch WhatsApp instances');
    }
  };

  const fetchContacts = async () => {
    try {
      const response = await fetch('/api/contacts?mainid=88');
      const data = await response.json();
      setContacts(data || []);
    } catch (error) {
      toast.error('Failed to fetch contacts');
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

  const generateCode = () => {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Code copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy code');
    }
  };

  const createGift = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const code = generateCode();

    try {
      const response = await fetch('/api/gifts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mainid: 88,
          valor: parseFloat(giftData.valor),
          numero: giftData.numero,
          codigo: code,
        }),
      });

      if (!response.ok) throw new Error('Failed to create gift');
      
      setGeneratedCode(code);
      toast.success('Gift created successfully!');
    } catch (error) {
      toast.error('Failed to create gift');
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
      toast.error('Please select an instance, contacts, and enter a message');
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
              textMessage: { text: message }
            })
          };

          try {
            const response = await fetch(
              `http://46.202.150.164:8080/message/sendText/${selectedInstance}`,
              options
            );
            
            if (!response.ok) throw new Error(`Failed to send message to ${contact.numero}`);
            
            successCount++;
            toast.success(`Message sent to ${contact.nome || contact.numero}`);
          } catch (error) {
            failureCount++;
            toast.error(`Failed to send message to ${contact.nome || contact.numero}`);
          }
        })
      );

      toast({
        title: "Message Status",
        description: `${successCount} sent successfully, ${failureCount} failed`,
      });

      if (successCount > 0) {
        setSelectedContacts([]);
        setMessage('');
      }
    } catch (error) {
      toast.error('Failed to send messages');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
          Gift Management System
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
                  <Gift className="h-6 w-6 text-purple-500" />
                  Create Gift
                </CardTitle>
                <CardDescription className="text-base">
                  Generate a new gift code for a customer
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={createGift} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Amount
                    </label>
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      value={giftData.valor}
                      onChange={(e) => setGiftData(prev => ({ ...prev, valor: e.target.value }))}
                      className="transition-all duration-200 focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone Number
                    </label>
                    <Input
                      type="tel"
                      placeholder="Enter phone number"
                      value={giftData.numero}
                      onChange={(e) => setGiftData(prev => ({ ...prev, numero: e.target.value }))}
                      className="transition-all duration-200 focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
                  >
                    Generate Gift Code
                  </Button>
                </form>

                {generatedCode && (
                  <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <p className="text-sm font-medium text-purple-700 dark:text-purple-300 mb-2">Generated Code:</p>
                    <div className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded border border-purple-200 dark:border-purple-800">
                      <code className="text-lg font-mono">{generatedCode}</code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(generatedCode)}
                        className="hover:bg-purple-50 dark:hover:bg-purple-900/50"
                      >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
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
                    <MessageSquare className="h-6 w-6 text-pink-500" />
                    Mass Messaging
                  </CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Filter className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                        All Contacts
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatusFilter('active')}>
                        Active Only
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatusFilter('blocked')}>
                        Blocked Only
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardDescription className="text-base">
                  Send messages to selected contacts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                    <Input
                      placeholder="Search contacts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <Select onValueChange={setSelectedInstance}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select WhatsApp Instance" />
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

                  <ScrollArea className="h-[200px] border rounded-lg p-4">
                    {filteredContacts.length > 0 ? (
                      <ul className="space-y-2">
                        {filteredContacts.map((contact, index) => (
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
                                setSelectedContacts(
                                  checked
                                    ? [...selectedContacts, contact.id]
                                    : selectedContacts.filter(id => id !== contact.id)
                                );
                              }}
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{contact.nome || 'No Name'}</span>
                                {contact.bloqueado === 1 && (
                                  <span className="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200">
                                    Blocked
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-gray-500">{contact.numero}</div>
                            </div>
                          </motion.li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500 text-center">No contacts found</p>
                    )}
                  </ScrollArea>

                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter your message..."
                    className="min-h-[100px] resize-none"
                  />

                  <Button
                    onClick={sendMassMessage}
                    disabled={loading || selectedContacts.length === 0 || !message.trim() || !selectedInstance}
                    className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 transition-all duration-200"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send Message ({selectedContacts.length} selected)
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="text-sm text-gray-500">
                Selected contacts will receive the message via WhatsApp
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}