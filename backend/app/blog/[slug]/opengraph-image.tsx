import { createOGImage, ogSize, ogContentType } from '@/lib/og-image'
import { getPostBySlug } from '@/lib/blog'

export const runtime = 'edge'
export const alt = 'NourishAI Blog'
export const size = ogSize
export const contentType = ogContentType

export default async function OGImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  return createOGImage({
    title: post?.title ?? 'NourishAI Blog',
    subtitle: post ? `${post.category} - ${post.readTime} min read` : 'AI-Powered Nutrition Tracking',
    accent: '#34C759',
    pills: post
      ? post.tags.slice(0, 3).map((tag) => ({ label: tag, color: '#34C759' }))
      : undefined,
  })
}
