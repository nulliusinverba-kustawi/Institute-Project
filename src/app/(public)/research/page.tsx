import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getPublishedResearchCounts } from '@/actions/research'
import { getPageContent } from '@/actions/page-content'
import { getSiteSettings } from '@/actions/settings'
import { RESEARCH_CATEGORIES, RESEARCH_CATEGORY_LABELS } from '@/types'
import type { ResearchCategory, SiteSettings } from '@/types'
import { buildMetadata } from '@/lib/metadata'

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({ title: 'Research' })
}

const CATEGORY_SECTION_KEYS: Record<ResearchCategory, string> = {
  'announcements':         'announcements_description',
  'call-for-papers':       'call_for_papers_description',
  'recent-publications':   'recent_publications_description',
  'reports':               'reports_description',
  'research-institutes':   'research_institutes_description',
  'sexual-abuse-boys-men': 'sexual_abuse_boys_men_description',
  'mmbm':                  'mmbm_description',
  'racial-profiling':      'racial_profiling_description',
  'disabilities':          'disabilities_description',
  'sexualities':           'sexualities_description',
}

const CATEGORY_FALLBACKS: Record<ResearchCategory, string> = {
  'announcements':         'Stay up to date with the latest news, calls for submissions, and upcoming opportunities from the institute.',
  'call-for-papers':       'Submit your work and respond to active calls for papers, abstracts, and contributions.',
  'recent-publications':   'Explore recently published research, articles, and scholarly works contributed by our community.',
  'reports':               'Access in-depth reports, analyses, and findings produced by our researchers and collaborators.',
  'research-institutes':   'Discover research institutes and organizations affiliated with our work.',
  'sexual-abuse-boys-men': 'Research papers, books, and films on the sexual abuse of boys and men.',
  'mmbm':                  'Perspectives and resources on MMBM affecting our community.',
  'racial-profiling':      'Perspectives and resources on racial profiling affecting our community.',
  'disabilities':          'Research, resources, and perspectives on disabilities affecting our community.',
  'sexualities':           'Research, resources, and perspectives on sexualities affecting our community.',
}

// Categories without an entry here are always shown (no visibility toggle)
const CATEGORY_ENABLED_KEY: Partial<Record<ResearchCategory, keyof SiteSettings>> = {
  'research-institutes':   'research_institutes_enabled',
  'call-for-papers':       'call_for_papers_enabled',
  'sexual-abuse-boys-men': 'sexual_abuse_boys_men_enabled',
}

export default async function ResearchPage() {
  const [{ data: sections }, { data: counts }, { data: settings }] = await Promise.all([
    getPageContent('research'),
    getPublishedResearchCounts(),
    getSiteSettings(),
  ])

  const heroTitle    = sections?.find((s) => s.section === 'hero_title')?.content    ?? 'Research'
  const heroSubtitle = sections?.find((s) => s.section === 'hero_subtitle')?.content ?? ''

  const categories = RESEARCH_CATEGORIES.filter((cat) => {
    const key = CATEGORY_ENABLED_KEY[cat]
    return !key || settings?.[key] !== 'false'
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <header className="space-y-3">
        <h1 className="font-display text-4xl font-bold text-[var(--color-brand-teal)] dark:text-white">
          {heroTitle}
        </h1>
        {heroSubtitle && (
          <p className="text-lg text-[var(--color-text-muted)] max-w-2xl">{heroSubtitle}</p>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const count       = counts?.[cat] ?? 0
          const sectionKey  = CATEGORY_SECTION_KEYS[cat]
          const description = sections?.find((s) => s.section === sectionKey)?.content ?? CATEGORY_FALLBACKS[cat]
          return (
            <Link
              key={cat}
              href={`/research/${cat}`}
              className="group flex flex-col gap-4 p-8 rounded-2xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] hover:border-[var(--color-brand-teal)] hover:shadow-lg transition-all"
            >
              <div className="space-y-2">
                <h2 className="font-display text-2xl font-bold text-[var(--color-brand-teal)] dark:text-white group-hover:text-[var(--color-brand-teal)] transition-colors">
                  {RESEARCH_CATEGORY_LABELS[cat]}
                </h2>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed line-clamp-4">
                  {description}
                </p>
              </div>

              <div className="mt-auto flex items-center justify-between pt-4 border-t border-[var(--color-border)] dark:border-[var(--color-dark-border)]">
                <span className="text-xs text-[var(--color-text-muted)]">
                  {count} {count === 1 ? 'post' : 'posts'}
                </span>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-[var(--color-brand-teal)] group-hover:gap-2 transition-all">
                  View all <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
