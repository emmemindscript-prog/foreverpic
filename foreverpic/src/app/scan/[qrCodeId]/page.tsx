'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { QRCodeReader } from 'react-qr-reader'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

type ScanResult = {
  type: 'event' | 'gallery'
  data: any
}

export default function ScanPage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [passwordRequired, setPasswordRequired] = useState(false)
  const [password, setPassword] = useState('')
  const [scanResult, setScanResult] = useState<ScanResult | null>(null)

  useEffect(() => {
    verifyQRCode()
  }, [params.qrCodeId, password])

  const verifyQRCode = async () => {
    try {
      const response = await fetch(
        `/api/scan/${params.qrCodeId}${password ? `?password=${password}` : ''}`
      )
      const data = await response.json()

      if (response.status === 401) {
        setPasswordRequired(true)
        setLoading(false)
        return
      }

      if (!response.ok) {
        throw new Error(data.error || 'QR code non valido')
      }

      setScanResult(data)
      setLoading(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore di verifica')
      setLoading(false)
    }
  }

  const handleScanSuccess = (result: string) => {
    // Redirect to scanned URL
    router.push(result)
  }

  const handleEnter = () => {
    if (scanResult) {
      if (scanResult.type === 'event') {
        router.push(`/events/${scanResult.data.id}`)
      } else if (scanResult.type === 'gallery') {
        router.push(`/galleries/${scanResult.data.id}`)
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <p>Verificando QR code...</p>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-radial">
        <Card className="max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Errore</h2>
          <p className="mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Riprova</Button>
        </Card>
      </div>
    )
  }

  if (passwordRequired) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-radial">
        <Card className="max-w-md">
          <h2 className="text-2xl font-bold mb-4">Password Richiesta</h2>
          <Input
            label="Inserisci password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password evento..."
          />
          <Button onClick={verifyQRCode} className="w-full mt-4">
            Verifica
          </Button>
        </Card>
      </div>
    )
  }

  if (scanResult) {
    const title =
      scanResult.type === 'event'
        ? scanResult.data.title
        : scanResult.data.title
    const date =
      scanResult.type === 'event'
        ? new Date(scanResult.data.date).toLocaleDateString('it-IT', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        : ''

    return (
      <div className="min-h-screen gradient-radial">
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-2xl mx-auto text-center">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-3xl font-bold mb-2">{title}</h2>
            {date && <p className="text-xl text-gray-600 mb-6">{date}</p>}

            <p className="text-gray-600 mb-6">
              {scanResult.type === 'event'
                ? 'Carica foto e video per questo evento'
                : 'Carica foto e video in questa galleria'}
            </p>

            <Button onClick={handleEnter} size="lg">
              Entra 📸
            </Button>
          </Card>
        </div>
      </div>
    )
  }

  return null
}
