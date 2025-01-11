import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface AdminHeaderProps {
  onCreateUser: () => void;
}

export function AdminHeader({ onCreateUser }: AdminHeaderProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-between items-center mb-6"
    >
      <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
        Painel de Administração
      </h1>
      <Button 
        onClick={onCreateUser}
        className="transition-all duration-300 hover:scale-105 bg-gradient-to-r from-primary to-purple-600"
      >
        <Plus className="mr-2 h-4 w-4" />
        Criar Novo Usuário
      </Button>
    </motion.div>
  );
}