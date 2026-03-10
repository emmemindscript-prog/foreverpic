import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export const dynamic = 'force-dynamic'

const prisma = new PrismaClient()

// GET /api/rsvp/stats?eventId=xxx
// Get RSVP statistics for an event
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

    // Get total guests
    const totalGuests = await prisma.guest.count({
      where: { eventId }
    })

    // Get RSVP stats by status
    const rsvpStats = await prisma.rSVPCard.groupBy({
      by: ['status'],
      where: { eventId },
      _count: {
        status: true
      },
      _sum: {
        plusOnes: true
      }
    })

    // Format stats
    const stats = {
      totalGuests,
      totalInvited: 0,
      attending: 0,
      notAttending: 0,
      maybe: 0,
      noResponse: 0,
      pending: 0,
      totalPlusOnes: 0,
      totalAttendees: 0
    }

    rsvpStats.forEach((stat: any) => {
      const count = stat._count.status
      const plusOnes = stat._sum.plusOnes || 0

      switch (stat.status) {
        case 'ATTENDING':
          stats.attending = count
          stats.totalPlusOnes += plusOnes
          stats.totalAttendees = count + plusOnes
          break
        case 'NOT_ATTENDING':
          stats.notAttending = count
          break
        case 'MAYBE':
          stats.maybe = count
          break
        case 'NO_RESPONSE':
          stats.noResponse = count
          break
        case 'PENDING':
          stats.pending = count
          break
      }

      stats.totalInvited += count
    })

    // Calculate response rate
    const respondedCount = stats.attending + stats.notAttending + stats.maybe
    stats.responseRate = totalGuests > 0 
      ? Math.round((respondedCount / totalGuests) * 100) 
      : 0

    // Get recent RSVPs
    const recentRSVPs = await prisma.rSVPCard.findMany({
      where: { eventId },
      orderBy: { respondedAt: 'desc' },
      take: 10,
      include: {
        guest: true
      }
    })

    // Get guests without RSVP (need invitation)
    const pendingGuests = await prisma.guest.findMany({
      where: {
        eventId,
        rsvp: null
      },
      select: {
        id: true,
        name: true,
        email: true
      }
    })

    return NextResponse.json({
      stats,
      recentRSVPs,
      pendingGuests,
      summary: {
        invited: stats.totalInvited,
        responded: respondedCount,
        attending: stats.totalAttendees,
        pendingInvites: pendingGuests.length
      }
    })
  } catch (error) {
    console.error('RSVP stats error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
