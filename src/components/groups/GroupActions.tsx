import { Button } from "@/components/ui/button"
import { RefreshCw, Trash } from 'lucide-react'
import { motion } from "framer-motion"

interface GroupActionsProps {
  groupCount: number
  onRefresh: () => void
  onDeleteAll: () => void
}

export function GroupActions({ groupCount, onRefresh, onDeleteAll }: GroupActionsProps) {
  return (
    <div className="flex justify-between items-center mb-4">
      <p className="text-sm text-muted-foreground">
        Total Groups: <span className="font-semibold">{groupCount}</span>
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
          <Button variant="destructive" size="sm" onClick={onDeleteAll}>
            <Trash className="mr-2 h-4 w-4" />
            Delete All
          </Button>
        </motion.div>
      </div>
    </div>
  )
}

