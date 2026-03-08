import { NextRequest, NextResponse } from 'next/server'
import { adminSupabase } from '@/lib/supabase/admin'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const galleryId = formData.get('galleryId') as string

    if (!file) {
      return NextResponse.json({ error: 'File richiesto' }, { status: 400 })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const ext = file.name.split('.').pop()
    const filename = `${timestamp}-${Math.random().toString(36).substring(2, 10)}.${ext}`
    const filePath = `${params.id}/${galleryId || 'default'}/${filename}`

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await adminSupabase.storage
      .from('photos')
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json({ error: 'Errore nel caricamento' }, { status: 500 })
    }

    // Get public URL
    const { data: urlData } = adminSupabase.storage
      .from('photos')
      .getPublicUrl(filePath)

    // Get thumbnail placeholder (in real implementation, use Sharp or similar)
    const thumbnailUrl = urlData.publicUrl

    // Save to DB
    const { data: photo, error: dbError } = await adminSupabase
      .from('Photo')
      .insert({
        url: urlData.publicUrl,
        thumbnailUrl,
        filename: file.name,
        fileType: file.type,
        fileSize: file.size,
        galleryId: galleryId || null,
        uploadedBy: null // Anonymous upload
      })
      .select()
      .single()

    if (dbError) {
      console.error('DB error:', dbError)
      return NextResponse.json({ error: 'Errore nel salvataggio' }, { status: 500 })
    }

    return NextResponse.json({ success: true, photo })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Errore interno' }, { status: 500 })
  }
}
