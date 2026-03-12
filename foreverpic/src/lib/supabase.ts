import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const STORAGE_BUCKET = 'guestbook-media'

export async function uploadGuestbookFile(
  file: File,
  eventId: string,
  guestId: string
): Promise<{ url: string; path: string } | null> {
  try {
    const ext = file.name.split('.').pop()
    const fileName = `${eventId}/${guestId}/${Date.now()}.${ext}`
    
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })
    
    if (error) {
      console.error('Upload error:', error)
      return null
    }
    
    const { data: { publicUrl } } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(fileName)
    
    return { url: publicUrl, path: fileName }
  } catch (error) {
    console.error('Upload failed:', error)
    return null
  }
}

export async function deleteGuestbookFile(path: string): Promise<boolean> {
  try {
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([path])
    
    if (error) {
      console.error('Delete error:', error)
      return false
    }
    
    return true
  } catch (error) {
    console.error('Delete failed:', error)
    return false
  }
}
