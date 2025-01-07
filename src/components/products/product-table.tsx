import { useState } from "react";
import { Product } from "@/features/data/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Edit, Trash2, AlertCircle, Eye, Check, X } from "lucide-react";
import { ProductDialog } from "./product-dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { Pagination } from "@/components/shared/pagination";

interface ProductTableProps {
  products: Product[] | null | undefined;
  onDelete: (id: number) => void;
  onUpdate: (product: Product) => void;
}

export function ProductTable({ products, onDelete, onUpdate }: ProductTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [showTextDialog, setShowTextDialog] = useState(false);
  
  const ITEMS_PER_PAGE = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const filteredProducts = Array.isArray(products)
    ? products.filter((product) =>
        product.produto.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setProductToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (productToDelete) {
      onDelete(productToDelete);
      setDeleteConfirmOpen(false);
    }
  };

  const handleSave = (updatedProduct: Partial<Product>) => {
    if (selectedProduct && updatedProduct) {
      onUpdate({ ...selectedProduct, ...updatedProduct });
    }
    setSelectedProduct(null);
    setIsDialogOpen(false);
  };

  const handleSelectAll = () => {
    const allIds = paginatedProducts.map(product => product.id);
    setSelectedItems(allIds);
  };

  const handleDeselectAll = () => {
    setSelectedItems([]);
  };

  const handleToggleSelect = (id: number) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const getPaginationRange = (currentPage: number, totalPages: number) => {
    const delta = 2;
    const range = [];
    range.push(1);
    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }
    if (totalPages > 1 && range[range.length - 1] !== totalPages) {
      range.push(totalPages);
    }
    return range;
  };

  const pageRange = getPaginationRange(currentPage, totalPages);

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between gap-4"
      >
        <div className="relative w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar produtos..."
            className="pl-8 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSelectAll}
            className="flex items-center gap-2"
          >
            <Check className="h-4 w-4" />
            Marcar todos
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDeselectAll}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Desmarcar todos
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowTextDialog(true)}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            Ver texto
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-12">
                <div className="flex items-center justify-center">
                  #
                </div>
              </TableHead>
              <TableHead className="font-semibold">Produto</TableHead>
              <TableHead className="font-semibold">Categoria</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Tipo</TableHead>
              <TableHead className="font-semibold">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((product) => (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className={`group hover:bg-muted/50 transition-colors duration-200 ${
                      selectedItems.includes(product.id) ? 'bg-muted/30' : ''
                    }`}
                    onClick={() => handleToggleSelect(product.id)}
                  >
                    <TableCell>
                      <div className="flex items-center justify-center">
                        {product.id}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {product.produto}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {product.categoria}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={product.disponivel === 1 ? "success" : "secondary"}
                        className="transition-all duration-300 hover:scale-105"
                      >
                        {product.disponivel === 1 ? "Disponível" : "Vendida"}
                      </Badge>
                    </TableCell>
                    <TableCell>{product.tipo}</TableCell>
                    <TableCell>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(product);
                          }}
                          className="transition-all duration-200 hover:scale-105"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(product.id);
                          }}
                          className="transition-all duration-200 hover:scale-105"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <AlertCircle className="h-8 w-8 mb-2" />
                      <p>Nenhum produto encontrado.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </AnimatePresence>
          </TableBody>
        </Table>
      </motion.div>

      {isDialogOpen && selectedProduct && (
        <ProductDialog
          product={selectedProduct}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSave={handleSave}
        />
      )}

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este produto? Esta ação não pode ser
              desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {filteredProducts.length > ITEMS_PER_PAGE && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageRange={pageRange}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}