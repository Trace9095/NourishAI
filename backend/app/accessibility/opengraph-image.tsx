import { createOGImage, ogSize, ogContentType } from '@/lib/og-image'

export const runtime = 'edge'
export const alt = 'Accessibility — NourishAI'
export const size = ogSize
export const contentType = ogContentType

export default function OGImage() {
  return createOGImage({
    title: 'Accessibility',
    subtitle: 'Our commitment to making NourishAI accessible to everyone.',
  })
}
