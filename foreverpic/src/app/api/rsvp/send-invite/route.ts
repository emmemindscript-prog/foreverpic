import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { randomUUID } from 'crypto'

export const dynamic = 'force-dynamic'

const prisma = new PrismaClient()

// POST /api/rsvp/send-invite
// Send RSVP invitation email to a guest
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { eventId, guestId, guestEmail, guestName, adminToken } = body

    if (!eventId || !guestEmail) {
      return NextResponse.json(
        { error: 'Event ID and guest email required' },
        { status: 400 }
      )
    }

    // Verify event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId }
    })

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    // Find or create guest
    let guest = guestId 
      ? await prisma.guest.findUnique({ where: { id: guestId } })
      : await prisma.guest.findFirst({
          where: { eventId, email: guestEmail }
        })

    if (!guest) {
      guest = await prisma.guest.create({
        data: {
          eventId,
          email: guestEmail,
          name: guestName || null
        }
      })
    }

    // Generate magic link token
    const magicLinkToken = randomUUID()
    const magicLinkExpiresAt = new Date()
    magicLinkExpiresAt.setDate(magicLinkExpiresAt.getDate() + 30) // 30 days

    // Create or update RSVP card
    const rsvp = await prisma.rSVPCard.upsert({
      where: { guestId: guest.id },
      create: {
        eventId,
        guestId: guest.id,
        magicLinkToken,
        magicLinkExpiresAt,
        emailSent: true
      },
      update: {
        magicLinkToken,
        magicLinkExpiresAt,
        emailSent: true
      },
      include: {
        event: true,
        guest: true
      }
    })

    // Generate RSVP link
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const rsvpLink = `${baseUrl}/rsvp?token=${magicLinkToken}`

    // TODO: Send actual email
    // For now, we return the link in response
    // In production, integrate with Resend/SendGrid/AWS SES
    
    const emailContent = generateRSVPEmail(event, guest, rsvpLink)
    
    // Log email content for now
    console.log('RSVP Email would be sent:')
    console.log('To:', guestEmail)
    console.log('Subject:', `RSVP Invitation: ${event.title}`)
    console.log('Link:', rsvpLink)

    return NextResponse.json({
      success: true,
      rsvp,
      emailPreview: {
        to: guestEmail,
        subject: `RSVP Invitation: ${event.title}`,
        link: rsvpLink
      }
    })
  } catch (error) {
    console.error('Send invite error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

function generateRSVPEmail(event: any, guest: any, rsvpLink: string) {
  const eventDate = new Date(event.date).toLocaleDateString('it-IT', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const eventTime = new Date(event.date).toLocaleTimeString('it-IT', {
    hour: '2-digit',
    minute: '2-digit'
  })

  return {
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>RSVP Invitation</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
    .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; margin: 20px 0; }
    .event-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
    .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🎉 Sei invitato!</h1>
    <p>${event.title}</p>
  </div>
  
  <div class="content">
    <p>Ciao${guest.name ? ' ' + guest.name : ''},</p>
    
    <p>Hai ricevuto un invito speciale per un evento. Clicca il pulsante qui sotto per confermare la tua partecipazione.</p>
    
    <div class="event-details">
      <h3>📅 Dettagli Evento</h3>
      <p><strong>${event.title}</strong></p>
      <p>📆 ${eventDate}</p>
      <p>🕐 ${eventTime}</p>
      ${event.hostName ? `<p>👤 Organizzato da: ${event.hostName}</p>` : ''}
    </div>
    
    <center>
      <a href="${rsvpLink}" class="button">✓ Conferma RSVP</a>
    </center>
    
    <p style="font-size: 14px; color: #666; margin-top: 30px;">
      Oppure copia e incolla questo link nel tuo browser:<br>
      <code style="word-break: break-all;">${rsvpLink}</code>
    </p>
    
    <div class="footer">
      <p>Questo link è valido per 30 giorni.<br>
      Se non riesci a cliccare, rispondi a questa email.</p>
    </div>
  </div>
</body>
</html>
    `,
    text: `
Ciao${guest.name ? ' ' + guest.name : ''},

Sei invitato a: ${event.title}

📅 Data: ${eventDate}
🕐 Ora: ${eventTime}
${event.hostName ? `👤 Organizzato da: ${event.hostName}` : ''}

Conferma la tua partecipazione qui:
${rsvpLink}

Questo link è valido per 30 giorni.
    `.trim()
  }
}
