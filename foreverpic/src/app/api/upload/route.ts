import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Create admin client with service role
const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const eventId = formData.get('eventId') as string

    if (!file || !eventId) {
      return NextResponse.json(
        { error: 'Missing file or eventId' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['audio/webm', 'video/webm', 'audio/mp4', 'video/mp4', 'video/quicktime']
    if (!allowedTypes.some(type => file.type.includes(type.replace('*', '')))) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: webm, mp4, mov' },
        { status: 400 }
      )
    }

    // Max 50MB
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large. Max 50MB' },
        { status: 400 }
      )
    }

    // Generate unique filename
    const timestamp = Date.now()
    const ext = file.name.split('.').pop() || 'webm'
    const filename = `${eventId}/${timestamp}-${Math.random().toString(36).substring(7)}.${ext}`

    // Convert File to Buffer for upload
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from('guestbook-media')
      .upload(filename, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Supabase upload error:', error)
      return NextResponse.json(
        { error: 'Upload failed: ' + error.message },
        { status: 500 }
      )
    }

    // Get public URL
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('guestbook-media')
      .getPublicUrl(filename)

    return NextResponse.json({
      success: true,
      url: publicUrl,
      path: filename,
      size: file.size
    })

  } catch (error) {
    console.error('Upload route error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Increase body size limit for large files
export const config = {
  api: {
    bodyParser: false,
    responseLimit: '50mb'
  }
}
