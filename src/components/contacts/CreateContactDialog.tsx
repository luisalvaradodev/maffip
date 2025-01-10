'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from 'lucide-react';

export interface CreateContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContactCreated: () => void;
}

export function CreateContactDialog({ 
  open, 
  onOpenChange, 
  onContactCreated 
}: CreateContactDialogProps) {
  const [contactName, setContactName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [contactPhoto, setContactPhoto] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          nome: contactName, 
          numero: contactNumber,
          foto: contactPhoto,
          saldo: 0,
          saldoadd: '0',
          bloqueado: 0,
          comprando: 0,
          mainid: 88 // Substitua pelo mainid real
        }),
      });

      if (!response.ok) {
        throw new Error('Falha ao criar contato');
      }

      toast({
        title: "Sucesso",
        description: "Contato criado com sucesso.",
      });
      onContactCreated();
      onOpenChange(false);
      setContactName('');
      setContactNumber('');
      setContactPhoto('');
    } catch (error) {
      console.error('Erro ao criar contato:', error);
      toast({
        title: "Erro",
        description: "Falha ao criar contato. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary">
            Criar Novo Contato
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Preencha os detalhes para criar um novo contato.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* Campo Nome */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-foreground">
                Nome
              </Label>
              <Input
                id="name"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="Digite o nome do contato"
                required
                className="focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Campo Número */}
            <div className="space-y-2">
              <Label htmlFor="number" className="text-sm font-medium text-foreground">
                Número
              </Label>
              <Input
                id="number"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                placeholder="Digite o número do contato"
                required
                className="focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Campo Foto (URL) */}
            <div className="space-y-2">
              <Label htmlFor="photo" className="text-sm font-medium text-foreground">
                URL da Foto (Opcional)
              </Label>
              <Input
                id="photo"
                value={contactPhoto}
                onChange={(e) => setContactPhoto(e.target.value)}
                placeholder="Cole a URL da foto do contato"
                className="focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Rodapé do Diálogo */}
          <DialogFooter>
            <Button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando...
                </>
              ) : (
                'Criar Contato'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}