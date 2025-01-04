'use client';

import { useState, useEffect } from 'react';
import { ContactList } from '@/components/contacts/ContactList';
import { ContactActions } from '@/components/contacts/ContactActions';
import { GiftManagement } from '@/components/contacts/GiftManagement';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Search, Plus } from 'lucide-react';
import { CreateContactDialog } from '@/components/contacts/CreateContactDialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

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

interface Instance {
  id: number;
  name: string;
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [instances, setInstances] = useState<Instance[]>([]);
  const [selectedInstance, setSelectedInstance] = useState<string>('');
  const [messageText, setMessageText] = useState('');
  const [selectedContacts, setSelectedContacts] = useState<number[]>([]);

  useEffect(() => {
    fetchContacts();
    fetchInstances();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/contacts/route');
      if (!response.ok) {
        throw new Error('Failed to fetch contacts');
      }
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
  };

  const fetchInstances = async () => {
    try {
      const response = await fetch('/api/instances/route');
      if (!response.ok) {
        throw new Error('Failed to fetch instances');
      }
      const data: Instance[] = await response.json();
      setInstances(data);
    } catch (error) {
      console.error('Error fetching instances:', error);
      toast({
        title: "Error",
        description: "Failed to fetch WhatsApp instances. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSendMessage = async () => {
    if (!selectedInstance || messageText.trim() === '' || selectedContacts.length === 0) {
      toast({
        title: "Error",
        description: "Please select an instance, enter a message, and select at least one contact.",
        variant: "destructive",
      });
      return;
    }

    try {
      const selectedContactData = contacts.filter(contact => selectedContacts.includes(contact.id));
      for (const contact of selectedContactData) {
        const options = {
          method: 'POST',
          headers: { apikey: 'mude-me', 'Content-Type': 'application/json' },
          body: JSON.stringify({
            number: contact.numero,
            options: { delay: 1999, presence: "composing", linkPreview: true },
            textMessage: { text: messageText },
          }),
        };

        const response = await fetch(`http://46.202.150.164:8080/message/sendText/${selectedInstance}`, options);
        if (!response.ok) {
          throw new Error(`Failed to send message to ${contact.nome}`);
        }
      }

      toast({
        title: "Success",
        description: "Messages sent successfully.",
      });
      setMessageText('');
      setSelectedContacts([]);
    } catch (error) {
      console.error('Error sending messages:', error);
      toast({
        title: "Error",
        description: "Failed to send messages. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="w-full shadow-md hover:shadow-lg">
          <CardHeader>
            <CardTitle>Contact Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                className="hover:bg-blue-600 transition-all duration-200"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Contact
              </Button>
              <div className="relative">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                <Input
                  placeholder="Search contacts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 hover:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
            <ContactActions 
              contactCount={contacts.length} 
              onRefresh={fetchContacts}
              selectedContacts={selectedContacts}
              setSelectedContacts={setSelectedContacts}
            />
            <ContactList
              contacts={contacts}
              loading={loading}
              selectedContacts={selectedContacts}
              setSelectedContacts={setSelectedContacts} onRefresh={function (): void {
                throw new Error('Function not implemented.');
              } }            />
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="w-full shadow-md hover:shadow-lg">
          <CardHeader>
            <CardTitle>Mass Messaging</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Select onValueChange={setSelectedInstance}>
                <SelectTrigger>
                  <SelectValue placeholder="Select WhatsApp Instance" />
                </SelectTrigger>
                <SelectContent>
                  {instances.map(instance => (
                    <SelectItem key={instance.id} value={instance.name}>
                      {instance.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Textarea
                placeholder="Enter your message here..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                rows={4}
                className="hover:border-blue-500 focus:ring-blue-500"
              />
              <div className="flex justify-between items-center">
                <span>{selectedContacts.length} contacts selected</span>
                <Button
                  onClick={handleSendMessage}
                  className="hover:bg-green-600 transition-all duration-200"
                  disabled={!selectedInstance || messageText.trim() === '' || selectedContacts.length === 0}
                >
                  Send Message to Selected Contacts
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <GiftManagement />

      <CreateContactDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onContactCreated={fetchContacts}
      />
    </motion.div>
  );
}
