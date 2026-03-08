import { NextRequest, NextResponse } from 'next/server'
import { adminSupabase } from '@/lib/supabase/admin'
import { uploadFileToStorage, generateThumbnail } from '@/lib/storage'

export async function POST(
  request: NextRequest,
  { params }: { params: { eventId: string } }
) {
  try {
    const eventId = params.eventId

    // Get form data
    const formData = await request.formData()
    const file = formData.get('file') as File
    const galleryId = formData.get('galleryId') as string
    const description = formData.get('description') as string | null
    const uploadedByEmail = formData.get('email') as string | null

    if (!file || !galleryId) {
      return NextResponse.json(
        { error: 'Missing file or galleryId' },
        { status: 400 }
      )
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large (max 10MB)' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type' },
        { status: 400 }
      )
    }

    // Upload to storage
    const uploadResult = await uploadFileToStorage(file, eventId, galleryId)
    if (!uploadResult.success) {
      return NextResponse.json(
        { error: uploadResult.error || 'Upload failed' },
        { status: 500 }
      )
    }

    // Generate thumbnail for images
    let thumbnailUrl: string | null = null
    if (file.type.startsWith('image/')) {
      thumbnailUrl = await generateThumbnail(uploadResult.imageUrl!, eventId, galleryId)
    }

    // Save photo to database
    const { data: photo, error } = await adminSupabase
      .from('Photo')
      .insert({
        galleryId,
        uploadedByEmail,
        imageUrl: uploadResult.imageUrl,
        thumbnailUrl,
        description,
        moderationStatus: 'pending',
      })
      .select()
      .single()

    if (error) {
      console.error('Error saving photo:', error)
      return NextResponse.json(
        { error: 'Failed to save photo' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      photo,
    })
  } catch (error) {
    console.error('Error in upload:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
