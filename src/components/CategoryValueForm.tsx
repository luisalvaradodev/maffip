import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Category, CategoryInput } from '@/features/data/types';

interface CategoryValueFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (category: CategoryInput) => void;
  category: Category | null;
}

export const CategoryValueForm: React.FC<CategoryValueFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  category,
}) => {
  const [formData, setFormData] = useState<CategoryInput>({
    nome: '',
    estoque: 0,
    status: 'Desligada',
    valor: 0,
    img: '',
  });

  useEffect(() => {
    if (category) {
      setFormData({
        nome: category.nome,
        estoque: category.estoque,
        status: category.status,
        valor: category.valor,
        img: category.img || '',
      });
    } else {
      setFormData({
        nome: '',
        estoque: 0,
        status: 'Desligada',
        valor: 0,
        img: '',
      });
    }
  }, [category]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{category ? 'Edit Category' : 'Add Category'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700">Name</label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              required
            />
          </div>
          <div>
            <label htmlFor="estoque" className="block text-sm font-medium text-gray-700">Stock</label>
            <Input
              id="estoque"
              type="number"
              value={formData.estoque}
              onChange={(e) => setFormData({ ...formData, estoque: parseInt(e.target.value) })}
              required
            />
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
            <Select
              value={formData.status}
              onValueChange={(value: 'Ligada' | 'Desligada') => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Ligada">Ligada</SelectItem>
                <SelectItem value="Desligada">Desligada</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="valor" className="block text-sm font-medium text-gray-700">Value</label>
            <Input
              id="valor"
              type="number"
              step="0.01"
              value={formData.valor}
              onChange={(e) => setFormData({ ...formData, valor: parseFloat(e.target.value) })}
              required
            />
          </div>
          <div>
            <label htmlFor="img" className="block text-sm font-medium text-gray-700">Image URL</label>
            <Input
              id="img"
              value={formData.img}
              onChange={(e) => setFormData({ ...formData, img: e.target.value })}
            />
          </div>
          <p className="text-red-500 text-sm">Attention: Make sure all images are updated before changing the value.</p>
          <Button type="submit" className="w-full">{category ? 'Update' : 'Create'}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

