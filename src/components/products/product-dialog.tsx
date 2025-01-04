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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

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
  });
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<{ id: number; nome: string }[]>([]);

  useEffect(() => {
    if (open) {
      fetchCategories();
    }
  }, [open]);

  useEffect(() => {
    if (product) {
      setFormData(product);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (product) {
        await onSave({ ...product, ...formData } as Product);
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
            <Input
              id="produto"
              value={formData.produto}
              onChange={(e) =>
                setFormData({ ...formData, produto: e.target.value })
              }
              className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
            />
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
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
            />
          </motion.div>

          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Label htmlFor="senha">Senha</Label>
            <Input
              id="senha"
              type="password"
              value={formData.senha}
              onChange={(e) =>
                setFormData({ ...formData, senha: e.target.value })
              }
              className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Button
              type="submit"
              className="w-full transition-all duration-200 hover:scale-[1.02] disabled:opacity-50"
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