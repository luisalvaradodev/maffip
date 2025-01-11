"use client";

import { useEffect, useState } from "react";
import { Category } from "@/features/data/types";
import { CategoryTable } from "@/components/categories/category-table";
import { CategoryDialog } from "@/components/categories/category-dialog";
import { Button } from "@/components/ui/button";
import { Plus, FolderTree } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useParams } from "next/navigation"; // Importa useParams para obtener el mainid de la URL

export default function CategoriesPage() {
  const { mainid } = useParams(); // Obtén el mainid de la URL
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (mainid) {
      fetchCategories();
    }
  }, [mainid]); // Vuelve a cargar las categorías cuando cambie el mainid

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/categories?mainid=${mainid}`);
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      toast.error("Erro ao carregar categorias");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (category: Category) => {
    try {
      const method = category.id ? "PUT" : "POST";
      const response = await fetch("/api/categories", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...category, mainid }), // Incluye el mainid en el cuerpo de la solicitud
      });

      if (response.ok) {
        toast.success(
          category.id
            ? "Categoria atualizada com sucesso"
            : "Categoria criada com sucesso"
        );
        fetchCategories();
        setIsDialogOpen(false); // Cierra el diálogo después de guardar
      } else {
        toast.error("Erro ao salvar categoria");
      }
    } catch (error) {
      toast.error("Erro ao salvar categoria");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/categories?id=${id}&mainid=${mainid}`, {
        method: "DELETE",
      });
      if (response.ok) {
        toast.success("Categoria excluída com sucesso");
        fetchCategories();
      } else {
        toast.error("Erro ao excluir categoria");
      }
    } catch (error) {
      toast.error("Erro ao excluir categoria");
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
          <FolderTree className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Suas Categorias
          </h1>
        </div>
        <Button
          onClick={() => {
            setSelectedCategory(null); // Asegúrate de que selectedCategory sea null para una nueva categoría
            setIsDialogOpen(true);
          }}
          className="transition-all duration-200 hover:scale-105"
        >
          <Plus className="mr-2 h-4 w-4" /> Nova Categoria
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
          <CategoryTable
            categories={categories}
            onDelete={handleDelete}
            onEdit={(category) => {
              setSelectedCategory(category);
              setIsDialogOpen(true);
            }}
          />
        )}
      </motion.div>

      <CategoryDialog
        category={selectedCategory}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={(category) => {
          if (!category.nome) {
            toast.error("O nome da categoria é obrigatório!");
            return;
          }
          handleCreateOrUpdate(category);
          setIsDialogOpen(false);
        }}
      />
    </motion.div>
  );
}