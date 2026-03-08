'use client'

import { useState, useRef } from 'react'
import { Button } from '../ui/button'
import { Card, CardHeader } from '../ui/card'
import { Camera, Upload } from 'lucide-react'

interface PhotoUploadProps {
  galleryId: string
  email?: string
  onUploadSuccess?: () => void
}

export default function PhotoUpload({
  galleryId,
  email,
  onUploadSuccess,
}: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    setUploading(true)
    setError(null)

    for (const file of Array.from(files)) {
      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('galleryId', galleryId)
        if (email) formData.append('email', email)

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Upload failed')
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Upload failed for some files'
        )
      }
    }

    setUploading(false)
    onUploadSuccess?.()
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    handleFileSelect(e.dataTransfer.files)
  }

  return (
    <Card>
      <CardHeader title="Carica Foto 📸" />
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-purple-500 transition-colors cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files)}
        />

        {uploading ? (
          <div className="space-y-2">
            <div className="text-4xl animate-pulse">⏳</div>
            <p>Caricamento in corso...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-6xl">
              <Camera className="w-20 h-20 mx-auto text-gray-400" />
            </div>
            <div>
              <p className="text-xl font-medium">
                Trascina foto o video qui
              </p>
              <p className="text-gray-600">oppure clicca per selezionare</p>
            </div>
            <Button>
              <Upload className="w-4 h-4 mr-2" />
              Seleziona File
            </Button>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="mt-4 text-sm text-gray-600">
        <p>
          Formati supportati: JPG, PNG, WebP, MP4, WebM (max 10MB per file)
        </p>
      </div>
    </Card>
  )
}
