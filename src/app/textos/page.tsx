'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Loader2, Save, Edit, Info, CreditCard, LifeBuoy, User } from 'lucide-react';
import {
  Dialog,
  DialogTrigger,
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

export default function TextosPage() {
  const [loading, setLoading] = useState(false);
  const [textos, setTextos] = useState<Textos>({
    texto_titulo: 'Bienvenido a nuestro servicio.',
    texto_info: 'Aquí encontrarás información útil.',
    texto_contas: 'Puedes gestionar tus cuentas aquí.',
    texto_suporte: '¿Necesitas ayuda? Contacta con soporte.',
  });
  const [editingField, setEditingField] = useState<keyof Textos | ''>('');

  useEffect(() => {
    fetchTextos();
  }, []);

  const fetchTextos = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/textos');
      const data = await response.json();
      setTextos(data[0] || textos);
    } catch (error) {
      console.error('Error fetching textos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (validateInputs()) {
        setLoading(true);
        const response = await fetch('/api/textos', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(textos),
        });
        if (response.ok) {
          toast({
            title: 'Texto actualizado',
            description: 'Se han guardado los cambios correctamente.',
          });
        } else {
          toast({
            title: 'Error',
            description: 'Hubo un problema al guardar los textos.',
            variant: 'destructive',
          });
        }
      } else {
        toast({
          title: 'Campos vacíos',
          description: 'Por favor, complete todos los campos.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error saving textos:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateInputs = () => {
    return (
      textos.texto_titulo !== '' &&
      textos.texto_info !== '' &&
      textos.texto_contas !== '' &&
      textos.texto_suporte !== ''
    );
  };

  const openDialog = (field: keyof Textos) => {
    setEditingField(field);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (editingField) {
      setTextos({
        ...textos,
        [editingField]: e.target.value,
      });
    }
  };

  return (
    <div className="container mx-auto px-6 py-10 bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 rounded-2xl shadow-xl max-w-4xl">
      {/* Cards distribuidas en 2 columnas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
        {[
          { field: 'texto_titulo', label: 'Título', icon: <Edit className="mr-2 text-lg" /> },
          { field: 'texto_info', label: 'Información', icon: <Info className="mr-2 text-lg" /> },
          { field: 'texto_contas', label: 'Cuentas', icon: <CreditCard className="mr-2 text-lg" /> },
          { field: 'texto_suporte', label: 'Soporte', icon: <LifeBuoy className="mr-2 text-lg" /> },
        ].map(({ field, label, icon }) => (
          <Card
            key={field}
            className="shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <CardHeader>
              <div className="flex items-center">
                {icon}
                <CardTitle className="text-lg font-semibold text-gray-800 hover:text-blue-600">
                  {label}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => openDialog(field as keyof Textos)}
                className="text-sm px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-500 transition-colors"
              >
                Editar
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Vista previa estilo WhatsApp */}
      <div className="bg-gray-50 rounded-lg shadow-xl p-6 border border-gray-200">
        <div className="bg-green-500 text-white p-3 rounded-t-lg font-bold text-lg">Vista previa de chat</div>
        <div className="h-auto max-h-96 overflow-y-auto p-4 space-y-6">
          {[
            {
              user: 'Sistema',
              text: textos.texto_titulo,
              timestamp: '10:15 AM',
              avatar: <User className="text-green-500 w-6 h-6" />,
            },
            {
              user: 'Información',
              text: textos.texto_info,
              timestamp: '10:17 AM',
              avatar: <Info className="text-blue-500 w-6 h-6" />,
            },
            {
              user: 'Cuentas',
              text: textos.texto_contas,
              timestamp: '10:20 AM',
              avatar: <CreditCard className="text-indigo-500 w-6 h-6" />,
            },
            {
              user: 'Soporte',
              text: textos.texto_suporte,
              timestamp: '10:25 AM',
              avatar: <LifeBuoy className="text-red-500 w-6 h-6" />,
            },
          ].map(({ user, text, timestamp, avatar }, index) => (
            <div
              key={index}
              className="flex items-start space-x-4 bg-white rounded-lg shadow-md p-4 border border-gray-300 hover:shadow-lg transition-shadow"
            >
              <div>{avatar}</div>
              <div>
                <div className="text-sm font-bold text-gray-800">{user}</div>
                <p className="text-sm text-gray-700">{text}</p>
                <span className="text-xs text-gray-500">{timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center space-x-6 mt-10">
        <Button
          onClick={handleSave}
          disabled={loading}
          className="bg-black hover:bg-gray-800 text-white py-3 px-6 rounded-md shadow-lg transition-all duration-300 text-base flex items-center"
        >
          {loading ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" />}
          Guardar Cambios
        </Button>
      </div>

      {/* Dialog para editar textos */}
      <Dialog open={!!editingField} onOpenChange={() => setEditingField('')}>
        <DialogTrigger />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar {editingField}</DialogTitle>
            <DialogDescription>Modifica el texto de la sección seleccionada.</DialogDescription>
          </DialogHeader>
          <Textarea
            value={editingField ? textos[editingField] : ''}
            onChange={handleChange}
            placeholder={`Escribe el texto para ${editingField}...`}
            className="w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm transition-all duration-300 hover:border-gray-400 focus:outline-none"
            style={{
              height: `${editingField ? textos[editingField].split('\n').length * 24 : 48}px`,
            }}
          />
          <DialogFooter>
            <Button
              onClick={() => setEditingField('')}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-md transition-colors"
            >
              Cerrar
            </Button>
            <Button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded-md transition-colors"
            >
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
