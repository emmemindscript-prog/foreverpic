import adminSupabase from './supabase/admin'

export interface UploadResult {
  success: boolean
  imageUrl?: string
  error?: string
}

/**
 * Upload file to Supabase Storage
 */
export async function uploadFileToStorage(
  file: File,
  eventId: string,
  galleryId: string
): Promise<UploadResult> {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    const filePath = `${eventId}/${galleryId}/${fileName}`

    const { data, error } = await adminSupabase.storage
      .from('photos')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (error) throw error

    // Get public URL
    const { data: { publicUrl } } = adminSupabase.storage
      .from('photos')
      .getPublicUrl(filePath)

    return {
      success: true,
      imageUrl: publicUrl,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    }
  }
}

/**
 * Generate thumbnail for image
 */
export async function generateThumbnail(
  imageUrl: string,
  eventId: string,
  galleryId: string
): Promise<string | null> {
  try {
    const response = await fetch(imageUrl)
    const blob = await response.blob()

    const fileName = `thumb-${Date.now()}.webp`
    const filePath = `${eventId}/${galleryId}/${fileName}`

    const { data, error } = await adminSupabase.storage
      .from('thumbnails')
      .upload(filePath, blob, {
        cacheControl: '3600',
        upsert: false,
      })

    if (error) return null

    const { data: { publicUrl } } = adminSupabase.storage
      .from('thumbnails')
      .getPublicUrl(filePath)

    return publicUrl
  } catch {
    return null
  }
}

/**
 * Delete file from storage
 */
export async function deleteFileFromStorage(filePath: string): Promise<boolean> {
  try {
    const { error } = await adminSupabase.storage
      .from('photos')
      .remove([filePath])

    return !error
  } catch {
    return false
  }
}
