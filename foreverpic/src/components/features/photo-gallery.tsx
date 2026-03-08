'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Photo } from '@/types'

interface PhotoGalleryProps {
  galleryId: string
}

export default function PhotoGallery({ galleryId }: PhotoGalleryProps) {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  const limit = 50

  const fetchPhotos = async (offset: number = 0, append: boolean = false) => {
    try {
      const response = await fetch(
        `/api/galleries/${galleryId}/photos?limit=${limit}&offset=${offset}`
      )
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch photos')
      }

      const newPhotos = data.photos || []
      setPhotos((prev) => (append ? [...prev, ...newPhotos] : newPhotos))
      setHasMore(newPhotos.length === limit)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load photos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPhotos()
  }, [galleryId])

  const loadMore = () => {
    setPage((prev) => {
      const newPage = prev + 1
      fetchPhotos(newPage * limit, true)
      return newPage
    })
  }

  const handleDownload = async () => {
    try {
      const response = await fetch(`/api/galleries/${galleryId}/download`)
      if (!response.ok) {
        throw new Error('Failed to download')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `gallery-${galleryId}.zip`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      alert('Download failed')
    }
  }

  if (loading && photos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="animate-pulse">Caricamento foto...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-600">
        {error}
      </div>
    )
  }

  if (photos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📷</div>
        <p className="text-xl text-gray-600">
          Nessuna foto ancora caricata
        </p>
        <p className="text-gray-500">
          Sii il primo a condividere un ricordo!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {photos.length} {photos.length === 1 ? 'Foto' : 'Foto'}
        </h2>
        <button
          onClick={handleDownload}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          📥 Scarica ZIP
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
            onClick={() => setSelectedPhoto(photo)}
          >
            <Image
              src={photo.thumbnailUrl || photo.imageUrl}
              alt={photo.description || 'Foto'}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              className="object-cover group-hover:scale-110 transition-transform duration-300"
            />
            {photo.description && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="absolute bottom-2 left-2 right-2 text-white text-sm">
                  {photo.description}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="text-center">
          <button
            onClick={loadMore}
            className="px-6 py-3 bg-white border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
          >
            Carica altre foto
          </button>
        </div>
      )}

      {/* Modal for selected photo */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <Image
              src={selectedPhoto.imageUrl}
              alt={selectedPhoto.description || 'Foto'}
              width={1920}
              height={1080}
              className="max-w-full max-h-[90vh] object-contain"
            />
            {selectedPhoto.description && (
              <div className="absolute bottom-4 left-4 right-4 text-white text-center">
                <p className="text-lg bg-black/50 rounded-lg px-4 py-2">
                  {selectedPhoto.description}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
