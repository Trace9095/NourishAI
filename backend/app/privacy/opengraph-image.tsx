import { createOGImage, ogSize, ogContentType } from '@/lib/og-image'

export const runtime = 'edge'
export const alt = 'Privacy Policy — NourishAI'
export const size = ogSize
export const contentType = ogContentType

export default function OGImage() {
  return createOGImage({
    title: 'Privacy Policy',
    subtitle: 'How we collect, use, and protect your information.',
  })
}
