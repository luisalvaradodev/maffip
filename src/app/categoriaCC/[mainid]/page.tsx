'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/hooks/use-toast"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Edit, Trash2, CreditCard, Loader2, AlertCircle } from 'lucide-react'
import { Toaster } from '@/components/ui/toaster'
import { cn } from '@/lib/utils'

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
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState<number | null>(null)
  
  const [newCategory, setNewCategory] = useState<Omit<Category, 'id'>>({
    nome: '',
    valor: 0,
    img: '',
    ativo: 1
  })
  
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false)
  const [isEditCategoryOpen, setIsEditCategoryOpen] = useState(false)
  
  const [newProduct, setNewProduct] = useState<Product>({
    id_produto: 0,
    valor: 0,
    texto: '💎 NÍVEL: \n💳 BANDEIRA: \n🌎 PAÍS: \n🏦 BANCO: ',
    nome: '',
    is_cc: false,
    is_gg: false
  })

  useEffect(() => {
    fetchCategories()
  }, [mainid])

  const fetchCategories = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/categoriaCC/${mainid}`)
      if (!response.ok) throw new Error('Falha ao carregar categorias')
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      toast({
        title: "Erro ao carregar categorias",
        description: "Não foi possível carregar as categorias. Tente novamente.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateCategory = async () => {
    setIsSaving(true)
    try {
      const response = await fetch(`/api/categoriaCC/${mainid}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCategory)
      })
      
      if (!response.ok) throw new Error('Falha ao criar categoria')
      
      await fetchCategories()
      setNewCategory({ nome: '', valor: 0, img: '', ativo: 1 })
      setIsAddCategoryOpen(false)
      toast({
        title: "✨ Categoria adicionada",
        description: "A nova categoria foi adicionada com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro ao criar categoria",
        description: "Não foi possível criar a categoria. Tente novamente.",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleUpdateCategory = async () => {
    if (!editingCategory) return
    setIsSaving(true)
    try {
      const response = await fetch(`/api/categoriaCC/${mainid}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingCategory)
      })
      
      if (!response.ok) throw new Error('Falha ao atualizar categoria')
      
      await fetchCategories()
      setEditingCategory(null)
      setIsEditCategoryOpen(false)
      toast({
        title: "✨ Categoria atualizada",
        description: "A categoria foi atualizada com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro ao atualizar categoria",
        description: "Não foi possível atualizar a categoria. Tente novamente.",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteCategory = async (id: number) => {
    setIsDeleting(id)
    try {
      const response = await fetch(`/api/categoriaCC/${mainid}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      
      if (!response.ok) throw new Error('Falha ao excluir categoria')
      
      await fetchCategories()
      toast({
        title: "Categoria excluída",
        description: "A categoria foi excluída com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro ao excluir categoria",
        description: "Não foi possível excluir a categoria. Tente novamente.",
        variant: "destructive"
      })
    } finally {
      setIsDeleting(null)
    }
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      const response = await fetch('/api/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newProduct,
          mainid: mainid
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Falha ao adicionar produto')
      }
      
      setNewProduct({
        id_produto: 0,
        valor: 0,
        texto: '💎 NÍVEL: \n💳 BANDEIRA: \n🌎 PAÍS: \n🏦 BANCO: ',
        nome: '',
        is_cc: false,
        is_gg: false
      })
      
      toast({
        title: "✨ Produto adicionado",
        description: "O novo produto foi adicionado com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro ao adicionar produto",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao adicionar o produto.",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
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
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="space-y-8"
        >
          {/* Categories Card */}
          <Card className="overflow-hidden border-none shadow-lg dark:bg-gray-800/50 backdrop-blur-sm rounded-lg">
            <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/5 dark:to-primary/10 rounded-t-lg">
              <div className="flex items-center space-x-2">
                <CreditCard className="w-6 h-6 text-primary" />
                <CardTitle>Categorias CC</CardTitle>
              </div>
              
              <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
                <DialogTrigger asChild>
                  <Button 
                    className="transition-all duration-300 hover:scale-105 hover:shadow-lg rounded-lg"
                    disabled={isLoading}
                  >
                    <Plus className="mr-2 h-4 w-4" /> 
                    Adicionar Categoria
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] rounded-lg">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-primary">Nova Categoria</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">Nome</Label>
                      <Input
                        value={newCategory.nome}
                        onChange={(e) => setNewCategory({ ...newCategory, nome: e.target.value })}
                        className="w-full rounded-lg border border-border/50 focus:border-primary focus:ring-1 focus:ring-primary"
                        placeholder="Digite o nome da categoria"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">Valor</Label>
                      <Input
                        type="number"
                        value={newCategory.valor}
                        onChange={(e) => setNewCategory({ ...newCategory, valor: parseFloat(e.target.value) })}
                        className="w-full rounded-lg border border-border/50 focus:border-primary focus:ring-1 focus:ring-primary"
                        placeholder="Digite o valor da categoria"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">Imagem URL</Label>
                      <Input
                        value={newCategory.img || ''}
                        onChange={(e) => setNewCategory({ ...newCategory, img: e.target.value })}
                        className="w-full rounded-lg border border-border/50 focus:border-primary focus:ring-1 focus:ring-primary"
                        placeholder="Digite a URL da imagem"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium text-muted-foreground">Ativo</Label>
                      <Switch
                        checked={newCategory.ativo === 1}
                        onCheckedChange={(checked) => setNewCategory({ ...newCategory, ativo: checked ? 1 : 0 })}
                        className="data-[state=checked]:bg-primary rounded-full"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button 
                      onClick={handleCreateCategory}
                      disabled={isSaving}
                      className="w-full rounded-lg bg-primary text-white hover:bg-primary/90 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Criando...
                        </>
                      ) : (
                        'Criar Categoria'
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            
            <CardContent className="p-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : categories.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <AlertCircle className="w-8 h-8 mb-2" />
                  <p>Nenhuma categoria encontrada</p>
                </div>
              ) : (
                <div className="rounded-lg overflow-hidden border border-border/50">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50 dark:bg-muted/10">
                        <TableHead>Nome</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Imagem</TableHead>
                        <TableHead>Ativo</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <AnimatePresence>
                        {categories.map((category, index) => (
                          <motion.tr
                            key={category.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.2, delay: index * 0.05 }}
                            className={cn(
                              "transition-colors hover:bg-muted/50 dark:hover:bg-muted/10",
                              "group cursor-default"
                            )}
                          >
                            <TableCell className="font-medium">{category.nome}</TableCell>
                            <TableCell>R$ {Number(category.valor).toFixed(2)}</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <span className={cn(
                                  "h-2 w-2 rounded-full",
                                  category.img ? "bg-green-500" : "bg-red-500"
                                )} />
                                <span className="text-sm text-muted-foreground">
                                  {category.img ? "Sim" : "Não"}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Switch
                                checked={category.ativo === 1}
                                className="pointer-events-none rounded-full"
                              />
                            </TableCell>
                            <TableCell>
                              <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Dialog open={isEditCategoryOpen} onOpenChange={setIsEditCategoryOpen}>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      className="hover:bg-primary/10 rounded-lg"
                                      onClick={() => setEditingCategory(category)}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="sm:max-w-[425px] rounded-lg">
                                    <DialogHeader>
                                      <DialogTitle className="text-2xl font-bold text-primary">Editar Categoria</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-6">
                                      <div className="space-y-2">
                                        <Label className="text-sm font-medium text-muted-foreground">Nome</Label>
                                        <Input
                                          value={editingCategory?.nome || ''}
                                          onChange={(e) => setEditingCategory(editingCategory ? { ...editingCategory, nome: e.target.value } : null)}
                                          className="w-full rounded-lg border border-border/50 focus:border-primary focus:ring-1 focus:ring-primary"
                                          placeholder="Digite o nome da categoria"
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label className="text-sm font-medium text-muted-foreground">Valor</Label>
                                        <Input
                                          type="number"
                                          value={editingCategory?.valor || 0}
                                          onChange={(e) => setEditingCategory(editingCategory ? { ...editingCategory, valor: parseFloat(e.target.value) } : null)}
                                          className="w-full rounded-lg border border-border/50 focus:border-primary focus:ring-1 focus:ring-primary"
                                          placeholder="Digite o valor da categoria"
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label className="text-sm font-medium text-muted-foreground">Imagem URL</Label>
                                        <Input
                                          value={editingCategory?.img || ''}
                                          onChange={(e) => setEditingCategory(editingCategory ? { ...editingCategory, img: e.target.value } : null)}
                                          className="w-full rounded-lg border border-border/50 focus:border-primary focus:ring-1 focus:ring-primary"
                                          placeholder="Digite a URL da imagem"
                                        />
                                      </div>
                                      <div className="flex items-center justify-between">
                                        <Label className="text-sm font-medium text-muted-foreground">Ativo</Label>
                                        <Switch
                                          checked={editingCategory?.ativo === 1}
                                          onCheckedChange={(checked) => setEditingCategory(editingCategory ? { ...editingCategory, ativo: checked ? 1 : 0 } : null)}
                                          className="data-[state=checked]:bg-primary rounded-full"
                                        />
                                      </div>
                                    </div>
                                    <DialogFooter>
                                      <Button 
                                        onClick={handleUpdateCategory}
                                        disabled={isSaving}
                                        className="w-full rounded-lg bg-primary text-white hover:bg-primary/90 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                                      >
                                        {isSaving ? (
                                          <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Atualizando...
                                          </>
                                        ) : (
                                          'Atualizar Categoria'
                                        )}
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                                <Button
                                  variant="destructive"
                                  size="icon"
                                  className="hover:bg-destructive/90 rounded-lg"
                                  onClick={() => handleDeleteCategory(category.id)}
                                  disabled={isDeleting === category.id}
                                >
                                  {isDeleting === category.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Trash2 className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </TableCell>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Add Product Card */}
          <Card className="border-none shadow-lg dark:bg-gray-800/50 backdrop-blur-sm rounded-lg">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/5 dark:to-primary/10 rounded-t-lg">
              <CardTitle>Adicionar CC/GG</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <motion.form
                onSubmit={handleAddProduct}
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-2">
                  <Label>
                    Categoria <span className="text-red-500">*</span>
                  </Label>
                  <Select onValueChange={handleCategoryChange}>
                    <SelectTrigger className="w-full rounded-lg">
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent className="rounded-lg">
                      {categories.map((category) => (
                        <SelectItem 
                          key={category.id} 
                          value={category.id.toString()}
                          className="cursor-pointer rounded-lg"
                        >
                          {category.nome} - R$ {Number(category.valor).toFixed(2)}
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
                      className="rounded-lg"
                    />
                    <Label htmlFor="is_cc">CC</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="is_gg"
                      checked={newProduct.is_gg}
                      onCheckedChange={(checked) => 
                        setNewProduct({ ...newProduct, is_gg: checked as boolean })}
                      className="rounded-lg"
                    />
                    <Label htmlFor="is_gg">GG</Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>
                    Informações adicionais <span className="text-muted-foreground text-sm">(opcional)</span>
                  </Label>
                  <Textarea
                    value={newProduct.texto}
                    onChange={(e) => setNewProduct({ ...newProduct, texto: e.target.value })}
                    rows={4}
                    className="resize-none rounded-lg"
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
                    className="resize-none rounded-lg"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full transition-all duration-300 hover:scale-105 hover:shadow-lg rounded-lg"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    'Salvar'
                  )}
                </Button>
              </motion.form>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}