import { NextRequest, NextResponse } from 'next/server'
import { adminSupabase } from '@/lib/supabase/admin'
export const dynamic = 'force-dynamic'


export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data: photos, error } = await adminSupabase
      .from('Photo')
      .select('*')
      .eq('galleryId', params.id)
      .order('createdAt', { ascending: false })

    if (error) {
      return NextResponse.json({ error: 'Errore nel caricamento foto' }, { status: 500 })
    }

    return NextResponse.json({ photos: photos || [] })
  } catch (error) {
    console.error('Error fetching photos:', error)
    return NextResponse.json({ error: 'Errore interno' }, { status: 500 })
  }
}
