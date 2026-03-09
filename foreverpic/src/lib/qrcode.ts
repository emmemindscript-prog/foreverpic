import QRCode from 'qrcode'

export interface QRCodeResult {
  success: boolean
  qrCode?: string
  error?: string
}

/**
 * Generate QR code for event or gallery
 */
export async function generateQRCode(
  data: string
): Promise<QRCodeResult> {
  try {
    const qrCode = await QRCode.toDataURL(data, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    })
    return { success: true, qrCode }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to generate QR code' }
  }
}

/**
 * Generate unique QR code ID for event
 */
export function generateEventQRCodeId(): string {
  return `evt-${Date.now()}-${Math.random().toString(36).substring(7)}`
}

/**
 * Generate unique QR code ID for gallery
 */
export function generateGalleryQRCodeId(): string {
  return `gal-${Date.now()}-${Math.random().toString(36).substring(7)}`
}

/**
 * Build scan URL for QR code
 */
export function buildScanUrl(qrCodeId: string, baseUrl: string): string {
  return `${baseUrl}/scan/${qrCodeId}`
}

/**
 * Shorten URL (placeholder - would need URL shortener service)
 */
export function shortenUrl(url: string): string {
  // TODO: Implement URL shortening service (tinyurl, bitly, or custom)
  return url
}
