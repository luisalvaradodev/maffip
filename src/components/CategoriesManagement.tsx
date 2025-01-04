import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Category } from '@/features/data/types';
import { Search, Edit } from 'lucide-react';

interface CategoriesManagementProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (ids: number[]) => void;
  onToggleStatus: (id: number) => void;
}

export const CategoriesManagement: React.FC<CategoriesManagementProps> = ({
  categories,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCategories = categories.filter(category =>
    category.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectAll = () => {
    setSelectedCategories(categories.map(c => c.id));
  };

  const handleDeselectAll = () => {
    setSelectedCategories([]);
  };

  const handleToggleSelect = (id: number) => {
    setSelectedCategories(prev =>
      prev.includes(id) ? prev.filter(cId => cId !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Suas Categorias</h2>
      <div className="flex justify-between items-center">
        <div className="relative w-1/3">
          <Input
            placeholder="Buscar categorias..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>
        <div className="space-x-2">
          <Button variant="destructive" onClick={() => onDelete(selectedCategories)} disabled={selectedCategories.length === 0}>
            Apagar
          </Button>
          <Button variant="outline" onClick={handleSelectAll}>Marcar todos</Button>
          <Button variant="outline" onClick={handleDeselectAll}>Desmarcar todos</Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">#</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Estoque</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCategories.map((category) => (
            <TableRow key={category.id}>
              <TableCell>
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category.id)}
                  onChange={() => handleToggleSelect(category.id)}
                  className="mr-2"
                />
                {category.id}
              </TableCell>
              <TableCell>{category.nome}</TableCell>
              <TableCell>{category.estoque}</TableCell>
              <TableCell>
                <Badge variant={category.status === 'Ligada' ? 'default' : 'secondary'}>
                  {category.status}
                </Badge>
              </TableCell>
              <TableCell>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(category.valor)}</TableCell>
              <TableCell className="text-right">
                <Button variant="outline" size="sm" className="mr-2" onClick={() => onToggleStatus(category.id)}>
                  {category.status === 'Ligada' ? 'Desligar' : 'Ligar'}
                </Button>
                <Button variant="outline" size="sm" onClick={() => onEdit(category)}>
                  <Edit size={16} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

