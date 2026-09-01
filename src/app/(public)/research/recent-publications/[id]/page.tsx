import { cache } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ExternalLink } from 'lucide-react'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import ResearchCard from '@/components/research/ResearchCard'
import { formatDate } from '@/lib/utils'
import { buildMetadata } from '@/lib/metadata'
import { DetailPageShell } from '@/components/shared/DetailPageShell'

interface Props {
  params: Promise<{ id: string }>
}

const getPost = cache(async (id: string) => {
  const supabase = await createClient()
  const { data } = await supabase
    .from('research_posts')
    .select('*')
    .eq('id', id)
    .eq('published', true)
    .eq('category', 'recent-publications')
    .single()
  return data ?? null
})

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

export default async function RecentPublicationDetailPage({ params }: Props) {
  const { id } = await params
  const post = await getPost(id)
  if (!post) notFound()

  const supabase = await createClient()

  const coverUrl = post.cover_path
    ? supabase.storage.from('institute-media').getPublicUrl(post.cover_path).data.publicUrl
    : null

  const { data: moreData } = await supabase
    .from('research_posts')
    .select('id, title, excerpt, cover_path, category, published_at, image_fit')
    .eq('published', true)
    .eq('category', 'recent-publications')
    .neq('id', post.id)
    .order('published_at', { ascending: false })
    .limit(3)

  const morePosts = (moreData ?? []).map((p) => ({
    id:           p.id,
    title:        p.title,
    excerpt:      p.excerpt,
    cover_url:    p.cover_path
      ? supabase.storage.from('institute-media').getPublicUrl(p.cover_path).data.publicUrl
      : '',
    category:     p.category as 'recent-publications',
    published_at: p.published_at,
    image_fit:    (p.image_fit ?? 'cover') as 'cover' | 'contain',
  }))

  return (
    <DetailPageShell className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      <Link
        href="/research/recent-publications"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-brand-teal)] dark:hover:text-white transition-colors"
      >
        ← Back to Recent Publications
      </Link>

      {coverUrl && (
        <div className="relative w-full rounded-2xl overflow-hidden bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface-hover)]" style={{ aspectRatio: '16/7' }}>
          <Image
            src={coverUrl}
            alt={post.title}
            fill
            priority
            className="object-contain"
            sizes="(max-width: 1024px) 100vw, 896px"
          />
        </div>
      )}

      <header className="space-y-4">
        {post.published_at && (
          <p className="text-sm text-[var(--color-text-muted)]">{formatDate(post.published_at)}</p>
        )}
        <h1 className="font-display text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] dark:text-white leading-tight">
          {post.title}
        </h1>
        {post.external_url && (
          <a
            href={post.external_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--color-brand-teal)] hover:bg-[var(--color-brand-teal-dark)] text-white text-sm font-medium transition-colors duration-200"
          >
            <ExternalLink className="w-4 h-4" />
            View Publication
          </a>
        )}
      </header>

      <div
        className="tiptap-content prose max-w-prose mx-auto"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {morePosts.length > 0 && (
        <section className="pt-10 border-t border-[var(--color-border)] dark:border-[var(--color-dark-border)] space-y-6">
          <h2 className="font-display text-2xl font-bold text-[var(--color-brand-teal)] dark:text-white">
            More Publications
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {morePosts.map((p) => (
              <ResearchCard key={p.id} {...p} />
            ))}
          </div>
        </section>
      )}
    </DetailPageShell>
  )
}
