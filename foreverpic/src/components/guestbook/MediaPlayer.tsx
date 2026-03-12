'use client'

import { useState, useRef, useCallback } from 'react'
import { Play, Pause, Volume2, VolumeX, Download } from 'lucide-react'

interface MediaPlayerProps {
  url: string
  type: 'audio' | 'video'
  thumbnailUrl?: string | null
}

export function MediaPlayer({ url, type, thumbnailUrl }: MediaPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const mediaRef = useRef<HTMLAudioElement | HTMLVideoElement>(null)

  const togglePlay = useCallback(() => {
    if (!mediaRef.current) return
    
    if (isPlaying) {
      mediaRef.current.pause()
    } else {
      mediaRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }, [isPlaying])

  const toggleMute = useCallback(() => {
    if (!mediaRef.current) return
    mediaRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }, [isMuted])

  const handleTimeUpdate = useCallback(() => {
    if (!mediaRef.current) return
    setCurrentTime(mediaRef.current.currentTime)
  }, [])

  const handleLoadedMetadata = useCallback(() => {
    if (!mediaRef.current) return
    setDuration(mediaRef.current.duration)
    setIsLoading(false)
  }, [])

  const handleEnded = useCallback(() => {
    setIsPlaying(false)
    setCurrentTime(0)
  }, [])

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!mediaRef.current) return
    const time = parseFloat(e.target.value)
    mediaRef.current.currentTime = time
    setCurrentTime(time)
  }

  if (type === 'audio') {
    return (
      <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl p-4">
        <audio
          ref={mediaRef as React.RefObject<HTMLAudioElement>}
          src={url}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
          className="hidden"
        />
        
        <div className="flex items-center gap-3">
          {/* Play/Pause */}
          <button
            onClick={togglePlay}
            disabled={isLoading}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              isPlaying
                ? 'bg-purple-600 text-white'
                : 'bg-white text-purple-600 shadow-md hover:bg-purple-50'
            } disabled:opacity-50`}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" />
            )}
          </button>
          
          {/* Progress */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
              <span className="font-mono">{formatTime(currentTime)}</span>
              <span className="text-gray-400">/</span>
              <span className="font-mono">{formatTime(duration)}</span>
            </div>
            <input
              type="range"
              min={0}
              max={duration || 1}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-2 bg-white rounded-full appearance-none cursor-pointer accent-purple-600"
            />
          </div>
          
          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleMute}
              className="p-2 rounded-full hover:bg-white/50 transition-colors text-gray-600"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <a
              href={url}
              download
              className="p-2 rounded-full hover:bg-white/50 transition-colors text-gray-600"
              title="Scarica"
            >
              <Download className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    )
  }

  // Video player
  return (
    <div className="bg-black rounded-xl overflow-hidden">
      <video
        ref={mediaRef as React.RefObject<HTMLVideoElement>}
        src={url}
        poster={thumbnailUrl || undefined}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        className="w-full max-h-64 object-contain"
        playsInline
      />
      
      {/* Video Controls */}
      <div className="bg-gray-900 p-3 flex items-center gap-3">
        <button
          onClick={togglePlay}
          disabled={isLoading}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
            isPlaying
              ? 'bg-purple-600 text-white'
              : 'bg-gray-700 text-white hover:bg-gray-600'
          } disabled:opacity-50`}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4 ml-0.5" />
          )}
        </button>
        
        {/* Progress bar */}
        <div className="flex-1">
          <input
            type="range"
            min={0}
            max={duration || 1}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-2 bg-gray-700 rounded-full appearance-none cursor-pointer accent-purple-500"
          />
        </div>
        
        {/* Time & Controls */}
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <span className="font-mono">{formatTime(currentTime)}</span>
          <span className="text-gray-500">/</span>
          <span className="font-mono">{formatTime(duration)}</span>
        </div>
        
        <button
          onClick={toggleMute}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors text-gray-300"
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
        
        <a
          href={url}
          download
          className="p-2 rounded-full hover:bg-gray-700 transition-colors text-gray-300"
          title="Scarica"
        >
          <Download className="w-5 h-5" />
        </a>
      </div>
    </div>
  )
}
