import { createOGImage, ogSize, ogContentType } from '@/lib/og-image'

export const runtime = 'edge'
export const alt = 'Blog — NourishAI'
export const size = ogSize
export const contentType = ogContentType

export default function OGImage() {
  return createOGImage({
    title: 'Blog',
    subtitle: 'Nutrition tips, AI insights, and healthy living guides.',
  })
}
