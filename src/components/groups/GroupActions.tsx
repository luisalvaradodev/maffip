import { Button } from "@/components/ui/button"
import { RefreshCw, Trash } from 'lucide-react'
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"

interface GroupActionsProps {
  groupCount: number
  onRefresh: () => void
  onDeleteAll: () => void
}

export function GroupActions({ groupCount, onRefresh, onDeleteAll }: GroupActionsProps) {
  const { toast } = useToast()

  const handleDeleteAll = () => {
    if (window.confirm("Tem certeza que deseja excluir todos os grupos?")) {
      onDeleteAll()
      toast({
        title: "Sucesso",
        description: "Todos os grupos foram excluídos.",
        variant: "default",
      })
    }
  }

  return (
    <div className="flex justify-between items-center mb-4 p-4 bg-background rounded-lg shadow-sm border">
      <p className="text-sm text-muted-foreground">
        Total de Grupos: <span className="font-semibold text-primary">{groupCount}</span>
      </p>
      <div className="space-x-2">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-block"
        >
          <Button variant="outline" size="sm" onClick={onRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Atualizar
          </Button>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-block"
        >
          <Button variant="destructive" size="sm" onClick={handleDeleteAll}>
            <Trash className="mr-2 h-4 w-4" />
            Excluir Todos
          </Button>
        </motion.div>
      </div>
    </div>
  )
}