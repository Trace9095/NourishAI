import { createOGImage, ogSize, ogContentType } from '@/lib/og-image'

export const runtime = 'edge'
export const alt = 'About — NourishAI'
export const size = ogSize
export const contentType = ogContentType

export default function OGImage() {
  return createOGImage({
    title: 'About NourishAI',
    subtitle: 'AI-powered nutrition tracking built by Epic AI.',
  })
}
