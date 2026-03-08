import { NextRequest, NextResponse } from 'next/server'
import { adminSupabase } from '@/lib/supabase/admin'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data: galleries, error } = await adminSupabase
      .from('Gallery')
      .select('*')
      .eq('eventId', params.id)
      .order('createdAt', { ascending: false })

    if (error) {
      return NextResponse.json({ error: 'Errore nel caricamento' }, { status: 500 })
    }

    return NextResponse.json({ galleries: galleries || [] })
  } catch (error) {
    console.error('Error fetching galleries:', error)
    return NextResponse.json({ error: 'Errore interno' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, description, type } = body

    if (!name) {
      return NextResponse.json({ error: 'Nome richiesto' }, { status: 400 })
    }

    const { data: gallery, error } = await adminSupabase
      .from('Gallery')
      .insert({
        name,
        description,
        type: type || 'custom',
        eventId: params.id
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: 'Errore nella creazione' }, { status: 500 })
    }

    return NextResponse.json({ gallery })
  } catch (error) {
    console.error('Error creating gallery:', error)
    return NextResponse.json({ error: 'Errore interno' }, { status: 500 })
  }
}
