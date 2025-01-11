import { useState, useEffect } from "react";
import { Category } from "@/features/data/types";
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface CategoryDialogProps {
  category: Category | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (category: Category) => Promise<void>; // Asegúrate de que onSave devuelva una Promise
}

export function CategoryDialog({
  category,
  open,
  onOpenChange,
  onSave,
}: CategoryDialogProps) {
  const [formData, setFormData] = useState<Partial<Category>>({
    nome: "",
    valor: 0,
    descricao: "",
    status: 0,
    img: "",
    tipo: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (category) {
      setFormData(category);
    } else {
      setFormData({
        nome: "",
        valor: 0,
        descricao: `*🆙 SUPORTE 30 DIAS E RENOVÁVEL*\n\n*🚫 PROIBIÇÕES E PERMISSÕES 🚫*\n\n*❌ Não alterar email ou senha.*\n\n✅ Pode alterar PIN da tela.\n✅ Pode modificar todos os perfil.\n📝 OBS: A conta é válida por 30 dias. Após esse período, será desativada, a menos que o pagamento seja feito no vencimento ou um dia antes.\n\n🚯 O descumprimento das regras resultará na perda imediata de suporte.\n👥 Atendimento: https://chat.whatsapp.com/IpsoPpql7Y70tn77tlsHhY`,
        status: 0,
        img: "",
        tipo: "",
      });
    }
  }, [category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(formData as Category); // Espera a que onSave se complete
    } catch (error) {
      console.error("Error saving category:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, status: checked ? 1 : 0 }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            {category ? "Editar Categoria" : "Nova Categoria"}
          </DialogTitle>
          <DialogDescription>
            Preencha os detalhes da categoria abaixo
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
            <Label htmlFor="nome">Nome</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) =>
                setFormData({ ...formData, nome: e.target.value })
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
            <Label htmlFor="valor">Valor</Label>
            <Input
              id="valor"
              type="number"
              step="0.01"
              value={isNaN(formData.valor) ? "" : formData.valor} // Si es NaN, se muestra una cadena vacía
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                setFormData({ ...formData, valor: isNaN(value) ? 0 : value }); // Si es NaN, se asigna 0
              }}
              className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
            />
          </motion.div>

          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) =>
                setFormData({ ...formData, descricao: e.target.value })
              }
              className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
            />
          </motion.div>

          <motion.div
            className="flex items-center space-x-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Switch
              id="status"
              checked={formData.status === 1}
              onCheckedChange={handleStatusChange}
              className="data-[state=checked]:bg-green-500"
            />
            <Label htmlFor="status">Ativo</Label>
          </motion.div>

          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Label htmlFor="img">URL da Imagem</Label>
            <Input
              id="img"
              value={formData.img}
              onChange={(e) =>
                setFormData({ ...formData, img: e.target.value })
              }
              className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
            />
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