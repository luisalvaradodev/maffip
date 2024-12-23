// components/qr-code-dialog.tsx
'use client'

import { QRCodeSVG } from 'qrcode.react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

interface QRCodeDialogProps {
  isOpen: boolean
  onClose: () => void
  qrCodeUrl: string
  className?: string
}

export function QRCodeDialog({ isOpen, onClose, qrCodeUrl, className }: QRCodeDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn('sm:max-w-md', className)}>
        <DialogHeader>
          <DialogTitle>Scan QR Code</DialogTitle>
          <DialogDescription>
            Scan this QR code with WhatsApp to connect your instance
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center p-6">
          <div className="rounded-lg overflow-hidden shadow-lg p-4 bg-white">
            <QRCodeSVG
              value={qrCodeUrl}
              size={256}
              level="H"
              className="w-full h-full"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}