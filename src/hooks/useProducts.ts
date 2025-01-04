import { useState } from "react";
import { Product, ProductInput } from '@/features/data/types';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = async (page: number, itemsPerPage: number) => {
    const response = await fetch(`/api/products?page=${page}&itemsPerPage=${itemsPerPage}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch products");
    }
    const data = await response.json();
    setProducts(data.products || []);
    setTotalPages(data.totalPages || 1);
  };

  const createProduct = async (newProduct: ProductInput) => {
    const response = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProduct),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to create product");
    }
    return response.json();
  };

  const updateProduct = async (id: number, updatedProduct: ProductInput) => {
    const response = await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedProduct),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to update product");
    }
    return response.json();
  };

  const deleteProducts = async (ids: number[]) => {
    const response = await fetch(`/api/products`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to delete products");
    }
    return response.json();
  };

  return { products, totalPages, fetchProducts, createProduct, updateProduct, deleteProducts };
};

