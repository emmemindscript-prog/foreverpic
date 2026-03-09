'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { 
  Users, 
  Mail, 
  Phone, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  Clock,
  Send
} from 'lucide-react'

interface Guest {
  id: string
  name: string | null
  email: string
  phone: string | null
  rsvpStatus: 'pending' | 'confirmed' | 'declined'
  createdAt: string
}

interface GuestStats {
  total: number
  confirmed: number
  declined: number
  pending: number
}

interface GuestManagerProps {
  eventId: string
}

export default function GuestManager({ eventId }: GuestManagerProps) {
  const [guests, setGuests] = useState<Guest[]>([])
  const [stats, setStats] = useState<GuestStats>({ total: 0, confirmed: 0, declined: 0, pending: 0 })
  const [loading, setLoading] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newGuest, setNewGuest] = useState({ name: '', email: '', phone: '' })
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'declined' | 'pending'>('all')

  useEffect(() => {
    fetchGuests()
  }, [eventId])

  const fetchGuests = async () => {
    try {
      const res = await fetch(`/api/events/${eventId}/guests`)
      if (res.ok) {
        const data = await res.json()
        setGuests(data.guests)
        setStats(data.stats)
      }
    } catch (err) {
      console.error('Errore caricamento ospiti:', err)
    }
  }

  const addGuest = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newGuest.name || !newGuest.email) return

    setLoading(true)
    try {
      const res = await fetch(`/api/events/${eventId}/guests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newGuest)
      })
      
      if (res.ok) {
        await fetchGuests()
        setNewGuest({ name: '', email: '', phone: '' })
        setShowAddForm(false)
      }
    } catch (err) {
      console.error('Errore aggiunta ospite:', err)
    }
    setLoading(false)
  }

  const deleteGuest = async (guestId: string) => {
    if (!confirm('Eliminare questo ospite?')) return
    
    try {
      const res = await fetch(`/api/guests/${guestId}`, { method: 'DELETE' })
      if (res.ok) await fetchGuests()
    } catch (err) {
      console.error('Errore eliminazione:', err)
    }
  }

  const updateRSVP = async (guestId: string, status: 'confirmed' | 'declined' | 'pending') => {
    try {
      const res = await fetch(`/api/guests/${guestId}/rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      if (res.ok) await fetchGuests()
    } catch (err) {
      console.error('Errore aggiornamento RSVP:', err)
    }
  }

  const sendInvites = async () => {
    // Placeholder per invio email - da implementare con servizio email
    alert('Invito email da implementare con SendGrid/AWS SES')
  }

  const filteredGuests = guests.filter(g => 
    filter === 'all' || g.rsvpStatus === filter
  )

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />
      case 'declined': return <XCircle className="w-4 h-4 text-rose-500" />
      default: return <Clock className="w-4 h-4 text-amber-500" />
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confermato'
      case 'declined': return 'Rifiutato'
      default: return 'In attesa'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-emerald-600 bg-emerald-50'
      case 'declined': return 'text-rose-600 bg-rose-50'
      default: return 'text-amber-600 bg-amber-50'
    }
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <Users className="w-5 h-5 mx-auto mb-2 text-slate-600" />
          <div className="text-2xl font-bold">{stats.total}</div>
          <div className="text-xs text-slate-500 uppercase">Totale</div>
        </Card>
        <Card className="p-4 text-center">
          <CheckCircle2 className="w-5 h-5 mx-auto mb-2 text-emerald-500" />
          <div className="text-2xl font-bold text-emerald-600">{stats.confirmed}</div>
          <div className="text-xs text-emerald-600 uppercase">Confermati</div>
        </Card>
        <Card className="p-4 text-center">
          <Clock className="w-5 h-5 mx-auto mb-2 text-amber-500" />
          <div className="text-2xl font-bold text-amber-600">{stats.pending}</div>
          <div className="text-xs text-amber-600 uppercase">In attesa</div>
        </Card>
        <Card className="p-4 text-center">
          <XCircle className="w-5 h-5 mx-auto mb-2 text-rose-500" />
          <div className="text-2xl font-bold text-rose-600">{stats.declined}</div>
          <div className="text-xs text-rose-600 uppercase">Rifiutati</div>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          {(['all', 'confirmed', 'pending', 'declined'] as const).map((f) => (
            <Button
              key={f}
              variant={filter === f ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? 'Tutti' : 
               f === 'confirmed' ? 'Confermati' : 
               f === 'declined' ? 'Rifiutati' : 'In attesa'}
            </Button>
          ))}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={sendInvites}>
            <Send className="w-4 h-4 mr-2" />
            Invia Inviti
          </Button>
          <Button size="sm" onClick={() => setShowAddForm(!showAddForm)}>
            <Plus className="w-4 h-4 mr-2" />
            Aggiungi Ospite
          </Button>
        </div>
      </div>

      {/* Add Guest Form */}
      {showAddForm && (
        <Card className="p-4">
          <form onSubmit={addGuest} className="grid md:grid-cols-4 gap-3">
            <Input
              placeholder="Nome completo *"
              value={newGuest.name}
              onChange={(e) => setNewGuest({ ...newGuest, name: e.target.value })}
              required
            />
            <Input
              type="email"
              placeholder="Email *"
              value={newGuest.email}
              onChange={(e) => setNewGuest({ ...newGuest, email: e.target.value })}
              required
            />
            <Input
              placeholder="Telefono"
              value={newGuest.phone}
              onChange={(e) => setNewGuest({ ...newGuest, phone: e.target.value })}
            />
            <div className="flex gap-2">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Aggiunta...' : 'Aggiungi'}
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Annulla
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Guests List */}
      <div className="space-y-2">
        {filteredGuests.length === 0 ? (
          <Card className="p-8 text-center text-slate-500">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>Nessun ospite {filter !== 'all' && `con stato "${getStatusLabel(filter)}"`}</p>
          </Card>
        ) : (
          filteredGuests.map((guest) => (
            <Card key={guest.id} className="p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 ${getStatusColor(guest.rsvpStatus)}`}>
                    {getStatusIcon(guest.rsvpStatus)}
                    {getStatusLabel(guest.rsvpStatus)}
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium text-slate-900 truncate">
                      {guest.name || 'Senza nome'}
                    </div>
                    <div className="text-sm text-slate-500 truncate flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {guest.email}
                      </span>
                      {guest.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {guest.phone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {/* Quick RSVP actions */}
                  {guest.rsvpStatus !== 'confirmed' && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                      onClick={() => updateRSVP(guest.id, 'confirmed')}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </Button>
                  )}
                  {guest.rsvpStatus !== 'declined' && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                      onClick={() => updateRSVP(guest.id, 'declined')}
                    >
                      <XCircle className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-slate-400 hover:text-rose-500"
                    onClick={() => deleteGuest(guest.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
