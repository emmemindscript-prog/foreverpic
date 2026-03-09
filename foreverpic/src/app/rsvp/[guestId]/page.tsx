'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CheckCircle2, XCircle, Calendar, MapPin, Users, Loader2 } from 'lucide-react'

interface GuestData {
  guest: {
    id: string
    name: string
    email: string
    status: string
    event: {
      id: string
      title: string
      date: string
      hostEmail: string
      hostName: string | null
    }
  }
}

export default function RSVPPage() {
  const params = useParams()
  const guestId = params.guestId as string
  
  const [data, setData] = useState<GuestData | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [response, setResponse] = useState<'confirmed' | 'declined' | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (guestId) {
      fetchGuestData()
    }
  }, [guestId])

  const fetchGuestData = async () => {
    try {
      const res = await fetch(`/api/guests/${guestId}/rsvp`)
      if (res.ok) {
        const data = await res.json()
        setData(data)
        setResponse(data.guest.status as 'confirmed' | 'declined' | null)
      } else {
        setError('Link RSVP non valido o scaduto')
      }
    } catch (err) {
      setError('Errore nel caricamento')
    } finally {
      setLoading(false)
    }
  }

  const submitRSVP = async (status: 'confirmed' | 'declined') => {
    setSubmitting(true)
    try {
      const res = await fetch(`/api/guests/${guestId}/rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      
      if (res.ok) {
        setResponse(status)
      } else {
        setError('Errore nell\'invio RSVP')
      }
    } catch {
      setError('Errore di connessione')
    }
    setSubmitting(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
        <Card className="p-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-slate-600">Caricamento...</p>
        </Card>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 p-4">
        <Card className="max-w-md p-8 text-center">
          <XCircle className="w-16 h-16 mx-auto mb-4 text-rose-500" />
          <h1 className="text-xl font-bold text-slate-900 mb-2">Link non valido</h1>
          <p className="text-slate-600">{error || 'Impossibile caricare i dati RSVP'}</p>
        </Card>
      </div>
    )
  }

  const { guest } = data
  const eventDate = new Date(guest.event.date).toLocaleDateString('it-IT', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  // RSVP già risposto
  if (response === 'confirmed') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-green-50 p-4">
        <Card className="max-w-md p-8 text-center">
          <CheckCircle2 className="w-20 h-20 mx-auto mb-4 text-emerald-500" />
          <h1 className="text-2xl font-bold text-emerald-900 mb-2">Grande! 🎉</h1>
          <p className="text-emerald-700 mb-4">
            Grazie {guest.name}, la tua partecipazione è confermata!
          </p>
          <div className="bg-emerald-100 rounded-lg p-4 text-left">
            <p className="font-semibold text-emerald-900">{guest.event.title}</p>
            <p className="text-emerald-700 text-sm flex items-center gap-2 mt-1">
              <Calendar className="w-4 h-4" />
              {eventDate}
            </p>
          </div>
        </Card>
      </div>
    )
  }

  if (response === 'declined') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-50 p-4">
        <Card className="max-w-md p-8 text-center">
          <p className="text-lg text-slate-700 mb-4">
            Grazie per averci informato, {guest.name}.
          </p>
          <p className="text-slate-500">
            Ci dispiace che non potrai partecipare.
          </p>
        </Card>
      </div>
    )
  }

  // Form RSVP
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <Card className="max-w-lg w-full p-8">
        <div className="text-center mb-8">
          <Users className="w-12 h-12 mx-auto mb-4 text-purple-600" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Sei invitato! 🎉
          </h1>
          <p className="text-slate-600">
            Ciao {guest.name}, conferma la tua presenza
          </p>
        </div>

        <div className="bg-purple-50 rounded-lg p-4 mb-8">
          <h2 className="font-semibold text-purple-900 text-lg mb-2">
            {guest.event.title}
          </h2>
          <div className="space-y-2 text-purple-700">
            <p className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {eventDate}
            </p>
            <p className="text-sm">
              Organizzato da {guest.event.hostName || guest.event.hostEmail}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button
            size="lg"
            className="h-14 bg-emerald-600 hover:bg-emerald-700"
            onClick={() => submitRSVP('confirmed')}
            disabled={submitting}
          >
            {submitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Confermo ✅
              </>
            )}
          </Button>
          
          <Button
            size="lg"
            variant="outline"
            className="h-14 border-rose-300 text-rose-600 hover:bg-rose-50"
            onClick={() => submitRSVP('declined')}
            disabled={submitting}
          >
            {submitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <XCircle className="w-5 h-5 mr-2" />
                Non posso ❌
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  )
}