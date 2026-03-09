import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// POST /api/guests/[id]/rsvp - aggiorna stato RSVP
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const guestId = params.id
    const body = await request.json()
    const { status, notes } = body
    
    if (!status || !['confirmed', 'declined', 'pending'].includes(status)) {
      return NextResponse.json(
        { error: 'Stato RSVP non valido' },
        { status: 400 }
      )
    }
    
    const guest = await prisma.guest.update({
      where: { id: guestId },
      data: { 
        rsvpStatus: status,
        // notes potrebbe essere aggiunto allo schema se necessario
      },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            date: true,
            hostEmail: true
          }
        }
      }
    })
    
    return NextResponse.json({ 
      success: true,
      guest: {
        id: guest.id,
        name: guest.name,
        status: guest.rsvpStatus,
        event: guest.event
      }
    })
  } catch (error) {
    console.error('Error updating RSVP:', error)
    return NextResponse.json(
      { error: 'Errore nell\'aggiornamento RSVP' },
      { status: 500 }
    )
  }
}

// GET /api/guests/[id]/rsvp - verifica stato RSVP
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const guestId = params.id
    
    const guest = await prisma.guest.findUnique({
      where: { id: guestId },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            date: true,
            hostEmail: true,
            hostName: true
          }
        }
      }
    })
    
    if (!guest) {
      return NextResponse.json(
        { error: 'Ospite non trovato' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      guest: {
        id: guest.id,
        name: guest.name,
        email: guest.email,
        phone: guest.phone,
        status: guest.rsvpStatus,
        event: guest.event
      }
    })
  } catch (error) {
    console.error('Error fetching guest RSVP:', error)
    return NextResponse.json(
      { error: 'Errore nel caricamento RSVP' },
      { status: 500 }
    )
  }
}