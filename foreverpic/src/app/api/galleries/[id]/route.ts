import { NextRequest, NextResponse } from 'next/server'
import { adminSupabase } from '@/lib/supabase/admin'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data: gallery, error } = await adminSupabase
      .from('Gallery')
      .select(`
        *,
        event:eventId (
          id,
          title
        )
      `)
      .eq('id', params.id)
      .single()

    if (error) {
      return NextResponse.json({ error: 'Galleria non trovata' }, { status: 404 })
    }

    return NextResponse.json({ gallery })
  } catch (error) {
    console.error('Error fetching gallery:', error)
    return NextResponse.json({ error: 'Errore interno' }, { status: 500 })
  }
}
