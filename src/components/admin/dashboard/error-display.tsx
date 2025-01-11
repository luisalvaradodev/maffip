import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorDisplayProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorDisplay({ message, onRetry }: ErrorDisplayProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center h-screen gap-4"
    >
      <AlertCircle className="h-12 w-12 text-destructive" />
      <div className="text-xl font-semibold text-destructive">{message}</div>
      {onRetry && (
        <Button 
          onClick={onRetry}
          variant="outline"
          className="mt-4 hover:scale-105 transition-transform"
        >
          Tentar Novamente
        </Button>
      )}
    </motion.div>
  );
}