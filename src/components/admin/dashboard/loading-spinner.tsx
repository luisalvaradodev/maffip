import { motion } from "framer-motion";

export function LoadingSpinner() {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="flex items-center justify-center h-screen"
    >
      <div className="relative">
        <div className="absolute top-0 left-0 right-0 bottom-0 animate-ping rounded-full h-32 w-32 border-t-2 border-b-2 border-primary/30"></div>
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    </motion.div>
  );
}