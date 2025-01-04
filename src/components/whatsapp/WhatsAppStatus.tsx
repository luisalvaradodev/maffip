'use client'

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Badge } from '@/components/ui/badge'; // Usamos Badge para el estado

export default function WhatsAppStatus() {
  const [status, setStatus] = useState('Desconectado');
  const [number, setNumber] = useState<string | null>(null);
  const [qrCodeData, setQRCodeData] = useState<string | null>(null);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/whatsapp/status');
      const data = await response.json();
      setStatus(data.status);
      setNumber(data.numero);

      if (data.status !== 'Conectado') {
        const qrResponse = await fetch('/api/whatsapp/qr-code');
        const qrData = await qrResponse.json();
        setQRCodeData(qrData.qrCode);
      } else {
        setQRCodeData(null);
      }
    } catch (error) {
      console.error('Erro ao buscar status:', error);
      setStatus('Erro');
    }
  };

  const deleteSession = async () => {
    try {
      await fetch('/api/whatsapp/delete-session', { method: 'POST' });
      await fetchStatus();
    } catch (error) {
      console.error('Erro ao deletar sessão:', error);
    }
  };

  const restartBot = async () => {
    try {
      await fetch('/api/whatsapp/restart', { method: 'POST' });
      await fetchStatus();
    } catch (error) {
      console.error('Erro ao reiniciar bot:', error);
    }
  };

  return (
    <Card className="shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 bg-white rounded-lg p-6">
      <CardHeader className="bg-gray-800 text-white rounded-t-lg p-4 shadow-md">
        <CardTitle className="flex items-center justify-center gap-3">
          <MessageSquare className="text-4xl text-green-500" />
          <span className="text-2xl font-semibold">CONEXÃO WHATSAPP</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <p className="text-lg font-semibold mb-2">Status:</p>
          <Badge
            variant={status === 'Conectado' ? 'success' : 'destructive'}
            className="text-xl font-bold py-2 px-4 transition-all duration-300 ease-in-out"
          >
            {status}
          </Badge>
          {number && (
            <p className="text-gray-700 text-lg mt-2 transition-all duration-300 ease-in-out hover:text-gray-900">
              Número: {number}
            </p>
          )}
        </div>
        {status !== 'Conectado' && (
          <div className="flex justify-center mt-4">
            {qrCodeData ? (
              <QRCodeSVG
                value={qrCodeData}
                size={220}
                className="rounded-lg shadow-xl hover:scale-105 transition-all duration-300 ease-in-out transform"
              />
            ) : (
              <p className="text-gray-600 text-lg animate-pulse">Carregando QR Code...</p>
            )}
          </div>
        )}
        <div className="flex justify-center gap-6 mt-6">
          <Button
            onClick={deleteSession}
            className="bg-red-600 hover:bg-red-500 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
          >
            DELETA SESSÃO
          </Button>
          <Button
            onClick={fetchStatus}
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
          >
            ATUALIZAR
          </Button>
          <Button
            onClick={restartBot}
            className="bg-green-600 hover:bg-green-500 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
          >
            REINICIAR BOT
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
