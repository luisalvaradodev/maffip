'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"


export function GiftManagement() {
  const [giftValue, setGiftValue] = useState('')
  const [giftCode, setGiftCode] = useState('')
  const [loading, setLoading] = useState(false)

  const handleCreateGift = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/gifts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          valor: parseFloat(giftValue),
          codigo: giftCode,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create gift')
      }

      toast({
        title: "Success",
        description: "Gift created successfully.",
      })
      setGiftValue('')
      setGiftCode('')
    } catch (error) {
      console.error('Error creating gift:', error)
      toast({
        title: "Error",
        description: "Failed to create gift. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gift Management</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCreateGift}>
          <div className="grid gap-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="giftValue" className="text-right">
                Gift Value
              </Label>
              <Input
                id="giftValue"
                type="number"
                value={giftValue}
                onChange={(e) => setGiftValue(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="giftCode" className="text-right">
                Gift Code
              </Label>
              <Input
                id="giftCode"
                value={giftCode}
                onChange={(e) => setGiftCode(e.target.value)}
                className="col-span-3"
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Gift'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

