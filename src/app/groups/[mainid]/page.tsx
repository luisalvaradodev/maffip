'use client'

import { useState, useEffect } from 'react'
import { GroupList } from '@/components/groups/GroupList'
import { GroupActions } from '@/components/groups/GroupActions'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Loader2 } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { use } from 'react' // Importar use para desenvolver params

interface Group {
  id: number
  jid: string
  nome: string
  participantes: number
  log: boolean
  log_adm: boolean
}

export default function GroupsPage({ params }: { params: { mainid: string } }) {
  // Desenvolver params usando React.use()
  const { mainid } = use(params)

  const [groups, setGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [entriesPerPage, setEntriesPerPage] = useState('10')
  const [newGroupName, setNewGroupName] = useState('')
  const [newGroupJid, setNewGroupJid] = useState('')
  const [newGroupParticipants, setNewGroupParticipants] = useState('')
  const { toast } = useToast()

  // Buscar grupos quando mainid mudar
  useEffect(() => {
    fetchGroups()
  }, [mainid])

  const fetchGroups = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/groups?mainid=${mainid}`)
      if (!response.ok) {
        throw new Error('Falha ao buscar grupos')
      }
      const data: Group[] = await response.json()
      setGroups(data)
    } catch (error) {
      console.error('Erro ao buscar grupos:', error)
      toast({
        title: "Erro",
        description: "Falha ao buscar grupos. Por favor, tente novamente.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAll = async () => {
    if (window.confirm('Tem certeza que deseja deletar todos os grupos? Esta ação não pode ser desfeita.')) {
      try {
        const response = await fetch(`/api/groups?mainid=${mainid}`, { method: 'DELETE' })
        if (!response.ok) {
          throw new Error('Falha ao deletar todos os grupos')
        }
        setGroups([])
        toast({
          title: "Sucesso",
          description: "Todos os grupos foram deletados.",
        })
      } catch (error) {
        console.error('Erro ao deletar todos os grupos:', error)
        toast({
          title: "Erro",
          description: "Falha ao deletar todos os grupos. Por favor, tente novamente.",
          variant: "destructive",
        })
      }
    }
  }

  const handleToggleLog = async (groupId: number, type: 'log' | 'log_adm') => {
    try {
      const group = groups.find(g => g.id === groupId)
      if (!group) throw new Error('Grupo não encontrado')

      const updatedGroup = { ...group, [type]: !group[type] }
      const response = await fetch(`/api/groups/${groupId}?mainid=${mainid}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [type]: updatedGroup[type] }),
      })

      if (!response.ok) throw new Error('Falha ao atualizar grupo')

      setGroups(prevGroups =>
        prevGroups.map(g => (g.id === groupId ? updatedGroup : g))
      )

      toast({
        title: "Sucesso",
        description: `${type === 'log' ? 'Log' : 'Log de admin'} ${updatedGroup[type] ? 'ativado' : 'desativado'} para ${group.nome}`,
      })
    } catch (error) {
      console.error('Erro ao alternar log:', error)
      toast({
        title: "Erro",
        description: "Falha ao alternar log. Por favor, tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleAddGroup = async () => {
    try {
      const response = await fetch(`/api/groups?mainid=${mainid}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: newGroupName,
          jid: newGroupJid,
          participantes: parseInt(newGroupParticipants),
        }),
      })

      if (!response.ok) throw new Error('Falha ao adicionar grupo')

      const newGroup = await response.json()
      setGroups(prevGroups => [...prevGroups, newGroup])
      setNewGroupName('')
      setNewGroupJid('')
      setNewGroupParticipants('')

      toast({
        title: "Sucesso",
        description: "Grupo adicionado com sucesso.",
      })
    } catch (error) {
      console.error('Erro ao adicionar grupo:', error)
      toast({
        title: "Erro",
        description: "Falha ao adicionar grupo. Por favor, tente novamente.",
        variant: "destructive",
      })
    }
  }

  const filteredGroups = groups.filter(group =>
    (group.nome?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (group.jid || '').includes(searchTerm)
  )

  const tabGroups = {
    all: filteredGroups,
    logged: filteredGroups.filter(group => group.log),
    admin: filteredGroups.filter(group => group.log_adm),
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-8"
    >
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
            Gerenciamento de Grupos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
              <Input
                placeholder="Buscar grupos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full"
              />
            </div>
            <Select value={entriesPerPage} onValueChange={setEntriesPerPage}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Entradas por página" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 por página</SelectItem>
                <SelectItem value="25">25 por página</SelectItem>
                <SelectItem value="50">50 por página</SelectItem>
                <SelectItem value="100">100 por página</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Adicionar Novo Grupo</h2>
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <Input
                placeholder="Nome do Grupo"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
              />
              <Input
                placeholder="JID do Grupo"
                value={newGroupJid}
                onChange={(e) => setNewGroupJid(e.target.value)}
              />
              <Input
                placeholder="Participantes"
                value={newGroupParticipants}
                onChange={(e) => setNewGroupParticipants(e.target.value)}
                type="number"
              />
              <Button onClick={handleAddGroup}>Adicionar Grupo</Button>
            </div>
          </div>
          <GroupActions 
            groupCount={filteredGroups.length} 
            onRefresh={fetchGroups} 
            onDeleteAll={handleDeleteAll}
          />
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="all">Todos os Grupos</TabsTrigger>
              <TabsTrigger value="logged">Grupos com Log</TabsTrigger>
              <TabsTrigger value="admin">Log de Admin</TabsTrigger>
            </TabsList>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <TabsContent value={activeTab}>
                  {loading ? (
                    <div className="flex justify-center items-center h-64">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  ) : (
                    <GroupList 
                      groups={tabGroups[activeTab as keyof typeof tabGroups]}
                      onRefresh={fetchGroups}
                      loading={false}
                      entriesPerPage={parseInt(entriesPerPage)}
                      onToggleLog={handleToggleLog}
                    />
                  )}
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  )
}