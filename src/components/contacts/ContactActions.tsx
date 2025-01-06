import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { MoreHorizontal, Send, Gift, CheckSquare, Square } from 'lucide-react'
import { ConfirmDialog } from "@/components/ui/confirm-dialog"

interface Contact {
  id: number
  numero: string
  nome: string
  foto: string
  mainid: number
  saldo: number | null
  saldoadd: string
  bloqueado: number
  comprando: number
}

interface ContactActionsProps {
  contact?: Contact
  contactCount?: number
  onRefresh: () => void
  selectedContacts: number[]
  setSelectedContacts: (ids: number[]) => void
}

export function ContactActions({ contact, contactCount, onRefresh, selectedContacts, setSelectedContacts }: ContactActionsProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const { toast } = useToast()

  const handleToggleBlock = async () => {
    if (!contact) return

    try {
      const response = await fetch(`/api/contacts/${contact.id}/toggle-block`, {
        method: 'PUT',
      })

      if (!response.ok) {
        throw new Error('Failed to toggle block status')
      }

      toast({
        title: "Contact Updated",
        description: `Contact ${contact.nome} has been ${contact.bloqueado === 1 ? 'unblocked' : 'blocked'}.`,
      })

      onRefresh()
    } catch (error) {
      console.error('Error toggling block status:', error)
      toast({
        title: "Error",
        description: "Failed to update contact status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteContact = async () => {
    if (!contact) return

    try {
      const response = await fetch(`/api/contacts/${contact.id}`, { method: 'DELETE' })
      if (!response.ok) {
        throw new Error('Failed to delete contact')
      }
      toast({
        title: "Contact Deleted",
        description: `Contact ${contact.nome} has been deleted.`,
      })
      onRefresh()
    } catch (error) {
      console.error('Error deleting contact:', error)
      toast({
        title: "Error",
        description: "Failed to delete contact. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleMassMessage = () => {
    toast({
      title: "Mass Message",
      description: `Preparing to send message to ${selectedContacts.length} contacts`,
    })
  }

  const handleCreateGift = () => {
    toast({
      title: "Create Gift",
      description: `Preparing to create gift for ${selectedContacts.length} contacts`,
    })
  }

  const handleSelectAll = () => {
    if (selectedContacts.length === contactCount) {
      setSelectedContacts([])
    } else {
      setSelectedContacts(Array.from({ length: contactCount || 0 }, (_, i) => i + 1))
    }
  }

  if (contact) {
    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={handleToggleBlock}>
              {contact.bloqueado === 1 ? "Unblock" : "Block"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)} className="text-red-600">
              Delete Contact
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <ConfirmDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDeleteContact}
          title="Delete Contact"
          description={`Are you sure you want to delete ${contact.nome}? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
        />
      </>
    )
  }

  return (
    <div className="flex items-center space-x-2">
      <Button onClick={handleMassMessage} disabled={selectedContacts.length === 0}>
        <Send className="mr-2 h-4 w-4" />
        Disparar
      </Button>
      <Button onClick={handleCreateGift} disabled={selectedContacts.length === 0}>
        <Gift className="mr-2 h-4 w-4" />
        Criar gift
      </Button>
      <Button variant="outline" onClick={handleSelectAll}>
        {selectedContacts.length === contactCount ? (
          <>
            <Square className="mr-2 h-4 w-4" />
            Desmarcar tudo
          </>
        ) : (
          <>
            <CheckSquare className="mr-2 h-4 w-4" />
            Selecionar tudo
          </>
        )}
      </Button>
    </div>
  )
}

