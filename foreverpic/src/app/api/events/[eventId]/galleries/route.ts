import { NextRequest, NextResponse } from 'next/server'
import { adminSupabase } from '@/lib/supabase/admin'
import { generateGalleryQRCodeId } from '@/lib/qrcode'
import { generateQRCode } from '@/lib/qrcode'

export async function POST(
  request: NextRequest,
  { params }: { params: { eventId: string } }
) {
  try {
    const eventId = params.eventId
    const body = await request.json()
    const { title, description } = body

    if (!title) {
      return NextResponse.json(
        { error: 'Missing gallery title' },
        { status: 400 }
      )
    }

    // Generate unique QR code ID for gallery
    const qrCodeId = generateGalleryQRCodeId()
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const scanUrl = buildScanUrl(qrCodeId, baseUrl)

    // Generate QR code
    const qrResult = await generateQRCode(scanUrl)
    if (!qrResult.success) {
      return NextResponse.json(
        { error: 'Failed to generate QR code' },
        { status: 500 }
      )
    }

    // Create gallery
    const { data: gallery, error } = await adminSupabase
      .from('Gallery')
      .insert({
        eventId,
        title,
        description,
        qrCode: qrCodeId,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Failed to create gallery' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      gallery,
      scanUrl,
    })
  } catch (error) {
    console.error('Error creating gallery:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { eventId: string } }
) {
  try {
    const { data: galleries, error } = await adminSupabase
      .from('Gallery')
      .select('*, Photo(*)')
      .eq('eventId', params.eventId)
      .order('createdAt', { ascending: true })

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch galleries' },
        { status: 500 }
      )
    }

    return NextResponse.json({ galleries })
  } catch (error) {
    console.error('Error fetching galleries:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
