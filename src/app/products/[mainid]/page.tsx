"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Product } from "@/features/data/types";
import { ProductTable } from "@/components/products/product-table";
import { Button } from "@/components/ui/button";
import { ProductDialog } from "@/components/products/product-dialog";
import { Plus, Package } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function ProductsPage() {
  const { mainid } = useParams<{ mainid: string }>(); // Obtener el mainid de la URL
  const [products, setProducts] = useState<Product[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (mainid) {
      fetchProducts(mainid); // Llamar a fetchProducts con el mainid
    }
  }, [mainid]);

  const fetchProducts = async (mainid: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products?mainid=${mainid}`); // Filtrar por mainid
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      toast.error("Erro ao carregar produtos");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (product: Product) => {
    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...product, mainid }), // Incluir mainid en la creación
      });
      if (response.ok) {
        toast.success("Produto criado com sucesso");
        fetchProducts(mainid); // Recargar los productos después de crear
      }
    } catch (error) {
      toast.error("Erro ao criar produto");
    }
  };

  const handleUpdate = async (product: Product) => {
    try {
      const response = await fetch("/api/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...product, mainid }), // Incluir mainid en la actualización
      });
      if (response.ok) {
        toast.success("Produto atualizado com sucesso");
        fetchProducts(mainid); // Recargar los productos después de actualizar
      }
    } catch (error) {
      toast.error("Erro ao atualizar produto");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/products?ids=${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        toast.success("Produto excluído com sucesso");
        fetchProducts(mainid); // Recargar los productos después de eliminar
      }
    } catch (error) {
      toast.error("Erro ao excluir produto");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto py-10"
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-6"
      >
        <div className="flex items-center gap-2">
          <Package className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Seus Produtos
          </h1>
        </div>
        <Button
          onClick={() => {
            setSelectedProduct(null); // Limpiar el producto seleccionado al crear uno nuevo
            setIsDialogOpen(true);
          }}
          className="transition-all duration-200 hover:scale-105"
        >
          <Plus className="mr-2 h-4 w-4" /> Novo Produto
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card rounded-lg shadow-lg p-6"
      >
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <ProductTable
            products={products}
            onDelete={handleDelete}
            onUpdate={(product) => {
              setSelectedProduct(product); // Establecer el producto seleccionado para editar
              setIsDialogOpen(true);
            }}
          />
        )}
      </motion.div>

      <ProductDialog
        product={selectedProduct} // Pasar el producto seleccionado al diálogo
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={(product: Product) => {
          if (!product.produto || !product.categoria) {
            toast.error("Preencha os campos obrigatórios!");
            return;
          }
          if (selectedProduct) {
            handleUpdate(product); // Actualizar si hay un producto seleccionado
          } else {
            handleCreate(product); // Crear si no hay un producto seleccionado
          }
          setIsDialogOpen(false);
        }}
      />
    </motion.div>
  );
}