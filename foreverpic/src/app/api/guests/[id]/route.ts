import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// DELETE /api/guests/[id] - elimina ospite
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const guestId = params.id
    
    await prisma.guest.delete({
      where: { id: guestId }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting guest:', error)
    return NextResponse.json(
      { error: 'Errore nell\'eliminazione ospite' },
      { status: 500 }
    )
  }
}