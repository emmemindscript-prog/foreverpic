import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export const dynamic = 'force-dynamic'

const prisma = new PrismaClient()

// GET /api/events/[id]/guests - lista ospiti
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = params.id
    
    const guests = await prisma.guest.findMany({
      where: { eventId },
      orderBy: { createdAt: 'desc' }
    })
    
    // Aggiunta statistiche
    const stats = {
      total: guests.length,
      confirmed: guests.filter((g: {rsvpStatus: string}) => g.rsvpStatus === 'confirmed').length,
      declined: guests.filter((g: {rsvpStatus: string}) => g.rsvpStatus === 'declined').length,
      pending: guests.filter((g: {rsvpStatus: string}) => g.rsvpStatus === 'pending').length
    }
    
    return NextResponse.json({ guests, stats })
  } catch (error) {
    console.error('Error fetching guests:', error)
    return NextResponse.json(
      { error: 'Errore nel caricamento ospiti' },
      { status: 500 }
    )
  }
}

// POST /api/events/[id]/guests - aggiungi ospite
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = params.id
    const body = await request.json()
    const { name, email, phone } = body
    
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Nome e email richiesti' },
        { status: 400 }
      )
    }
    
    // Verifica evento esiste
    const event = await prisma.event.findUnique({
      where: { id: eventId }
    })
    
    if (!event) {
      return NextResponse.json(
        { error: 'Evento non trovato' },
        { status: 404 }
      )
    }
    
    // Crea ospite
    const guest = await prisma.guest.create({
      data: {
        name,
        email: email.toLowerCase(),
        phone,
        eventId,
        rsvpStatus: 'pending'
      }
    })
    
    return NextResponse.json({ guest }, { status: 201 })
  } catch (error) {
    console.error('Error creating guest:', error)
    return NextResponse.json(
      { error: 'Errore nella creazione ospite' },
      { status: 500 }
    )
  }
}