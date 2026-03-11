'use client'

import { GuestbookManager } from '@/components/guestbook/GuestbookManager'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { Heart, MessageCircle } from 'lucide-react'

export default function GuestbookPage() {
  const params = useParams()
  const eventId = params?.eventId as string
  
  const [guestName, setGuestName] = useState('')
  const [guestEmail, setGuestEmail] = useState('')
  const [isIdentified, setIsIdentified] = useState(false)

  if (!eventId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Evento non trovato</h1>
          <p className="text-gray-500 mt-2">Codice evento mancante o non valido</p>
        </div>
      </div>
    )
  }

  // Simple guest identification form
  if (!isIdentified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-8 px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm mb-4">
              <Heart className="w-5 h-5 text-red-500" />
              <span className="text-sm text-gray-600">Guestbook</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Lascia il tuo messaggio
            </h1>
            <p className="text-gray-500">
              Scrivi una dedica, registra un audio o un video per gli sposi
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Il tuo nome *
              </label>
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Es. Mario Rossi"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email (opzionale)
              </label>
              <input
                type="email"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                placeholder="mario@esempio.com"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={() => {
                if (guestName.trim()) {
                  setIsIdentified(true)
                }
              }}
              disabled={!guestName.trim()}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="flex items-center justify-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Continua al Guestbook
              </span>
            </button>

            <p className="text-xs text-gray-400 text-center">
              Il tuo nome verrà mostrato accanto al messaggio
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Main guestbook view
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm mb-4">
            <Heart className="w-5 h-5 text-red-500" />
            <span className="text-sm text-gray-600">Guestbook</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">
            Dedica per gli sposi
          </h1>
          <p className="text-gray-500 mt-2">
            Ciao {guestName}, lascia il tuo messaggio! 💌
          </p>
        </div>

        {/* Guestbook Manager */}
        <GuestbookManager
          eventId={eventId}
          guestName={guestName}
          guestEmail={guestEmail || undefined}
        />

        {/* Change name option */}
        <div className="text-center mt-8">
          <button
            onClick={() => setIsIdentified(false)}
            className="text-sm text-purple-600 hover:text-purple-700"
          >
            Cambia nome/email
          </button>
        </div>
      </div>
    </div>
  )
}
