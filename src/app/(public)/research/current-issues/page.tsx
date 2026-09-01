import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import CurrentIssuesClient from './CurrentIssuesClient'
import { buildMetadata } from '@/lib/metadata'
import type { ResearchSectionItem } from '@/components/research/ResearchCategorySection'

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({ title: 'Current Issues — Research' })
}

interface Props {
  searchParams: Promise<{ section?: string }>
}

export default async function CurrentIssuesPage({ searchParams }: Props) {
  const [{ section }, supabase] = await Promise.all([
    searchParams,
    createClient(),
  ])
  const initialSection =
    section === 'mmbm' ? 'mmbm' :
    section === 'racial-profiling' ? 'racial-profiling' : null

  const { data } = await supabase
    .from('research_posts')
    .select('id, title, excerpt, cover_path, external_url, author, item_type, category, created_at, image_fit')
    .eq('published', true)
    .in('category', ['mmbm', 'racial-profiling'])
    .order('created_at', { ascending: false })

  function toItem(p: NonNullable<typeof data>[number]): ResearchSectionItem {
    return {
      id:                  p.id,
      href:                `/research/${p.category}/${p.id}`,
      title:               p.title,
      author:              p.author ?? '',
      description_excerpt: p.excerpt ?? '',
      cover_url:           p.cover_path
        ? supabase.storage.from('institute-media').getPublicUrl(p.cover_path).data.publicUrl
        : '',
      external_url: p.external_url ?? null,
      item_type:    p.item_type ?? null,
      created_at:   p.created_at,
      image_fit:    (p.image_fit ?? 'cover') as 'cover' | 'contain',
    }
  }

  const mmbmItems           = (data ?? []).filter((p) => p.category === 'mmbm').map(toItem)
  const racialProfilingItems = (data ?? []).filter((p) => p.category === 'racial-profiling').map(toItem)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      <header className="space-y-3">
        <Link
          href="/research"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-brand-teal)] transition-colors"
        >
          <ChevronLeft size={15} /> Research
        </Link>
        <h1 className="font-display text-4xl font-bold text-[var(--color-brand-teal)] dark:text-white">
          Current Issues
        </h1>
        <p className="text-lg text-[var(--color-text-muted)] max-w-2xl">
          Perspectives and resources on current issues affecting our community.
        </p>
      </header>

      <CurrentIssuesClient
        mmbmItems={mmbmItems}
        racialProfilingItems={racialProfilingItems}
        initialSection={initialSection}
      />
    </div>
  )
}
