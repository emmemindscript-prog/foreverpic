'use client'

import { useState, useEffect, useCallback } from 'react'
import { MessageSquare, Mic, Video, Text, X, Send } from 'lucide-react'
import { AudioRecorder } from './AudioRecorder'
import { VideoRecorder } from './VideoRecorder'
import { MediaPlayer } from './MediaPlayer'

interface Guest {
  id: string
  name: string | null
  email: string | null
}

interface GuestbookMessage {
  id: string
  type: 'text' | 'audio' | 'video'
  content: string
  url: string | null
  createdAt: string
  guest: Guest
}

interface GuestbookManagerProps {
  eventId: string
  guestId?: string // Optional - if guest is already identified
  guestName?: string
  guestEmail?: string
}

export function GuestbookManager({ eventId, guestId, guestName, guestEmail }: GuestbookManagerProps) {
  const [messages, setMessages] = useState<GuestbookMessage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeMode, setActiveMode] = useState<'none' | 'text' | 'audio' | 'video'>('none')
  const [textMessage, setTextMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentGuestId, setCurrentGuestId] = useState<string | null>(guestId || null)

  // Fetch existing messages
  const fetchMessages = useCallback(async () => {
    try {
      const response = await fetch(`/api/guestbook?eventId=${eventId}`)
      if (!response.ok) throw new Error('Failed to fetch messages')
      const data = await response.json()
      setMessages(data.messages || [])
    } catch (err) {
      setError('Errore nel caricamento dei messaggi')
    } finally {
      setIsLoading(false)
    }
  }, [eventId])

  useEffect(() => {
    fetchMessages()
  }, [fetchMessages])

  // Create guest if needed
  const ensureGuest = async (): Promise<string | null> => {
    if (currentGuestId) return currentGuestId
    
    if (!guestName) {
      setError('Nome richiesto per lasciare un messaggio')
      return null
    }

    try {
      const response = await fetch('/api/guests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId,
          name: guestName,
          email: guestEmail
        })
      })
      
      if (!response.ok) throw new Error('Failed to create guest')
      const data = await response.json()
      setCurrentGuestId(data.guest.id)
      return data.guest.id
    } catch (err) {
      setError('Errore nella creazione del profilo ospite')
      return null
    }
  }

  // Submit text message
  const submitTextMessage = async () => {
    if (!textMessage.trim()) return
    
    const guest = await ensureGuest()
    if (!guest) return

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestId: guest,
          eventId,
          type: 'text',
          content: textMessage.trim()
        })
      })

      if (!response.ok) throw new Error('Failed to send message')
      
      setTextMessage('')
      setActiveMode('none')
      fetchMessages()
    } catch (err) {
      setError('Errore nell\'invio del messaggio')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Submit audio/video with upload
  const submitMediaMessage = async (
    blob: Blob, 
    type: 'audio' | 'video', 
    duration: number,
    thumbnailUrl?: string
  ) => {
    const guest = await ensureGuest()
    if (!guest) return

    setIsSubmitting(true)
    try {
      // Upload file to storage
      const formData = new FormData()
      formData.append('file', blob, `${type}-${Date.now()}.webm`)
      formData.append('eventId', eventId)
      
      const uploadRes = await fetch(`/api/upload`, {
        method: 'POST',
        body: formData
      })
      
      if (!uploadRes.ok) throw new Error('Upload failed')
      const uploadData = await uploadRes.json()

      // Create guestbook message
      const response = await fetch('/api/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestId: guest,
          eventId,
          type,
          content: `${type} message (${Math.round(duration)}s)`,
          url: uploadData.url,
          thumbnailUrl: thumbnailUrl || null
        })
      })

      if (!response.ok) throw new Error('Failed to create message')
      
      setActiveMode('none')
      fetchMessages()
    } catch (err) {
      setError('Errore nel salvataggio del messaggio')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Message type icon
  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'audio': return <Mic className="w-4 h-4" />
      case 'video': return <Video className="w-4 h-4" />
      default: return <Text className="w-4 h-4" />
    }
  }

  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
          <MessageSquare className="w-6 h-6 text-purple-600" />
          Guestbook
        </h2>
        <p className="text-gray-500 mt-1">Lascia un messaggio per gli sposi</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Mode Selection */}
      {activeMode === 'none' && (
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => setActiveMode('text')}
            className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-100 transition-all"
          >
            <Text className="w-6 h-6 text-gray-600" />
            <span className="text-sm text-gray-600">Testo</span>
          </button>
          <button
            onClick={() => setActiveMode('audio')}
            className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-100 transition-all"
          >
            <Mic className="w-6 h-6 text-purple-600" />
            <span className="text-sm text-gray-600">Audio</span>
          </button>
          <button
            onClick={() => setActiveMode('video')}
            className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-100 transition-all"
          >
            <Video className="w-6 h-6 text-blue-600" />
            <span className="text-sm text-gray-600">Video</span>
          </button>
        </div>
      )}

      {/* Text Mode */}
      {activeMode === 'text' && (
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">Messaggio di testo</h3>
            <button onClick={() => setActiveMode('none')} className="p-2 hover:bg-gray-100 rounded-full">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <textarea
            value={textMessage}
            onChange={(e) => setTextMessage(e.target.value)}
            placeholder="Scrivi il tuo messaggio..."
            className="w-full h-32 p-4 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            maxLength={500}
          />
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">{textMessage.length}/500</span>
            <button
              onClick={submitTextMessage}
              disabled={!textMessage.trim() || isSubmitting}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {isSubmitting ? 'Invio...' : 'Invia'}
            </button>
          </div>
        </div>
      )}

      {/* Audio Mode */}
      {activeMode === 'audio' && (
        <AudioRecorder
          onSend={(blob, duration) => submitMediaMessage(blob, 'audio', duration)}
          onCancel={() => setActiveMode('none')}
          maxDuration={60}
        />
      )}

      {/* Video Mode */}
      {activeMode === 'video' && (
        <VideoRecorder
          onSend={(blob, duration, thumb) => submitMediaMessage(blob, 'video', duration, thumb)}
          onCancel={() => setActiveMode('none')}
          maxDuration={30}
        />
      )}

      {/* Messages List */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-700 flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          Messaggi ({messages.length})
        </h3>
        
        {messages.length === 0 ? (
          <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-xl">
            Nessun messaggio ancora. Sii il primo!
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map(msg => (
              <div key={msg.id} className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-medium">
                    {msg.guest.name?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-800">
                        {msg.guest.name || 'Anonimo'}
                      </span>
                      <span className="text-gray-400">•</span>
                      <span className="text-xs text-gray-400">{formatDate(msg.createdAt)}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-gray-600">
                      {getMessageIcon(msg.type)}
                        {msg.type === 'text' ? (
                          <p className="text-sm">{msg.content}</p>
                        ) : (
                          msg.url ? (
                            <div className="flex-1">
                              <MediaPlayer url={msg.url} type={msg.type} />
                            </div>
                          ) : (
                            <span className="text-sm text-purple-600">{msg.type} message</span>
                          )
                        )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isSubmitting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
            <p className="text-gray-600">Invio messaggio...</p>
          </div>
        </div>
      )}
    </div>
  )
}
