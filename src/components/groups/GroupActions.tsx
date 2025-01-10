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
    if (window.confirm("Are you sure you want to delete all groups?")) {
      onDeleteAll()
      toast({
        title: "Success",
        description: "All groups have been deleted.",
        variant: "default",
      })
    }
  }

  return (
    <div className="flex justify-between items-center mb-4 p-4 bg-background rounded-lg shadow-sm">
      <p className="text-sm text-muted-foreground">
        Total Groups: <span className="font-semibold text-primary">{groupCount}</span>
      </p>
      <div className="space-x-2">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-block"
        >
          <Button variant="outline" size="sm" onClick={onRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-block"
        >
          <Button variant="destructive" size="sm" onClick={handleDeleteAll}>
            <Trash className="mr-2 h-4 w-4" />
            Delete All
          </Button>
        </motion.div>
      </div>
    </div>
  )
}