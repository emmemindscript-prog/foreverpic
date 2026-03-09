'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Calendar, Mail, Download, Plus, Image as ImageIcon, Users } from 'lucide-react'
import GuestManager from '@/components/GuestManager'

interface Event {
  id: string
  title: string
  date: string
  hostEmail: string
  hostName: string | null
  qrCode: string
  password: string | null
  createdAt: string
}

interface Gallery {
  id: string
  name: string
  description: string | null
  type: string
  eventId: string
  createdAt: string
}

export default function EventDashboardPage() {
  const params = useParams()
  const eventId = params.id as string
  const [event, setEvent] = useState<Event | null>(null)
  const [galleries, setGalleries] = useState<Gallery[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newGalleryName, setNewGalleryName] = useState('')
  const [newGalleryDesc, setNewGalleryDesc] = useState('')
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    if (eventId) fetchEventData()
  }, [eventId])

  const fetchEventData = async () => {
    try {
      setLoading(true)
      setError(null)
      const eventRes = await fetch(`/api/events/${eventId}`)
      if (!eventRes.ok) {
        if (eventRes.status === 404) throw new Error('Evento non trovato')
        throw new Error('Errore nel caricamento evento')
      }
      const eventData = await eventRes.json()
      setEvent(eventData.event)
      const galleriesRes = await fetch(`/api/events/${eventId}/galleries`)
      if (galleriesRes.ok) {
        const galleriesData = await galleriesRes.json()
        setGalleries(galleriesData.galleries || [])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto')
    } finally {
      setLoading(false)
    }
  }

  const createGallery = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newGalleryName.trim()) return
    try {
      setCreating(true)
      const response = await fetch(`/api/events/${eventId}/galleries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newGalleryName,
          description: newGalleryDesc || null,
          type: 'custom'
        })
      })
      if (!response.ok) throw new Error('Errore nella creazione')
      const data = await response.json()
      setGalleries(prev => [...prev, data.gallery])
      setNewGalleryName('')
      setNewGalleryDesc('')
      setShowCreateForm(false)
    } catch (err) {
      alert('Errore nella creazione galleria')
    } finally {
      setCreating(false)
    }
  }

  const downloadQR = () => {
    if (!event) return
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
    const qrCodeUrl = `${baseUrl}/scan/${event.qrCode}`
    const qrDownloadUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(qrCodeUrl)}`
    window.open(qrDownloadUrl, '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Caricamento evento...</p>
        </Card>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md p-8 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Errore</h2>
          <p className="text-gray-600 mb-6">{error || 'Evento non trovato'}</p>
          <Link href="/">
            <Button>Torna alla Home</Button>
          </Link>
        </Card>
      </div>
    )
  }

  const eventDate = new Date(event.date).toLocaleDateString('it-IT', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
  const qrCodeUrl = `${baseUrl}/scan/${event.qrCode}`

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" /> Torna alla home
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="p-6">
              <h1 className="text-2xl font-bold mb-2">{event.title}</h1>
              <div className="space-y-3 text-gray-600">
                <p className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-600" /> {eventDate}
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-purple-600" /> {event.hostEmail}
                </p>
              </div>
            </Card>
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">🎟️ QR Code Evento</h2>
              <p className="text-sm text-gray-600 mb-4">
                Gli ospiti scansionano questo QR per caricare foto
              </p>
              <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300 mb-4">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrCodeUrl)}`}
                  alt="QR Code"
                  className="w-full max-w-[200px] mx-auto"
                />
              </div>
              <Button variant="outline" className="w-full" onClick={downloadQR}>
                <Download className="w-4 h-4 mr-2" /> Scarica QR
              </Button>
            </Card>
          </div>

          {/* Main */}
          <div className="lg:col-span-2 space-y-8">
            {/* Galleries */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">📸 Gallerie</h2>
                <Button onClick={() => setShowCreateForm(!showCreateForm)}>
                  <Plus className="w-4 h-4 mr-2" /> {showCreateForm ? 'Annulla' : 'Nuova Galleria'}
                </Button>
              </div>
              {showCreateForm && (
                <Card className="p-6 mb-6">
                  <h3 className="font-semibold mb-4">Crea Nuova Galleria</h3>
                  <form onSubmit={createGallery} className="space-y-4">
                    <Input
                      placeholder="Nome galleria"
                      value={newGalleryName}
                      onChange={(e) => setNewGalleryName(e.target.value)}
                      required
                    />
                    <Input
                      placeholder="Descrizione (opzionale)"
                      value={newGalleryDesc}
                      onChange={(e) => setNewGalleryDesc(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <Button type="submit" disabled={creating}>
                        {creating ? 'Creazione...' : 'Crea Galleria'}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                        Annulla
                      </Button>
                    </div>
                  </form>
                </Card>
              )}

              {/* Gallery Grid */}
              <div className="grid md:grid-cols-2 gap-4">
                {galleries.length === 0 ? (
                  <Card className="p-8 text-center md:col-span-2">
                    <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">Nessuna galleria</h3>
                    <p className="text-gray-600">Crea la prima galleria per iniziare a raccogliere foto</p>
                  </Card>
                ) : (
                  galleries.map((g) => (
                    <Link key={g.id} href={`/galleries/${g.id}`}>
                      <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                        <h3 className="font-semibold text-lg mb-2">{g.name}</h3>
                        {g.description && (
                          <p className="text-gray-600 text-sm mb-3">{g.description}</p>
                        )}
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(g.createdAt).toLocaleDateString('it-IT')}
                        </div>
                      </Card>
                    </Link>
                  ))
                )}
              </div>
            </div>

            {/* Guest Manager Section */}
            <div className="border-t pt-8 mt-8">
              <div className="flex items-center gap-2 mb-6">
                <Users className="w-6 h-6 text-purple-600" />
                <h2 className="text-2xl font-bold">👥 Gestione Ospiti</h2>
              </div>
              <GuestManager eventId={eventId} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}