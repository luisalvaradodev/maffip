'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { 
  Loader2, Save, Edit, Info, CreditCard, LifeBuoy, 
  User, MessagesSquare, ChevronDown, MessageCircle, 
  Clock, LayoutGrid 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

type Textos = {
  texto_titulo: string;
  texto_info: string;
  texto_contas: string;
  texto_suporte: string;
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  },
  hover: { 
    scale: 1.02,
    transition: { duration: 0.2 }
  },
  tap: { scale: 0.98 }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const getCardStyle = (field: keyof Textos) => {
  const styles = {
    texto_titulo: {
      gradient: 'from-blue-500 to-blue-400',
      icon: 'text-blue-500',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800'
    },
    texto_info: {
      gradient: 'from-emerald-500 to-emerald-400',
      icon: 'text-emerald-500',
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
      border: 'border-emerald-200 dark:border-emerald-800'
    },
    texto_contas: {
      gradient: 'from-violet-500 to-violet-400',
      icon: 'text-violet-500',
      bg: 'bg-violet-50 dark:bg-violet-900/20',
      border: 'border-violet-200 dark:border-violet-800'
    },
    texto_suporte: {
      gradient: 'from-rose-500 to-rose-400',
      icon: 'text-rose-500',
      bg: 'bg-rose-50 dark:bg-rose-900/20',
      border: 'border-rose-200 dark:border-rose-800'
    }
  };
  
  return styles[field];
};

