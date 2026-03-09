import { NextRequest, NextResponse } from 'next/server'
import { adminSupabase } from '@/lib/supabase/admin'
export const dynamic = 'force-dynamic'


export async function GET(
  request: NextRequest,
  { params }: { params: { qrCodeId: string } }
) {
  try {
    const qrCodeId = params.qrCodeId

    // Check password if provided
    const searchParams = request.nextUrl.searchParams
    const password = searchParams.get('password')

    // Try to find event with this QR code
    const { data: event, error: eventError } = await adminSupabase
      .from('Event')
      .select('*')
      .eq('qrCode', qrCodeId)
      .single()

    if (event) {
      // Check password if required
      if (event.password && event.password !== password) {
        return NextResponse.json(
          { error: 'Password required or incorrect' },
          { status: 401 }
        )
      }

      return NextResponse.json({
        type: 'event',
        data: event,
      })
    }

    // Try to find gallery with this QR code
    const { data: gallery, error: galleryError } = await adminSupabase
      .from('Gallery')
      .select('*, Event(*)')
      .eq('qrCode', qrCodeId)
      .single()

    if (gallery) {
      // Check event password if required
      if (gallery.Event?.password && gallery.Event.password !== password) {
        return NextResponse.json(
          { error: 'Password required or incorrect' },
          { status: 401 }
        )
      }

      return NextResponse.json({
        type: 'gallery',
        data: gallery,
      })
    }

    // Not found
    return NextResponse.json(
      { error: 'QR code not found' },
      { status: 404 }
    )
  } catch (error) {
    console.error('Error scanning QR code:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
