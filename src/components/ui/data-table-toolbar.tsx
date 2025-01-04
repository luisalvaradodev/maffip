import { Input } from "./input"
import { Button } from "./button"
import { Search, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface DataTableToolbarProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  placeholder?: string
}

export function DataTableToolbar({
  searchQuery,
  onSearchChange,
  placeholder = "Search..."
}: DataTableToolbarProps) {
  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex w-full max-w-sm items-center space-x-2">
        <div className="relative w-full">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8"
          />
          <AnimatePresence>
            {searchQuery && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                className="absolute right-2 top-2.5"
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-5 w-5 p-0"
                  onClick={() => onSearchChange("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}