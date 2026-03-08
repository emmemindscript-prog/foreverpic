export interface Event {
  id: string
  title: string
  date: string
  hostEmail: string
  hostName?: string
  qrCode: string
  password?: string
  theme?: any
  settings?: any
  createdAt: string
  updatedAt: string
}

export interface Gallery {
  id: string
  eventId: string
  title: string
  description?: string
  qrCode: string
  createdAt: string
  updatedAt: string
}

export interface Photo {
  id: string
  galleryId: string
  uploadedByEmail?: string
  imageUrl: string
  thumbnailUrl?: string
  description?: string
  tags?: any
  reactions?: any
  metadata?: any
  moderationStatus: string
  createdAt: string
}

export interface Guest {
  id: string
  eventId: string
  name?: string
  email?: string
  phone?: string
  rsvpStatus?: string
  createdAt: string
}

export interface GuestbookMessage {
  id: string
  guestId: string
  type: string
  content: string
  url?: string
  createdAt: string
}
