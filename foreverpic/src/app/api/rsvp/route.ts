import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { randomUUID } from 'crypto'

export const dynamic = 'force-dynamic'

const prisma = new PrismaClient()

// GET /api/rsvp?eventId=xxx&token=xxx
// Get RSVP details for a guest
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const eventId = searchParams.get('eventId')
    const guestId = searchParams.get('guestId')
    const token = searchParams.get('token')

    if (!eventId) {
      return NextResponse.json(
        { error: 'Event ID required' },
        { status: 400 }
      )
    }

    // If token provided, verify magic link
    if (token) {
      const rsvp = await prisma.rSVPCard.findFirst({
        where: {
          magicLinkToken: token,
          magicLinkExpiresAt: {
            gt: new Date()
          }
        },
        include: {
          event: true,
          guest: true
        }
      })

      if (!rsvp) {
        return NextResponse.json(
          { error: 'Invalid or expired link' },
          { status: 401 }
        )
      }

      return NextResponse.json({ rsvp })
    }

    // Otherwise get RSVP by event and guest
    if (!guestId) {
      return NextResponse.json(
        { error: 'Guest ID or token required' },
        { status: 400 }
      )
    }

    const rsvp = await prisma.rSVPCard.findFirst({
      where: {
        eventId,
        guestId
      },
      include: {
        event: true,
        guest: true
      }
    })

    if (!rsvp) {
      return NextResponse.json(
        { error: 'RSVP not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ rsvp })
  } catch (error) {
    console.error('RSVP GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// POST /api/rsvp
// Create or update RSVP
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      eventId,
      guestId,
      name,
      email,
      phone,
      attending,
      plusOnes,
      dietaryRequirements,
      notes,
      address
    } = body

    if (!eventId || !email) {
      return NextResponse.json(
        { error: 'Event ID and email required' },
        { status: 400 }
      )
    }

    // Find or create guest
    let guest = await prisma.guest.findFirst({
      where: {
        eventId,
        email
      }
    })

    if (!guest) {
      guest = await prisma.guest.create({
        data: {
          eventId,
          name,
          email,
          phone
        }
      })
    } else if (name || phone) {
      // Update guest info if provided
      guest = await prisma.guest.update({
        where: { id: guest.id },
        data: {
          ...(name && { name }),
          ...(phone && { phone })
        }
      })
    }

    // Calculate status
    let status = 'PENDING'
    if (attending === true) status = 'ATTENDING'
    if (attending === false) status = 'NOT_ATTENDING'

    // Create or update RSVP
    const rsvp = await prisma.rSVPCard.upsert({
      where: {
        guestId: guest.id
      },
      create: {
        eventId,
        guestId: guest.id,
        status,
        attending,
        plusOnes: plusOnes || 0,
        dietaryRequirements,
        notes,
        phone,
        address,
        respondedAt: new Date()
      },
      update: {
        status,
        attending,
        plusOnes: plusOnes || 0,
        dietaryRequirements,
        notes,
        phone,
        address,
        respondedAt: new Date()
      },
      include: {
        event: true,
        guest: true
      }
    })

    return NextResponse.json({ rsvp, success: true })
  } catch (error) {
    console.error('RSVP POST error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// PATCH /api/rsvp
// Update RSVP status (admin or guest)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { rsvpId, status, attending, adminToken } = body

    if (!rsvpId) {
      return NextResponse.json(
        { error: 'RSVP ID required' },
        { status: 400 }
      )
    }

    // TODO: Verify admin token if needed

    const updateData: any = {}
    if (status) updateData.status = status
    if (attending !== undefined) {
      updateData.attending = attending
      updateData.status = attending ? 'ATTENDING' : 'NOT_ATTENDING'
    }

    const rsvp = await prisma.rSVPCard.update({
      where: { id: rsvpId },
      data: updateData,
      include: {
        event: true,
        guest: true
      }
    })

    return NextResponse.json({ rsvp, success: true })
  } catch (error) {
    console.error('RSVP PATCH error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
