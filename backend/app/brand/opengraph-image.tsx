import { createOGImage, ogSize, ogContentType } from '@/lib/og-image'

export const runtime = 'edge'
export const alt = 'Brand Assets — NourishAI'
export const size = ogSize
export const contentType = ogContentType

export default function OGImage() {
  return createOGImage({
    title: 'Brand Assets',
    subtitle: 'Logos, colors, and brand guidelines for NourishAI.',
    pills: [
      { label: 'Logos', color: '#34C759' },
      { label: 'Colors', color: '#FF9500' },
    ],
  })
}
