import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ProductInput, Product } from '@/features/data/types/';
import { Category } from '@/features/data/types';

interface AddProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (product: ProductInput) => void;
  categories: Category[];
  product: Product | null;
}

export const AddProductForm: React.FC<AddProductFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  categories,
  product,
}) => {
  const [formData, setFormData] = useState<ProductInput>({
    categoria: '',
    produto: '',
    status: 'Disponível',
    tipo: '',
    email: '',
    senha: '',
    descricao: '',
    regras: '',
    suporte: '',
  });

  useEffect(() => {
    if (product) {
      setFormData({
        categoria: product.categoria,
        produto: product.produto,
        status: product.status,
        tipo: product.tipo,
        email: product.email,
        senha: product.senha,
        descricao: product.descricao,
        regras: product.regras,
        suporte: product.suporte,
      });
    } else {
      setFormData({
        categoria: '',
        produto: '',
        status: 'Disponível',
        tipo: '',
        email: '',
        senha: '',
        descricao: '',
        regras: '',
        suporte: '',
      });
    }
  }, [product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{product ? 'Edit Product' : 'Add Product'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="categoria" className="block text-sm font-medium text-gray-700">Category</label>
            <Select
              value={formData.categoria}
              onValueChange={(value) => setFormData({ ...formData, categoria: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>{category.nome}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="produto" className="block text-sm font-medium text-gray-700">Product Name</label>
            <Input
              id="produto"
              value={formData.produto}
              onChange={(e) => setFormData({ ...formData, produto: e.target.value })}
              required
            />
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
            <Select
              value={formData.status}
              onValueChange={(value: 'Disponível' | 'Vendida') => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Disponível">Disponível</SelectItem>
                <SelectItem value="Vendida">Vendida</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="tipo" className="block text-sm font-medium text-gray-700">Type</label>
            <Input
              id="tipo"
              value={formData.tipo}
              onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
              required
            />
          </div>
          <div>
            <label htmlFor="dados" className="block text-sm font-medium text-gray-700">Data (Email|Password)</label>
            <Textarea
              id="dados"
              value={`${formData.email}|${formData.senha}`}
              onChange={(e) => {
                const [email, senha] = e.target.value.split('|');
                setFormData({ ...formData, email, senha });
              }}
              placeholder="email@example.com|password"
              required
            />
          </div>
          <div>
            <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">Description</label>
            <Textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              required
            />
          </div>
          <div>
            <label htmlFor="regras" className="block text-sm font-medium text-gray-700">Rules</label>
            <Textarea
              id="regras"
              value={formData.regras}
              onChange={(e) => setFormData({ ...formData, regras: e.target.value })}
              required
            />
          </div>
          <div>
            <label htmlFor="suporte" className="block text-sm font-medium text-gray-700">Support (WhatsApp)</label>
            <Input
              id="suporte"
              value={formData.suporte}
              onChange={(e) => setFormData({ ...formData, suporte: e.target.value })}
              placeholder="WhatsApp number"
              required
            />
          </div>
          <Button type="submit" className="w-full">{product ? 'Update' : 'Create'}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

