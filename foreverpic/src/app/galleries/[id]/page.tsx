'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowLeft, Download, Upload, Image as ImageIcon, Grid, List, X } from 'lucide-react'

interface Gallery {
  id: string
  name: string
  description: string | null
  eventId: string
  event: { title: string }
}

interface Photo {
  id: string
  url: string
  thumbnailUrl: string
  filename: string
  fileSize: number
  createdAt: string
}

export default function GalleryViewPage() {
  const params = useParams()
  const galleryId = params.id as string
  const [gallery, setGallery] = useState<Gallery | null>(null)
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [uploading, setUploading] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const [gRes, pRes] = await Promise.all([
        fetch(`/api/galleries/${galleryId}`),
        fetch(`/api/galleries/${galleryId}/photos`)
      ])
      if (!gRes.ok) throw new Error('Galleria non trovata')
      const gData = await gRes.json()
      setGallery(gData.gallery)
      if (pRes.ok) {
        const pData = await pRes.json()
        setPhotos(pData.photos || [])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore')
    } finally {
      setLoading(false)
    }
  }, [galleryId])

  useEffect(() => { if (galleryId) fetchData() }, [galleryId, fetchData])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || !gallery) return
    setUploading(true)
    for (const file of Array.from(files)) {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('galleryId', galleryId)
      try {
        await fetch(`/api/events/${gallery.eventId}/upload`, { method: 'POST', body: formData })
      } catch (e) { console.error(e) }
    }
    setUploading(false)
    fetchData()
  }

  const downloadZip = () => { window.open(`/api/galleries/${galleryId}/download`, '_blank') }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="p-8"><div className="animate-spin h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div><p>Caricamento...</p></Card>
    </div>
  )

  if (error || !gallery) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="p-8 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Errore</h2>
        <p className="mb-4">{error || 'Galleria non trovata'}</p>
        <Link href="/"><Button>Torna Home</Button></Link>
      </Card>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Link href={`/events/${gallery.eventId}`}><Button variant="ghost" size="sm" className="mb-4"><ArrowLeft className="w-4 h-4 mr-1"/>Evento</Button></Link>
        
        <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-6">
          <div><p className="text-gray-600 text-sm">{gallery.event.title}</p><h1 className="text-3xl font-bold">{gallery.name}</h1></div>
          <div className="flex gap-2">
            <label className="cursor-pointer"><input type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} disabled={uploading}/><Button disabled={uploading}><Upload className="w-4 h-4 mr-2"/>{uploading ? '...' : 'Carica'}</Button></label>
            <Button variant="outline" onClick={downloadZip} disabled={photos.length===0}><Download className="w-4 h-4 mr-2"/>ZIP</Button>
            <div className="flex border rounded">
              <Button variant={viewMode==='grid'?'default':'ghost'} size="sm" onClick={()=>setViewMode('grid')}><Grid className="w-4 h-4"/></Button>
              <Button variant={viewMode==='list'?'default':'ghost'} size="sm" onClick={()=>setViewMode('list')}><List className="w-4 h-4"/></Button>
            </div>
          </div>
        </div>

        {photos.length===0 ? (
          <Card className="p-12 text-center">
            <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4"/>
            <h3 className="font-semibold text-xl mb-2">Nessuna foto</h3>
            <p className="text-gray-600 mb-6">Carica le prime foto!</p>
            <label className="cursor-pointer"><input type="file" accept="image/*" multiple className="hidden" onChange={handleUpload}/><Button>Carica Foto</Button></label>
          </Card>
        ) : viewMode==='grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map(p=>(
              <Card key={p.id} className="overflow-hidden cursor-pointer hover:shadow-lg" onClick={()=>setSelectedPhoto(p)}>
                <div className="aspect-square bg-gray-100"><img src={p.thumbnailUrl} alt={p.filename} className="w-full h-full object-cover" loading="lazy"/></div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {photos.map(p=>(
              <Card key={p.id} className="p-4 flex items-center gap-4 cursor-pointer hover:shadow-lg" onClick={()=>setSelectedPhoto(p)}>
                <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden"><img src={p.thumbnailUrl} alt={p.filename} className="w-full h-full object-cover"/></div>
                <div className="flex-1"><p className="font-medium truncate">{p.filename}</p><p className="text-sm text-gray-600">{(p.fileSize/1024/1024).toFixed(2)} MB</p></div>
              </Card>
            ))}
          </div>
        )}

        {selectedPhoto && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={()=>setSelectedPhoto(null)}>
            <button className="absolute top-4 right-4 text-white" onClick={()=>setSelectedPhoto(null)}><X className="w-8 h-8"/></button>
            <img src={selectedPhoto.url} alt={selectedPhoto.filename} className="max-w-full max-h-[90vh] object-contain" onClick={e=>e.stopPropagation()}/>
          </div>
        )}
      </div>
    </div>
  )
}
