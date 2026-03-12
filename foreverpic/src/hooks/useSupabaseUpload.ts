'use client'

import { useState, useCallback } from 'react'
import { uploadGuestbookFile } from '@/lib/supabase'

interface UploadState {
  isUploading: boolean
  progress: number
  error: string | null
  url: string | null
}

interface UseSupabaseUploadReturn extends UploadState {
  uploadFile: (file: File, eventId: string, guestId: string) => Promise<string | null>
  reset: () => void
}

export function useSupabaseUpload(): UseSupabaseUploadReturn {
  const [state, setState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: null,
    url: null
  })

  const uploadFile = useCallback(async (
    file: File,
    eventId: string,
    guestId: string
  ): Promise<string | null> => {
    setState({ isUploading: true, progress: 0, error: null, url: null })

    try {
      const result = await uploadGuestbookFile(file, eventId, guestId)
      
      if (!result) {
        setState({ isUploading: false, progress: 0, error: 'Upload failed', url: null })
        return null
      }

      setState({ isUploading: false, progress: 100, error: null, url: result.url })
      return result.url
    } catch (error) {
      setState({
        isUploading: false,
        progress: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
        url: null
      })
      return null
    }
  }, [])

  const reset = useCallback(() => {
    setState({ isUploading: false, progress: 0, error: null, url: null })
  }, [])

  return { ...state, uploadFile, reset }
}
