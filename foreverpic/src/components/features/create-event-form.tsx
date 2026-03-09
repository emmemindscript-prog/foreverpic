'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Card, CardHeader } from '../ui/card'

export default function CreateEventForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    hostEmail: '',
    hostName: '',
    password: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create event')
      }

      // Redirect to event page
      router.push(`/events/${data.event.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader
        title="Crea il Tuo Evento"
        description="Condividi foto e video con un semplice QR code"
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Titolo Evento"
          placeholder="Il matrimonio di Maria e Giovanni"
          value={formData.title}
          onChange={(e) =>
            setFormData({ ...formData, title: e.target.value })
          }
          required
        />

        <Input
          label="Data"
          type="date"
          value={formData.date}
          onChange={(e) =>
            setFormData({ ...formData, date: e.target.value })
          }
          required
        />

        <Input
          label="La Tua Email"
          type="email"
          placeholder="maria@example.com"
          value={formData.hostEmail}
          onChange={(e) =>
            setFormData({ ...formData, hostEmail: e.target.value })
          }
          required
        />

        <Input
          label="Il Tuo Nome"
          placeholder="Maria Rossi"
          value={formData.hostName}
          onChange={(e) =>
            setFormData({ ...formData, hostName: e.target.value })
          }
        />

        <Input
          label="Password (opzionale)"
          type="password"
          placeholder="Per proteggere la galleria"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          
        />

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <Button type="submit" disabled={loading} size="lg" className="w-full">
          {loading ? 'Creando...' : 'Crea Evento 🎉'}
        </Button>
      </form>
    </Card>
  )
}
