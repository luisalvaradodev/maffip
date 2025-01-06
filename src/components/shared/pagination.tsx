import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageRange?: number[];
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const displayPages = () => {
    if (totalPages <= 5) return pages;

    if (currentPage <= 3) return [...pages.slice(0, 5), '...', totalPages];
    if (currentPage >= totalPages - 2) return [1, '...', ...pages.slice(-5)];

    return [
      1,
      '...',
      currentPage - 1,
      currentPage,
      currentPage + 1,
      '...',
      totalPages,
    ];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex justify-center items-center space-x-2 mt-4"
    >
      {/* Botón anterior */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="transition-all duration-200 hover:bg-blue-50"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      {/* Botones de las páginas */}
      {displayPages().map((page, index) => (
        <motion.div
          key={index}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {page === '...' ? (
            <span className="px-3 py-2">...</span>
          ) : (
            <Button
              variant={currentPage === page ? "default" : "outline"}
              onClick={() => typeof page === 'number' && onPageChange(page)}
              className={`min-w-[40px] transition-all duration-200 ${
                currentPage === page
                  ? 'bg-blue-500 hover:bg-blue-600'
                  : 'hover:bg-blue-50'
              }`}
            >
              {page}
            </Button>
          )}
        </motion.div>
      ))}
      
      {/* Botón siguiente */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="transition-all duration-200 hover:bg-blue-50"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </motion.div>
  );
}
