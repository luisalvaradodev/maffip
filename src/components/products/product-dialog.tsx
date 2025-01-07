import { useState, useEffect } from "react";
import { Product } from "@/features/data/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { motion } from "framer-motion";
import { Loader2, Smile } from "lucide-react";
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

interface ProductDialogProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (product: Product) => void;
}

export function ProductDialog({
  product,
  open,
  onOpenChange,
  onSave,
}: ProductDialogProps) {
  const [formData, setFormData] = useState<Partial<Product>>({
    produto: "",
    categoria: 0,
    disponivel: 0,
    email: "",
    senha: "",
    tipo: "",
    dados: "",
    tipoConta: "padrão"
  });
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<{ id: number; nome: string }[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    if (open) {
      fetchCategories();
    }
  }, [open]);

  useEffect(() => {
    if (product) {
      setFormData(product);
    } else {
      setFormData({
        produto: "",
        categoria: 0,
        disponivel: 0,
        email: "",
        senha: "",
        tipo: "",
        dados: "",
        tipoConta: "padrão"
      });
    }
  }, [product]);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleEmojiSelect = (emoji: any) => {
    setFormData(prev => ({
      ...prev,
      produto: prev.produto + emoji.native
    }));
    setShowEmojiPicker(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (product) {
        await onSave({ ...product, ...formData } as Product);
      } else {
        await onSave({ ...formData, id: Date.now() } as Product);
      }
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            {product ? "Editar Produto" : "Novo Produto"}
          </DialogTitle>
          <DialogDescription>
            Preencha os detalhes do produto abaixo
          </DialogDescription>
        </DialogHeader>
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Label htmlFor="produto">Produto</Label>
            <div className="flex gap-2">
              <Input
                id="produto"
                value={formData.produto}
                onChange={(e) =>
                  setFormData({ ...formData, produto: e.target.value })
                }
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
              <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="px-3"
                  >
                    <Smile className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="end">
                  <Picker
                    data={data}
                    onEmojiSelect={handleEmojiSelect}
                    theme="light"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </motion.div>

          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Label htmlFor="categoria">Categoria</Label>
            <Select
              value={String(formData.categoria)}
              onValueChange={(value) =>
                setFormData({ ...formData, categoria: parseInt(value) })
              }
            >
              <SelectTrigger className="transition-all duration-200 hover:bg-accent">
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem
                    key={category.id}
                    value={String(category.id)}
                    className="transition-colors duration-150 hover:bg-accent"
                  >
                    {category.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </motion.div>

          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Label htmlFor="tipoConta">Tipo de Conta</Label>
            <Select
              value={formData.tipoConta}
              onValueChange={(value) =>
                setFormData({ ...formData, tipoConta: value })
              }
            >
              <SelectTrigger className="transition-all duration-200 hover:bg-accent">
                <SelectValue placeholder="Selecione o tipo de conta" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="padrão">Padrão</SelectItem>
                <SelectItem value="telas">Telas</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>

          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Label htmlFor="dados">Dados das Contas</Label>
            <Textarea
              id="dados"
              placeholder="Digite as contas no formato email|senha"
              value={formData.dados}
              onChange={(e) =>
                setFormData({ ...formData, dados: e.target.value })
              }
              className="min-h-[100px] transition-all duration-200 focus:ring-2 focus:ring-primary/20"
            />
          </motion.div>

          <motion.div
            className="flex items-center space-x-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Switch
              id="disponivel"
              checked={formData.disponivel === 1}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, disponivel: checked ? 1 : 0 })
              }
              className="data-[state=checked]:bg-green-500"
            />
            <Label htmlFor="disponivel">Disponível</Label>
          </motion.div>

          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Label htmlFor="tipo">Tipo</Label>
            <Input
              id="tipo"
              value={formData.tipo}
              onChange={(e) =>
                setFormData({ ...formData, tipo: e.target.value })
              }
              className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
            />
          </motion.div>

          {formData.disponivel === 0 && (
            <motion.div
              className="text-sm text-blue-500"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              Etiqueta: Vendido
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 hover:scale-[1.02] disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </motion.div>
        </motion.form>
      </DialogContent>
    </Dialog>
  );
}