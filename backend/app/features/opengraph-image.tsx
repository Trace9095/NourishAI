import { createOGImage, ogSize, ogContentType } from '@/lib/og-image'

export const runtime = 'edge'
export const alt = 'Features — NourishAI'
export const size = ogSize
export const contentType = ogContentType

export default function OGImage() {
  return createOGImage({
    title: 'Features',
    subtitle: 'AI food scanning, macro tracking, meal logging, and more.',
    pills: [
      { label: 'AI Scanning', color: '#34C759' },
      { label: 'Macros', color: '#FF9500' },
      { label: 'HealthKit', color: '#5AC8FA' },
    ],
  })
}
