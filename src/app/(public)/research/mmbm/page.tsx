import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getPageContent } from '@/actions/page-content'
import MmbmClient from './MmbmClient'
import ExpandableText from '@/components/shared/ExpandableText'
import { buildMetadata } from '@/lib/metadata'

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({ title: 'MMBM — Research' })
}

export default async function MmbmPage() {
  const [supabase, { data: sections }] = await Promise.all([
    createClient(),
    getPageContent('research'),
  ])
  const subtitle = sections?.find((s) => s.section === 'mmbm_description')?.content ?? ''

  const { data } = await supabase
    .from('research_posts')
    .select('id, title, excerpt, cover_path, external_url, author, item_type, created_at, image_fit')
    .eq('published', true)
    .eq('category', 'mmbm')
    .order('created_at', { ascending: false })

  const items = (data ?? []).map((p) => ({
    id:                  p.id,
    href:                `/research/mmbm/${p.id}`,
    title:               p.title,
    author:              p.author ?? '',
    description_excerpt: p.excerpt ?? '',
    cover_url:           p.cover_path
      ? supabase.storage.from('institute-media').getPublicUrl(p.cover_path).data.publicUrl
      : '',
    external_url:        p.external_url ?? null,
    item_type:            p.item_type ?? null,
    created_at:           p.created_at,
    image_fit:            (p.image_fit ?? 'cover') as 'cover' | 'contain',
  }))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      <header className="space-y-3">
        <Link
          href="/research/current-issues"
          className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-(--color-brand-teal) transition-colors"
        >
          <ChevronLeft size={15} /> Current Issues
        </Link>
        <h1 className="font-display text-4xl font-bold text-(--color-brand-teal) dark:text-white">
          MMBM
        </h1>
        {subtitle && (
          <ExpandableText text={subtitle} maxLength={400} className="text-lg text-text-muted max-w-2xl" />
        )}
      </header>

      {items.length === 0 ? (
        <p className="text-[var(--color-text-muted)] py-8">
          No items yet — check back soon.
        </p>
      ) : (
        <MmbmClient items={items} />
      )}
    </div>
  )
}
