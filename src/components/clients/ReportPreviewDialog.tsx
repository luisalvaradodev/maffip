'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Calendar, Package, DollarSign, User, FileText, Download, Hash } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ReportPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: {
    nome: string;
    numero: string;
    validade: string;
    valor: number;
    produto: string;
  };
  onDownload: () => void;
}

export function ReportPreviewDialog({
  open,
  onOpenChange,
  client,
  onDownload,
}: ReportPreviewDialogProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const clientInfo = [
    { icon: User, label: 'Nome', value: client.nome },
    { icon: Hash, label: 'Número', value: client.numero },
    { icon: Calendar, label: 'Validade', value: format(new Date(client.validade), "dd 'de' MMMM',' yyyy", { locale: ptBR }) },
    { icon: DollarSign, label: 'Valor', value: formatCurrency(client.valor) },
  ];

  return (
    <AnimatePresence>
      {open && (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden bg-gradient-to-br from-background via-background to-secondary/20">
            <Card className="border-0 shadow-none">
              <ScrollArea className="h-[85vh] w-full">
                <div className="px-8 py-10">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <DialogHeader className="mb-10">
                      <DialogTitle className="text-5xl font-bold flex items-center gap-4 mb-6">
                        <div className="p-3 bg-primary/10 rounded-2xl">
                          <FileText className="h-12 w-12 text-primary" />
                        </div>
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary to-primary-foreground">
                          Visualização do Relatório
                        </span>
                      </DialogTitle>
                      <DialogDescription className="text-xl text-muted-foreground">
                        Confira os detalhes do cliente antes de baixar o relatório.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-10">
                      {/* Informações do Cliente */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {clientInfo.map((item, index) => (
                          <motion.div
                            key={item.label}
                            className="flex items-start gap-5 p-6 rounded-2xl bg-card hover:bg-card/80 shadow-lg hover:shadow-xl transition-all duration-300 border border-border/50"
                            onMouseEnter={() => setHoveredItem(item.label)}
                            onMouseLeave={() => setHoveredItem(null)}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                          >
                            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <item.icon className={`h-7 w-7 ${hoveredItem === item.label ? 'text-primary' : 'text-primary/60'} transition-colors duration-300`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-lg mb-2 text-foreground">{item.label}</p>
                              <p className="text-muted-foreground break-words text-base">{item.value}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Informação do Produto (Ocupando toda a largura) */}
                      <motion.div
                        className="flex items-start gap-5 p-6 rounded-2xl bg-card hover:bg-card/80 shadow-lg hover:shadow-xl transition-all duration-300 border border-border/50"
                        onMouseEnter={() => setHoveredItem('produto')}
                        onMouseLeave={() => setHoveredItem(null)}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.4 }}
                      >
                        <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Package className={`h-7 w-7 ${hoveredItem === 'produto' ? 'text-primary' : 'text-primary/60'} transition-colors duration-300`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-lg mb-2 text-foreground">Produto</p>
                          <p className="text-muted-foreground break-words text-base">{client.produto}</p>
                        </div>
                      </motion.div>

                      {/* Botões de Ação */}
                      <motion.div
                        className="flex justify-end gap-4 mt-10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.5 }}
                      >
                        <Button
                          variant="outline"
                          onClick={() => onOpenChange(false)}
                          className="text-base px-6 py-3 h-auto hover:bg-secondary/80 transition-all duration-300"
                        >
                          Cancelar
                        </Button>
                        <Button
                          onClick={onDownload}
                          className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 text-base px-6 py-3 h-auto"
                        >
                          <Download className="mr-2 h-5 w-5" />
                          Baixar Relatório
                        </Button>
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
                <ScrollBar />
              </ScrollArea>
            </Card>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}

