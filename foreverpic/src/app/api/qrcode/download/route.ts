import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl.searchParams.get('url')
    
    if (!url) {
      return NextResponse.json({ error: 'URL richiesto' }, { status: 400 })
    }

    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(url)}`
    
    // Proxy the QR code image
    const response = await fetch(qrCodeUrl)
    const imageBuffer = await response.arrayBuffer()

    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': 'attachment; filename="qrcode.png"'
      }
    })
  } catch (error) {
    console.error('QR code error:', error)
    return NextResponse.json({ error: 'Errore interno' }, { status: 500 })
  }
}
