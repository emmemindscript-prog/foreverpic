'use client'

import { useState, useRef, useCallback } from 'react'
import { Mic, StopCircle, Play, Pause, Trash2, Send } from 'lucide-react'

interface AudioRecorderProps {
  onSend: (audioBlob: Blob, duration: number) => void
  onCancel: () => void
  maxDuration?: number // seconds, default 60
}

export function AudioRecorder({ onSend, onCancel, maxDuration = 60 }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [duration, setDuration] = useState(0)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const audioElementRef = useRef<HTMLAudioElement | null>(null)

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4'
      })
      
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data)
        }
      }
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        const url = URL.createObjectURL(audioBlob)
        setAudioUrl(url)
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop())
      }
      
      mediaRecorder.start(1000) // Collect data every second
      setIsRecording(true)
      setIsPaused(false)
      
      // Start timer
      const startTime = Date.now() - duration * 1000
      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000)
        setDuration(elapsed)
        
        if (elapsed >= maxDuration) {
          stopRecording()
        }
      }, 1000)
      
    } catch (err) {
      console.error('Error accessing microphone:', err)
      alert('Non è possibile accedere al microfono. Verifica i permessi.')
    }
  }, [duration, maxDuration])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setIsPaused(false)
    }
    
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [isRecording])

  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording && !isPaused) {
      mediaRecorderRef.current.pause()
      setIsPaused(true)
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isRecording, isPaused])

  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && isPaused) {
      mediaRecorderRef.current.resume()
      setIsPaused(false)
      
      // Resume timer
      const startTime = Date.now() - duration * 1000
      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000)
        setDuration(elapsed)
      }, 1000)
    }
  }, [isPaused, duration])

  const deleteRecording = useCallback(() => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
    }
    setAudioUrl(null)
    setDuration(0)
    setIsPlaying(false)
    audioChunksRef.current = []
  }, [audioUrl])

  const togglePlay = useCallback(() => {
    if (!audioElementRef.current || !audioUrl) return
    
    if (isPlaying) {
      audioElementRef.current.pause()
      setIsPlaying(false)
    } else {
      audioElementRef.current.play()
      setIsPlaying(true)
    }
  }, [isPlaying, audioUrl])

  const handleSend = useCallback(() => {
    if (audioChunksRef.current.length === 0) return
    
    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
    onSend(audioBlob, duration)
  }, [onSend, duration])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Cleanup on unmount
  const cleanup = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (mediaRecorderRef.current?.state !== 'inactive') {
      mediaRecorderRef.current?.stop()
    }
    if (audioUrl) URL.revokeObjectURL(audioUrl)
  }, [audioUrl])

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
        <Mic className="w-5 h-5" />
        Messaggio Vocale
      </h3>

      {/* Recording Visualization */}
      <div className="flex items-center justify-center h-32 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl">
        {!isRecording && !audioUrl ? (
          <button
            onClick={startRecording}
            className="flex flex-col items-center gap-2 p-4 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
          >
            <Mic className="w-8 h-8" />
            <span className="text-sm">Tocca per registrare</span>
          </button>
        ) : isRecording ? (
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <span className="text-2xl font-mono font-bold text-gray-700">
                {formatTime(duration)}
              </span>
              <span className="text-sm text-gray-500">/ {formatTime(maxDuration)}</span>
            </div>
            <div className="flex gap-3">
              {isPaused ? (
                <button
                  onClick={resumeRecording}
                  className="p-3 rounded-full bg-blue-500 text-white hover:bg-blue-600"
                  title="Riprendi"
                >
                  <Mic className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={pauseRecording}
                  className="p-3 rounded-full bg-yellow-500 text-white hover:bg-yellow-600"
                  title="Pausa"
                >
                  <Pause className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={stopRecording}
                className="p-3 rounded-full bg-red-500 text-white hover:bg-red-600"
                title="Termina"
              >
                <StopCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 w-full px-4">
            <audio
              ref={audioElementRef}
              src={audioUrl}
              onEnded={() => setIsPlaying(false)}
              className="hidden"
            />
            <div className="flex items-center gap-4">
              <button
                onClick={togglePlay}
                className="p-4 rounded-full bg-purple-500 text-white hover:bg-purple-600"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </button>
              <div className="text-sm text-gray-600">
                Durata: {formatTime(duration)}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {audioUrl && (
        <div className="flex gap-3 justify-end">
          <button
            onClick={deleteRecording}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Elimina
          </button>
          <button
            onClick={handleSend}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            <Send className="w-4 h-4" />
            Invia
          </button>
        </div>
      )}

      {/* Cancel */}
      {!isRecording && !audioUrl && (
        <button
          onClick={onCancel}
          className="w-full py-2 text-gray-500 hover:text-gray-700 transition-colors"
        >
          Annulla
        </button>
      )}
    </div>
  )
}