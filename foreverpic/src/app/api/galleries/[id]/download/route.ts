import { NextRequest, NextResponse } from 'next/server'
import { adminSupabase } from '@/lib/supabase/admin'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get gallery info
    const { data: gallery, error: galleryError } = await adminSupabase
      .from('Gallery')
      .select('name, eventId')
      .eq('id', params.id)
      .single()

    if (galleryError || !gallery) {
      return NextResponse.json({ error: 'Galleria non trovata' }, { status: 404 })
    }

    // Get photos
    const { data: photos, error: photosError } = await adminSupabase
      .from('Photo')
      .select('filename, url')
      .eq('galleryId', params.id)

    if (photosError) {
      return NextResponse.json({ error: 'Errore nel recupero foto' }, { status: 500 })
    }

    if (!photos || photos.length === 0) {
      return NextResponse.json({ error: 'Nessuna foto nella galleria' }, { status: 404 })
    }

    // Return JSON for frontend to handle ZIP creation (or implement server-side ZIP)
    // For now, redirect to a simple JSON response with URLs
    return NextResponse.json({
      gallery: gallery.name,
      count: photos.length,
      photos: photos.map(p => ({ name: p.filename, url: p.url }))
    })
  } catch (error) {
    console.error('Error in download:', error)
    return NextResponse.json({ error: 'Errore interno' }, { status: 500 })
  }
}
