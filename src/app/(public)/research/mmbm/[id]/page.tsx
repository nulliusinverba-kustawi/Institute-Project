import { cache } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ExternalLink } from 'lucide-react'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { buildMetadata } from '@/lib/metadata'
import { DetailPageShell } from '@/components/shared/DetailPageShell'
import type { ResearchItemType } from '@/types'

interface Props { params: Promise<{ id: string }> }

const getPost = cache(async (id: string) => {
  const supabase = await createClient()
  const { data } = await supabase
    .from('research_posts')
    .select('*')
    .eq('id', id)
    .eq('published', true)
    .eq('category', 'mmbm')
    .single()
  return data ?? null
})

function ctaLabel(itemType: ResearchItemType | null): string {
  if (itemType === 'article') return 'Read Article'
  if (itemType === 'book')    return 'Find this Book'
  if (itemType === 'video')   return 'Watch Video'
  return 'View Source'
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const post = await getPost(id)
  if (!post) return buildMetadata({ noIndex: true })
  const supabase = await createClient()
  const imageUrl = post.cover_path
    ? supabase.storage.from('institute-media').getPublicUrl(post.cover_path).data.publicUrl
    : null
  return buildMetadata({ title: post.title, description: post.excerpt ?? undefined, imageUrl })
}

export default async function MmbmDetailPage({ params }: Props) {
  const { id } = await params
  const post = await getPost(id)
  if (!post) notFound()

  const supabase = await createClient()
  const coverUrl = post.cover_path
    ? supabase.storage.from('institute-media').getPublicUrl(post.cover_path).data.publicUrl
    : null

  return (
    <DetailPageShell className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      <Link
        href="/research/mmbm"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-brand-teal)] dark:hover:text-white transition-colors"
      >
        ← Back to MMBM
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_220px] gap-10 items-start">
        <div className="space-y-6 min-w-0">
          <div className="space-y-2">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] dark:text-white leading-tight">
              {post.title}
            </h1>
            {post.author && (
              <p className="text-lg text-[var(--color-text-muted)]">{post.author}</p>
            )}
          </div>
          <div
            className="tiptap-content"
            dangerouslySetInnerHTML={{ __html: post.content ?? '' }}
          />
        </div>

        <aside className="space-y-5 sticky top-24">
          {coverUrl && (
            <div className="relative w-full rounded-xl overflow-hidden shadow-md bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface-hover)]" style={{ aspectRatio: '3/4' }}>
              <Image
                src={coverUrl}
                alt={post.title}
                fill
                priority
                className="object-contain"
                sizes="220px"
              />
            </div>
          )}
          {post.external_url && (
            <a
              href={post.external_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-[var(--color-brand-teal)] hover:bg-[var(--color-brand-teal-dark)] text-white text-sm font-medium transition-colors duration-200"
            >
              <ExternalLink className="w-4 h-4" />
              {ctaLabel(post.item_type as ResearchItemType | null)}
            </a>
          )}
        </aside>
      </div>
    </DetailPageShell>
  )
}
