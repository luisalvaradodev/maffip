'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { 
  User, 
  Phone, 
  Package, 
  Calendar,
  CreditCard
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Esquema de validación
const formSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  numero: z.string().min(1, 'Número é obrigatório'),
  valor: z.number().min(0, 'Valor deve ser um número positivo'),
  validade: z.string().min(1, 'Data de validade é obrigatória'),
  produto: z.string().min(1, 'Produto é obrigatório'),
  mainid: z.number().min(1, 'Main ID é obrigatório'),
});

interface ClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: { id?: number; nome?: string; numero?: string; valor?: number; validade?: string; produto?: string; mainid?: number } | null;
  onSuccess: () => void;
  mainid: number; // mainid del usuario actual
}

const inputVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.3,
    },
  }),
};

export default function ClientDialog({
  open,
  onOpenChange,
  client,
  onSuccess,
  mainid,
}: ClientDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: client?.nome || '',
      numero: client?.numero || '',
      valor: client?.valor || 0,
      validade: client?.validade ? new Date(client.validade).toISOString().split('T')[0] : '',
      produto: client?.produto || '',
      mainid: client?.mainid || mainid,
    },
  });

  // Cargar los datos del cliente cuando se abre el diálogo
  useEffect(() => {
    if (client) {
      form.reset({
        nome: client.nome || '',
        numero: client.numero || '',
        valor: client.valor || 0,
        validade: client.validade ? new Date(client.validade).toISOString().split('T')[0] : '',
        produto: client.produto || '',
        mainid: client.mainid || mainid,
      });
    } else {
      // Plantilla predefinida para nuevo cliente
      form.reset({
        nome: '',
        numero: '',
        valor: 0,
        validade: '',
        produto: `🛍️ Produto: [NOME DO PRODUTO]\n\n📅 DATA RENOVAÇÃO: [DATA]\n👤 Usuário: [EMAIL]\n🔐 Senha: [SENHA]\n💲 Valor: [VALOR]\n\n👤 *TELA:* [TELA]\n🔑 *PIN:* [PIN]\n\n💰 Saldo antes: [SALDO_ANTES]\n💰 Saldo Atual: [SALDO_ATUAL]\n\nℹ️ Informações Adicional:\n⚠️ REGRAS ⚠️\n\n- MUDOU EMAIL VAI SER TAXADO 🚫\n- NÃO MUDE SENHA 🚫\n- NÃO MUDE O NOME 🚫\n- NÃO MUDE O PIN 🚫\n\n- ISSO TUDO PODE OCASIONAR VC A PERDER O SUPORTE ⚠️\n\n- LINK DO GRUPO DE SUPORTE ⬇️\nhttps://chat.whatsapp.com/JCpjEob3I3U55DbeSZip4a`,
        mainid: mainid,
      });
    }
  }, [client, form, mainid]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const url = client ? `/api/clients/${client.id}` : '/api/clients';
      const method = client ? 'PUT' : 'POST';
  
      // Verificar que el campo "produto" tenga un valor
      if (!values.produto) {
        throw new Error('O campo "Produto" é obrigatório.');
      }
  
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
  
      if (!response.ok) throw new Error('Failed to save client');
  
      toast({
        title: 'Success',
        description: `Cliente ${client ? 'atualizado' : 'criado'} com sucesso`,
      });
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save client',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-4">
            {client ? 'Editar Cliente' : 'Novo Cliente'}
          </DialogTitle>
          {client && (
            <div className="flex justify-center">
              <Avatar className="h-20 w-20">
                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(client.nome || '')}`} />
                <AvatarFallback>{client.nome?.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
            </div>
          )}
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
              className="grid grid-cols-1 gap-6"
            >
              {/* Campo Nome */}
              <motion.div variants={inputVariants} custom={0}>
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Nome
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="transition-all duration-200 focus:ring-2 focus:ring-primary"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              {/* Campo Número */}
              <motion.div variants={inputVariants} custom={1}>
                <FormField
                  control={form.control}
                  name="numero"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Número
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="transition-all duration-200 focus:ring-2 focus:ring-primary"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              {/* Campo Produto (Textarea) */}
              <motion.div variants={inputVariants} custom={2}>
                <FormField
                  control={form.control}
                  name="produto"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        Produto
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          className="resize-none min-h-[200px] transition-all duration-200 focus:ring-2 focus:ring-primary"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              {/* Campo Valor */}
              <motion.div variants={inputVariants} custom={3}>
                <FormField
                  control={form.control}
                  name="valor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        Valor
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          className="transition-all duration-200 focus:ring-2 focus:ring-primary"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              {/* Campo Validade */}
              <motion.div variants={inputVariants} custom={4}>
                <FormField
                  control={form.control}
                  name="validade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Validade
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          className="transition-all duration-200 focus:ring-2 focus:ring-primary"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>
            </motion.div>

            <motion.div
              className="flex justify-end space-x-4 pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="hover:bg-secondary transition-colors duration-200"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-primary hover:bg-primary/90 transition-colors duration-200"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  'Salvar'
                )}
              </Button>
            </motion.div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}