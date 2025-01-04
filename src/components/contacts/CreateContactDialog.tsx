'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"

interface CreateContactDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onContactCreated: () => void
}

export function CreateContactDialog({ open, onOpenChange, onContactCreated }: CreateContactDialogProps) {
  const [contactName, setContactName] = useState('')
  const [contactNumber, setContactNumber] = useState('')
  const [contactPhoto, setContactPhoto] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          nome: contactName, 
          numero: contactNumber,
          foto: contactPhoto,
          saldo: 0,
          saldoadd: '0',
          bloqueado: 0,
          comprando: 0
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create contact')
      }

      toast({
        title: "Success",
        description: "Contact created successfully.",
      })
      onContactCreated()
      onOpenChange(false)
      setContactName('')
      setContactNumber('')
      setContactPhoto('')
    } catch (error) {
      console.error('Error creating contact:', error)
      toast({
        title: "Error",
        description: "Failed to create contact. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Contact</DialogTitle>
          <DialogDescription>
            Enter the details for the new contact.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="number" className="text-right">
                Number
              </Label>
              <Input
                id="number"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="photo" className="text-right">
                Photo URL
              </Label>
              <Input
                id="photo"
                value={contactPhoto}
                onChange={(e) => setContactPhoto(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Contact'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

