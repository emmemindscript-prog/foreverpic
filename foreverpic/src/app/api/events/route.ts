import { NextRequest, NextResponse } from 'next/server'
import { adminSupabase } from '@/lib/supabase/admin'
export const dynamic = 'force-dynamic'

import { generateEventQRCodeId, buildScanUrl, generateQRCode } from '@/lib/qrcode'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, date, hostEmail, hostName, password } = body

    // Validate input
    if (!title || !date || !hostEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Generate unique QR code ID
    const qrCodeId = generateEventQRCodeId()
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

    // Create event in database
    const { data: event, error } = await adminSupabase
      .from('Event')
      .insert({
        title,
        date: new Date(date).toISOString(),
        hostEmail,
        hostName,
        qrCode: qrCodeId,
        password: password || null,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating event:', error)
      return NextResponse.json(
        { error: 'Failed to create event' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      event,
      scanUrl,
    })
  } catch (error) {
    console.error('Error in POST /api/events:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const hostEmail = searchParams.get('hostEmail')

    const query = adminSupabase
      .from('Event')
      .select('*')
      .order('createdAt', { ascending: false })

    if (hostEmail) {
      query.eq('hostEmail', hostEmail)
    }

    const { data: events, error } = await query

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch events' },
        { status: 500 }
      )
    }

    return NextResponse.json({ events })
  } catch (error) {
    console.error('Error in GET /api/events:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
