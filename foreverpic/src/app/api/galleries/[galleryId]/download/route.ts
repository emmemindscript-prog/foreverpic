import { NextRequest, NextResponse } from 'next/server'
import { adminSupabase } from '@/lib/supabase/admin'
import AdmZip from 'adm-zip'

export async function GET(
  request: NextRequest,
  { params }: { params: { galleryId: string } }
) {
  try {
    // Fetch all approved photos
    const { data: photos, error } = await adminSupabase
      .from('Photo')
      .select('*')
      .eq('galleryId', params.galleryId)
      .eq('moderationStatus', 'approved')

    if (error || !photos || photos.length === 0) {
      return NextResponse.json(
        { error: 'No photos found' },
        { status: 404 }
      )
    }

    // Create zip file
    const zip = new AdmZip()

    // Add photos to zip
    for (const photo of photos) {
      try {
        // Download image
        const response = await fetch(photo.imageUrl)
        const buffer = Buffer.from(await response.arrayBuffer())

        // Add to zip with timestamp in filename
        const timestamp = new Date(photo.createdAt).getTime()
        const ext = photo.imageUrl.split('.').pop() || 'jpg'
        zip.addFile(`photo-${timestamp}.${ext}`, buffer)
      } catch (error) {
        console.error(`Failed to download photo ${photo.id}:`, error)
        // Continue with other photos
      }
    }

    // Generate zip buffer
    const zipBuffer = zip.toBuffer()

    // Return as downloadable file
    return new NextResponse(zipBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="gallery-${params.galleryId}.zip"`,
        'Content-Length': zipBuffer.length.toString(),
      },
    })
  } catch (error) {
    console.error('Error downloading gallery:', error)
    return NextResponse.json(
      { error: 'Failed to download gallery' },
      { status: 500 }
    )
  }
}
