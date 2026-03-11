import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export const dynamic = 'force-dynamic'

const prisma = new PrismaClient()

// POST /api/guestbook
// Create a new guestbook message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { guestId, eventId, type, content, url } = body

    if (!guestId || !eventId || !type) {
      return NextResponse.json(
        { error: 'Missing required fields: guestId, eventId, type' },
        { status: 400 }
      )
    }

    // Verify guest belongs to event
    const guest = await prisma.guest.findFirst({
      where: { id: guestId, eventId }
    })

    if (!guest) {
      return NextResponse.json(
        { error: 'Guest not found for this event' },
        { status: 404 }
      )
    }

    // Create message
    const message = await prisma.guestbookMessage.create({
      data: {
        guestId,
        type,
        content: content || '',
        url: url || null
      },
      include: {
        guest: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json({ message }, { status: 201 })
  } catch (error) {
    console.error('Guestbook creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create guestbook message' },
      { status: 500 }
    )
  }
}

// GET /api/guestbook?eventId=xxx
// Get all guestbook messages for an event
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const eventId = searchParams.get('eventId')

    if (!eventId) {
      return NextResponse.json(
        { error: 'Event ID required' },
        { status: 400 }
      )
    }

    const messages = await prisma.guestbookMessage.findMany({
      where: {
        guest: {
          eventId
        }
      },
      include: {
        guest: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ messages })
  } catch (error) {
    console.error('Guestbook fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch guestbook messages' },
      { status: 500 }
    )
  }
}
