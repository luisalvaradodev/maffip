import { useState } from 'react';
import { Category, CategoryInput } from '@/features/data/types';

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchCategories = async () => {
    const response = await fetch('/api/categories');
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    const data = await response.json();
    setCategories(data);
  };

  const createCategory = async (category: CategoryInput) => {
    const response = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(category),
    });
    if (!response.ok) {
      throw new Error('Failed to create category');
    }
    await fetchCategories();
  };

  const updateCategory = async (id: number, category: CategoryInput) => {
    const response = await fetch(`/api/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(category),
    });
    if (!response.ok) {
      throw new Error('Failed to update category');
    }
    await fetchCategories();
  };

  const deleteCategories = async (ids: number[]) => {
    const response = await fetch('/api/categories', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids }),
    });
    if (!response.ok) {
      throw new Error('Failed to delete categories');
    }
    await fetchCategories();
  };

  const toggleCategoryStatus = async (id: number) => {
    const response = await fetch(`/api/categories/${id}/toggle-status`, {
      method: 'PUT',
    });
    if (!response.ok) {
      throw new Error('Failed to toggle category status');
    }
    await fetchCategories();
  };

  return {
    categories,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategories,
    toggleCategoryStatus,
  };
};

