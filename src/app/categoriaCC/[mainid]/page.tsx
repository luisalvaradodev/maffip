'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/hooks/use-toast"
import { motion } from "framer-motion"
import { Plus, Edit, Trash2 } from 'lucide-react'
import { Toaster } from '@/components/ui/toaster'

interface Category {
  id: number
  nome: string
  valor: number
  img: string | null
  ativo: number
}

interface Product {
  id_produto: number
  valor: number
  texto: string
  nome: string
  is_cc: boolean
  is_gg: boolean
}

export default function CategoriaCCPage() {
  const { mainid } = useParams()
  const [categories, setCategories] = useState<Category[]>([])
  const [newCategory, setNewCategory] = useState<Omit<Category, 'id'>>({
    nome: '',
    valor: 0,
    img: '',
    ativo: 1
  })
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [newProduct, setNewProduct] = useState<Product>({
    id_produto: 0,
    valor: 0,
    texto: '💎 NIVEL: \n💳 BANDEIRA: \n🌎 PAIS: \n🏦 BANCO: ',
    nome: '',
    is_cc: false,
    is_gg: false
  })
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false)
  const [isEditCategoryOpen, setIsEditCategoryOpen] = useState(false)

  useEffect(() => {
    fetchCategories()
  }, [mainid])

  const fetchCategories = async () => {
    const response = await fetch(`/api/categoriaCC/${mainid}`)
    const data = await response.json()
    setCategories(data)
  }

  const handleCreateCategory = async () => {
    const response = await fetch(`/api/categoriaCC/${mainid}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCategory)
    })
    if (response.ok) {
      fetchCategories()
      setNewCategory({ nome: '', valor: 0, img: '', ativo: 1 })
      setIsAddCategoryOpen(false)
      toast({
        title: "Categoria adicionada",
        description: "A nova categoria foi adicionada com sucesso.",
      })
    }
  }

  const handleUpdateCategory = async () => {
    if (!editingCategory) return
    const response = await fetch(`/api/categoriaCC/${mainid}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingCategory)
    })
    if (response.ok) {
      fetchCategories()
      setEditingCategory(null)
      setIsEditCategoryOpen(false)
      toast({
        title: "Categoria atualizada",
        description: "A categoria foi atualizada com sucesso.",
      })
    }
  }

  const handleDeleteCategory = async (id: number) => {
    const response = await fetch(`/api/categoriaCC/${mainid}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
    if (response.ok) {
      fetchCategories()
      toast({
        title: "Categoria excluída",
        description: "A categoria foi excluída com sucesso.",
      })
    }
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    const response = await fetch('/api/store', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...newProduct,
        mainid: mainid
      })
    })
    if (response.ok) {
      setNewProduct({
        id_produto: 0,
        valor: 0,
        texto: '💎 NIVEL: \n💳 BANDEIRA: \n🌎 PAIS: \n🏦 BANCO: ',
        nome: '',
        is_cc: false,
        is_gg: false
      })
      toast({
        title: "Produto adicionado",
        description: "O novo produto foi adicionado com sucesso.",
      })
    } else {
      const errorData = await response.json()
      toast({
        title: "Erro ao adicionar produto",
        description: errorData.error || "Ocorreu um erro ao adicionar o produto.",
        variant: "destructive"
      })
    }
  }

  const handleCategoryChange = (categoryId: string) => {
    const selectedCategory = categories.find(cat => cat.id === parseInt(categoryId))
    if (selectedCategory) {
      setNewProduct(prev => ({
        ...prev,
        id_produto: selectedCategory.id,
        valor: selectedCategory.valor
      }))
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <Toaster />
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Categorias CC</CardTitle>
            <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
              <DialogTrigger asChild>
                <Button className="transition-all duration-200 hover:scale-105">
                  <Plus className="mr-2 h-4 w-4" /> Adicionar Categoria
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Nova Categoria</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="nome" className="text-right">
                      Nome
                    </Label>
                    <Input
                      id="nome"
                      value={newCategory.nome}
                      onChange={(e) => setNewCategory({ ...newCategory, nome: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="valor" className="text-right">
                      Valor
                    </Label>
                    <Input
                      id="valor"
                      type="number"
                      value={newCategory.valor}
                      onChange={(e) => setNewCategory({ ...newCategory, valor: parseFloat(e.target.value) })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="img" className="text-right">
                      Imagem URL
                    </Label>
                    <Input
                      id="img"
                      value={newCategory.img || ''}
                      onChange={(e) => setNewCategory({ ...newCategory, img: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="ativo" className="text-right">
                      Ativo
                    </Label>
                    <Switch
                      id="ativo"
                      checked={newCategory.ativo === 1}
                      onCheckedChange={(checked) => setNewCategory({ ...newCategory, ativo: checked ? 1 : 0 })}
                    />
                  </div>
                </div>
                <Button onClick={handleCreateCategory}>Criar Categoria</Button>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Imagem</TableHead>
                  <TableHead>Ativo</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>{category.nome}</TableCell>
                    <TableCell>{category.valor}</TableCell>
                    <TableCell>{category.img ? 'Sim' : 'Não'}</TableCell>
                    <TableCell>{category.ativo === 1 ? 'Sim' : 'Não'}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Dialog open={isEditCategoryOpen} onOpenChange={setIsEditCategoryOpen}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => setEditingCategory(category)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Editar Categoria</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-nome" className="text-right">
                                  Nome
                                </Label>
                                <Input
                                  id="edit-nome"
                                  value={editingCategory?.nome || ''}
                                  onChange={(e) => setEditingCategory(editingCategory ? { ...editingCategory, nome: e.target.value } : null)}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-valor" className="text-right">
                                  Valor
                                </Label>
                                <Input
                                  id="edit-valor"
                                  type="number"
                                  value={editingCategory?.valor || 0}
                                  onChange={(e) => setEditingCategory(editingCategory ? { ...editingCategory, valor: parseFloat(e.target.value) } : null)}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-img" className="text-right">
                                  Imagem URL
                                </Label>
                                <Input
                                  id="edit-img"
                                  value={editingCategory?.img || ''}
                                  onChange={(e) => setEditingCategory(editingCategory ? { ...editingCategory, img: e.target.value } : null)}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-ativo" className="text-right">
                                  Ativo
                                </Label>
                                <Switch
                                  id="edit-ativo"
                                  checked={editingCategory?.ativo === 1}
                                  onCheckedChange={(checked) => setEditingCategory(editingCategory ? { ...editingCategory, ativo: checked ? 1 : 0 } : null)}
                                />
                              </div>
                            </div>
                            <Button onClick={handleUpdateCategory}>Atualizar Categoria</Button>
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDeleteCategory(category.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>

      <Card>
        <CardHeader>
          <CardTitle>Adicionar CC/GG</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddProduct} className="space-y-6">
            <div className="space-y-2">
              <Label>
                Categoria <span className="text-red-500">*</span>
              </Label>
              <Select onValueChange={handleCategoryChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex space-x-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_cc"
                  checked={newProduct.is_cc}
                  onCheckedChange={(checked) => 
                    setNewProduct({ ...newProduct, is_cc: checked as boolean })}
                />
                <Label htmlFor="is_cc">CC</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_gg"
                  checked={newProduct.is_gg}
                  onCheckedChange={(checked) => 
                    setNewProduct({ ...newProduct, is_gg: checked as boolean })}
                />
                <Label htmlFor="is_gg">GG</Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label>
                Informações adicionais <span className="text-gray-500">(opcional)</span>
              </Label>
              <Textarea
                value={newProduct.texto}
                onChange={(e) => setNewProduct({ ...newProduct, texto: e.target.value })}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label>
                Dados <span className="text-red-500">*</span>
              </Label>
              <Textarea
                value={newProduct.nome}
                onChange={(e) => setNewProduct({ ...newProduct, nome: e.target.value })}
                placeholder="Número do cartão, data de validade e CVV"
                rows={6}
                required
              />
            </div>

            <Button type="submit">
              Salvar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