export default function TextosPage() {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const [textos, setTextos] = useState<Textos>({
    texto_titulo: 'Bienvenido a nuestro servicio.',
    texto_info: 'Aquí encontrarás información útil.',
    texto_contas: 'Puedes gestionar tus cuentas aquí.',
    texto_suporte: '¿Necesitas ayuda? Contacta con soporte.',
  });
  const [editingField, setEditingField] = useState<keyof Textos | ''>('');
  const [tempText, setTempText] = useState('');
  const [previewMode, setPreviewMode] = useState<'chat' | 'cards'>('chat');

  useEffect(() => {
    fetchTextos();
  }, []);

  const fetchTextos = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/textos');
      if (!response.ok) throw new Error('Error fetching texts');
      const data = await response.json();
      setTextos(data[0] || textos);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los textos.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!validateInputs()) {
      toast({
        title: 'Campos vacíos',
        description: 'Por favor, complete todos los campos.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setSaving(true);
      const response = await fetch('/api/textos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(textos),
      });

      if (!response.ok) throw new Error('Error saving texts');

      toast({
        title: 'Éxito',
        description: 'Textos actualizados correctamente.',
      });
      setEditingField('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudieron guardar los cambios.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const validateInputs = () => {
    return Object.values(textos).every(text => text.trim() !== '');
  };

  const openDialog = (field: keyof Textos) => {
    setEditingField(field);
    setTempText(textos[field]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTempText(e.target.value);
  };

  const handleDialogSave = () => {
    if (editingField && tempText.trim()) {
      setTextos(prev => ({
        ...prev,
        [editingField]: tempText
      }));
      setEditingField('');
      toast({
        title: 'Campo actualizado',
        description: 'No olvides guardar todos los cambios.',
      });
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header Section */}
      <motion.div 
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8"
      >
        <motion.h1 
          className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          Gestión de Textos
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            onClick={handleSave}
            disabled={saving}
            size="lg"
            className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-90 transition-all duration-300"
          >
            {saving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Guardar cambios
          </Button>
        </motion.div>
      </motion.div>

      {/* Cards Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {Object.entries(textos).map(([field, text]) => {
          const style = getCardStyle(field as keyof Textos);
          
          return (
            <motion.div
              key={field}
              variants={cardVariants}
              whileHover="hover"
              whileTap="tap"
              className="group"
            >
              <Card className="overflow-hidden backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 
                border border-gray-200 dark:border-gray-700 relative">
                <div className={`absolute inset-0 bg-gradient-to-br ${style?.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
                <CardHeader className="relative z-10">
                  <div className="flex items-center gap-3">
                    <motion.div
                      whileHover={{ rotate: 15 }}
                      className={`p-2 rounded-lg ${style?.bg} shadow-lg transition-colors duration-300`}
                    >
                      {field === 'texto_titulo' && <MessageCircle className={style?.icon} />}
                      {field === 'texto_info' && <Info className={style?.icon} />}
                      {field === 'texto_contas' && <CreditCard className={style?.icon} />}
                      {field === 'texto_suporte' && <LifeBuoy className={style?.icon} />}
                    </motion.div>
                    <CardTitle className="text-lg font-semibold">
                      {field.replace('texto_', '').charAt(0).toUpperCase() + field.replace('texto_', '').slice(1)}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{text}</p>
                  <Button
                    onClick={() => openDialog(field as keyof Textos)}
                    variant="outline"
                    className="w-full justify-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 group"
                  >
                    <Edit className="w-4 h-4 transition-transform group-hover:scale-110" />
                    <span>Editar</span>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Preview Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-8"
      >
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-white">
                <MessagesSquare className="w-5 h-5" />
                <h3 className="font-semibold">Vista Previa de Mensajes</h3>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={previewMode === 'chat' ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setPreviewMode('chat')}
                  className="text-white hover:text-white"
                >
                  <MessageCircle className="w-4 h-4 mr-1" />
                  Chat
                </Button>
                <Button
                  variant={previewMode === 'cards' ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setPreviewMode('cards')}
                  className="text-white hover:text-white"
                >
                  <LayoutGrid className="w-4 h-4 mr-1" />
                  Tarjetas
                </Button>
              </div>
            </div>
          </div>
          
          <AnimatePresence mode="wait">
            {previewMode === 'chat' ? (
              <motion.div
                key="chat"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4 p-6"
              >
                {Object.entries(textos).map(([field, text], index) => {
                  const style = getCardStyle(field as keyof Textos);
                  const time = new Date(Date.now() - (index * 2 * 60 * 1000))
                    .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  
                  return (
                    <motion.div
                      key={field}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-4 group"
                    >
                      <motion.div 
                        className={`p-3 rounded-full ${style?.bg} shadow-lg transition-all duration-300 flex-shrink-0`}
                        whileHover={{ scale: 1.1, rotate: 10 }}
                      >
                        {field === 'texto_titulo' && <MessageCircle className={style?.icon} size={24} />}
                        {field === 'texto_info' && <Info className={style?.icon} size={24} />}
                        {field === 'texto_contas' && <CreditCard className={style?.icon} size={24} />}
                        {field === 'texto_suporte' && <LifeBuoy className={style?.icon} size={24} />}
                      </motion.div>
                      <motion.div 
                        className="flex-1 space-y-2"
                        whileHover={{ scale: 1.01 }}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">
                            {field.replace('texto_', '').charAt(0).toUpperCase() + 
                              field.replace('texto_', '').slice(1)}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            <Clock size={12} />
                            {time}
                          </span>
                        </div>
                        <div className={`p-4 rounded-lg ${style?.bg} ${style?.border} border shadow-sm`}>
                          <p className="text-sm text-gray-700 dark:text-gray-200">{text}</p>
                        </div>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div
                key="cards"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6"
              >
                {Object.entries(textos).map(([field, text], index) => {
                  const style = getCardStyle(field as keyof Textos);
                  
                  return (
                    <motion.div
                      key={field}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className={`rounded-xl border ${style?.border} overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300`}
                    >
                      <div className={`p-4 ${style?.bg}`}>
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`p-2 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm`}>
                            {field === 'texto_titulo' && <MessageCircle className={style?.icon} size={20} />}
                            {field === 'texto_info' && <Info className={style?.icon} size={20} />}
                            {field === 'texto_contas' && <CreditCard className={style?.icon} size={20} />}
                            {field === 'texto_suporte' && <LifeBuoy className={style?.icon} size={20} />}
                          </div>
                          <h3 className="font-semibold">
                            {field.replace('texto_', '').charAt(0).toUpperCase() + 
                              field.replace('texto_', '').slice(1)}
                          </h3>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-200">{text}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Edit Dialog */}
      <Dialog open={!!editingField} onOpenChange={() => setEditingField('')}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Editar {editingField.replace('texto_', '').charAt(0).toUpperCase() + 
                editingField.replace('texto_', '').slice(1)}
            </DialogTitle>
            <DialogDescription>
              Modifica el contenido del mensaje seleccionado
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              value={tempText}
              onChange={handleChange}
              className="min-h-[150px] p-4 text-base resize-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              placeholder="Escribe el nuevo contenido..."
            />
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setEditingField('')}
              className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleDialogSave}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-90 transition-all duration-300"
            >
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}