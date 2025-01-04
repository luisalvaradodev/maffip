"use client";

import { useEffect, useState } from "react";
import { Product } from "@/features/data/types";
import { ProductTable } from "@/components/products/product-table";
import { Button } from "@/components/ui/button";
import { ProductDialog } from "@/components/products/product-dialog";
import { Plus, Package } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/products");
      const data = await response.json();
      setProducts(data.products || []);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
        body: JSON.stringify(product),
      });
      if (response.ok) {
        toast.success("Produto criado com sucesso");
        fetchProducts();
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Erro ao criar produto");
    }
  };

  const handleUpdate = async (product: Product) => {
    try {
      const response = await fetch("/api/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
      if (response.ok) {
        toast.success("Produto atualizado com sucesso");
        fetchProducts();
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
        fetchProducts();
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
          onClick={() => setIsDialogOpen(true)}
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
            onUpdate={handleUpdate}
          />
        )}
      </motion.div>

      <ProductDialog
        product={null}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={(product: Product) => {
          if (!product.produto || !product.categoria) {
            toast.error("Preencha os campos obrigatórios!");
            return;
          }
          handleCreate(product);
          setIsDialogOpen(false);
        }}
      />
    </motion.div>
  );
}