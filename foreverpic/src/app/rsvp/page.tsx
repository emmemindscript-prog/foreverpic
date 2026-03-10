'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Head from 'next/head'

interface EventData {
  id: string
  title: string
  date: string
  hostName?: string
  hostEmail: string
}

interface GuestData {
  id: string
  name?: string
  email?: string
}

function RSVPContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const eventId = searchParams.get('eventId')

  const [step, setStep] = useState<'loading' | 'form' | 'success' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [eventData, setEventData] = useState<EventData | null>(null)
  const [guestData, setGuestData] = useState<GuestData | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    attending: true,
    plusOnes: 0,
    dietaryRequirements: '',
    notes: ''
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (token) {
      fetchRSVPByToken()
    } else if (eventId) {
      setStep('form')
      fetchEventData(eventId)
    } else {
      setErrorMessage("Link RSVP non valido. Manca il token o l'ID evento.")
      setStep('error')
    }
  }, [token, eventId])

  const fetchRSVPByToken = async () => {
    try {
      const res = await fetch(`/api/rsvp?token=${token}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Errore nel caricamento')
      setEventData(data.rsvp.event)
      setGuestData(data.rsvp.guest)
      setFormData(prev => ({
        ...prev,
        name: data.rsvp.guest?.name || '',
        email: data.rsvp.guest?.email || ''
      }))
      setStep('form')
    } catch (err: any) {
      setErrorMessage(err.message)
      setStep('error')
    }
  }

  const fetchEventData = async (id: string) => {
    try {
      const res = await fetch(`/api/events/${id}`)
      const data = await res.json()
      if (res.ok) setEventData(data.event)
    } catch (err) {
      console.error('Errore caricamento evento:', err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: eventId || eventData?.id,
          guestId: guestData?.id,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          attending: formData.attending,
          plusOnes: formData.plusOnes,
          dietaryRequirements: formData.dietaryRequirements,
          notes: formData.notes
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Errore durante l'invio")
      setStep('success')
    } catch (err: any) {
      setErrorMessage(err.message)
      setStep('error')
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('it-IT', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    })
  }

  if (step === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-800 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-md w-full">
          <div className="text-5xl mb-4 animate-bounce">⏳</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Caricamento...</h1>
          <div className="flex justify-center mt-6">
            <div className="animate-spin h-8 w-8 border-4 border-purple-600 border-t-transparent rounded-full"></div>
          </div>
        </div>
      </div>
    )
  }

  if (step === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-500 via-orange-500 to-pink-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-md w-full">
          <div className="text-5xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Errore</h1>
          <p className="text-gray-600 mt-4">{errorMessage}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full font-medium hover:opacity-90 transition"
          >
            Riprova
          </button>
        </div>
      </div>
    )
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 flex items-center justify-center p-4">
        <Head><title>RSVP Confermato | ForeverPic</title></Head>
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-md w-full">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">RSVP Confermato!</h1>
          <p className="text-gray-600 mt-4">Grazie per aver confermato la tua partecipazione!</p>
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className={formData.attending ? 'text-green-700 font-medium' : 'text-gray-600'}>
              {formData.attending ? "🎉 Ci vediamo all'evento!" : "😔 Ci dispiace che non potrai partecipare"}
            </p>
            {formData.attending && formData.plusOnes > 0 && (
              <p className="text-green-600 text-sm mt-1">+ {formData.plusOnes} accompagnatore/i</p>
            )}
          </div>
          <p className="text-sm text-gray-400 mt-6">Hai ricevuto una conferma via email</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-800 py-12 px-4">
      <Head><title>RSVP | {eventData?.title || 'Evento'}</title></Head>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-6 text-white">
          <div className="text-4xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold mb-2">{eventData?.title || 'Conferma Partecipazione'}</h1>
          {eventData && (
            <div className="space-y-1 text-white/80">
              <p className="flex items-center gap-2"><span>📅</span>{formatDate(eventData.date)}</p>
              {eventData.hostName && <p className="flex items-center gap-2"><span>👤</span>Organizzato da: {eventData.hostName}</p>}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3 text-center">Confermi la tua partecipazione?</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, attending: true }))}
                  className={`p-4 rounded-xl border-2 text-center transition-all ${
                    formData.attending ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="text-2xl mb-2">🎉</div>
                  <div className="font-medium">Sì, ci sarò!</div>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, attending: false }))}
                  className={`p-4 rounded-xl border-2 text-center transition-all ${
                    !formData.attending ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="text-2xl mb-2">😔</div>
                  <div className="font-medium">Non posso partecipare</div>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome completo *</label>
                <input
                  required
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  placeholder="Mario Rossi"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  placeholder="mario@email.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Telefono</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  placeholder="+39 123 456 7890"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Accompagnatori</label>
                <select
                  value={formData.plusOnes}
                  onChange={e => setFormData(prev => ({ ...prev, plusOnes: parseInt(e.target.value) }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                >
                  <option value={0}>Solo</option>
                  <option value={1}>1 accompagnatore</option>
                  <option value={2}>2 accompagnatori</option>
                  <option value={3}>3 accompagnatori</option>
                  <option value={4}>4+ accompagnatori</option>
                </select>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={submitting || !formData.name || !formData.email}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 disabled:opacity-50 text-white font-medium py-4 px-6 rounded-xl hover:opacity-90 transition-opacity"
              >
                {submitting ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-3"></div>
                    Invio in corso...
                  </span>
                ) : formData.attending ? (
                  'Conferma Partecipazione'
                ) : (
                  'Invia Risposta'
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="text-center text-white/80 text-sm mt-8">
          <p>Hai domande? Scrivi a {eventData?.hostEmail || 'host@foreverpic.it'}</p>
        </div>
      </div>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-800 flex items-center justify-center">
      <div className="text-center text-white">
        <div className="animate-spin h-8 w-8 border-2 border-white border-t-transparent rounded-full mb-4 mx-auto"></div>
        Caricamento RSVP...
      </div>
    </div>
  )
}

export default function RSVPPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <RSVPContent />
    </Suspense>
  )
}