'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Video, StopCircle, Play, Pause, Trash2, Send, Camera } from 'lucide-react'

interface VideoRecorderProps {
  onSend: (videoBlob: Blob, duration: number, thumbnailUrl: string) => void
  onCancel: () => void
  maxDuration?: number
}

export function VideoRecorder({ onSend, onCancel, maxDuration = 60 }: VideoRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [duration, setDuration] = useState(0)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const videoChunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const generateThumbnail = useCallback((videoElement: HTMLVideoElement) => {
    if (!canvasRef.current) return ''
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return ''
    
    canvas.width = 320
    canvas.height = 180
    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height)
    
    return canvas.toDataURL('image/jpeg', 0.7)
  }, [])

  const startRecording = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true 
      })
      
      setStream(mediaStream)
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
      
      const mediaRecorder = new MediaRecorder(mediaStream, {
        mimeType: MediaRecorder.isTypeSupported('video/webm') ? 'video/webm' : 'video/mp4'
      })
      
      mediaRecorderRef.current = mediaRecorder
      videoChunksRef.current = []
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          videoChunksRef.current.push(e.data)
        }
      }
      
      mediaRecorder.onstop = () => {
        const videoBlob = new Blob(videoChunksRef.current, { type: 'video/webm' })
        const url = URL.createObjectURL(videoBlob)
        setVideoUrl(url)
        
        // Generate thumbnail
        if (videoRef.current) {
          videoRef.current.srcObject = null
          videoRef.current.src = url
          videoRef.current.onloadeddata = () => {
            const thumb = generateThumbnail(videoRef.current!)
            setThumbnailUrl(thumb)
          }
        }
        
        // Stop all tracks
        mediaStream.getTracks().forEach(track => track.stop())
        setStream(null)
      }
      
      mediaRecorder.start(1000)
      setIsRecording(true)
      setDuration(0)
      
      // Start timer
      const startTime = Date.now()
      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000)
        setDuration(elapsed)
        
        if (elapsed >= maxDuration) {
          stopRecording()
        }
      }, 1000)
      
    } catch (err) {
      console.error('Error accessing camera:', err)
      alert('Non è possibile accedere alla camera. Verifica i permessi.')
    }
  }, [maxDuration, generateThumbnail])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
    
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [isRecording])

  const deleteRecording = useCallback(() => {
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl)
    }
    setVideoUrl(null)
    setThumbnailUrl(null)
    setDuration(0)
    setIsPlaying(false)
    videoChunksRef.current = []
  }, [videoUrl])

  const togglePlay = useCallback(() => {
    if (!videoRef.current || !videoUrl) return
    
    if (isPlaying) {
      videoRef.current.pause()
      setIsPlaying(false)
    } else {
      videoRef.current.play()
      setIsPlaying(true)
    }
  }, [isPlaying, videoUrl])

  const handleSend = useCallback(() => {
    if (videoChunksRef.current.length === 0 || !thumbnailUrl) return
    
    const videoBlob = new Blob(videoChunksRef.current, { type: 'video/webm' })
    onSend(videoBlob, duration, thumbnailUrl)
  }, [onSend, duration, thumbnailUrl])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Cleanup
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (mediaRecorderRef.current?.state !== 'inactive') {
        mediaRecorderRef.current?.stop()
      }
      if (videoUrl) URL.revokeObjectURL(videoUrl)
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [videoUrl, stream])

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
        <Video className="w-5 h-5" />
        Messaggio Video
      </h3>

      {/* Hidden canvas for thumbnail generation */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Video Preview */}
      <div className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden">
        <video
          ref={videoRef}
          autoPlay={isRecording}
          muted={isRecording}
          playsInline
          className="w-full h-full object-cover"
          onEnded={() => setIsPlaying(false)}
        />
        
        {!isRecording && !videoUrl && !stream && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800 text-white">
            <Camera className="w-16 h-16 mb-4 opacity-50" />
            <button
              onClick={startRecording}
              className="flex items-center gap-2 px-6 py-3 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
            >
              <Video className="w-5 h-5" />
              Registra Video
            </button>
          </div>
        )}

        {isRecording && (
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/50 px-3 py-1 rounded-full">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <span className="text-white font-mono font-bold">{formatTime(duration)}</span>
            <span className="text-white/70 text-sm">/ {formatTime(maxDuration)}</span>
          </div>
        )}

        {!isRecording && videoUrl && (
          <button
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/50 transition-colors"
          >
            <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
              {isPlaying ? (
                <Pause className="w-8 h-8 text-gray-800" />
              ) : (
                <Play className="w-8 h-8 text-gray-800 ml-1" />
              )}
            </div>
          </button>
        )}
      </div>

      {/* Controls */}
      <div className="flex justify-center">
        {isRecording ? (
          <button
            onClick={stopRecording}
            className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            <StopCircle className="w-5 h-5" />
            Termina ({formatTime(duration)})
          </button>
        ) : videoUrl ? (
          <div className="flex gap-3">
            <button
              onClick={deleteRecording}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Elimina
            </button>
            <button
              onClick={handleSend}
              disabled={!thumbnailUrl}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              Invia
            </button>
          </div>
        ) : (
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            Annulla
          </button>
        )}
      </div>

      {thumbnailUrl && (
        <div className="text-sm text-green-600 text-center">
          ✅ Thumbnail generato automaticamente
        </div>
      )}
    </div>
  )
}