import { getPageContent } from '@/actions/page-content'
import PageHeroEditor from '@/components/admin/PageHeroEditor'
import ResearchDescriptionsEditor from '@/components/admin/ResearchDescriptionsEditor'

export default async function ResearchPageHeroEditor() {
  const { data: sections } = await getPageContent('research')

  const title    = sections?.find((s) => s.section === 'hero_title')
  const subtitle = sections?.find((s) => s.section === 'hero_subtitle')

  const descriptions = [
    {
      section:   'announcements_description',
      label:     'Call for Participants — Description',
      value:     sections?.find((s) => s.section === 'announcements_description')?.content ?? '',
      updatedAt: sections?.find((s) => s.section === 'announcements_description')?.updated_at,
    },
    {
      section:   'call_for_papers_description',
      label:     'Call for Papers — Description',
      value:     sections?.find((s) => s.section === 'call_for_papers_description')?.content ?? '',
      updatedAt: sections?.find((s) => s.section === 'call_for_papers_description')?.updated_at,
    },
    {
      section:   'recent_publications_description',
      label:     'Recent Publications — Description',
      value:     sections?.find((s) => s.section === 'recent_publications_description')?.content ?? '',
      updatedAt: sections?.find((s) => s.section === 'recent_publications_description')?.updated_at,
    },
    {
      section:   'reports_description',
      label:     'Reports — Description',
      value:     sections?.find((s) => s.section === 'reports_description')?.content ?? '',
      updatedAt: sections?.find((s) => s.section === 'reports_description')?.updated_at,
    },
    {
      section:   'research_institutes_description',
      label:     'Research Institutes — Description',
      value:     sections?.find((s) => s.section === 'research_institutes_description')?.content ?? '',
      updatedAt: sections?.find((s) => s.section === 'research_institutes_description')?.updated_at,
    },
    {
      section:   'sexual_abuse_boys_men_description',
      label:     'Sexual Abuse of Boys and Men — Description',
      value:     sections?.find((s) => s.section === 'sexual_abuse_boys_men_description')?.content ?? '',
      updatedAt: sections?.find((s) => s.section === 'sexual_abuse_boys_men_description')?.updated_at,
    },
    {
      section:   'mmbm_description',
      label:     'MMBM — Description',
      value:     sections?.find((s) => s.section === 'mmbm_description')?.content ?? '',
      updatedAt: sections?.find((s) => s.section === 'mmbm_description')?.updated_at,
    },
    {
      section:   'racial_profiling_description',
      label:     'Racial Profiling — Description',
      value:     sections?.find((s) => s.section === 'racial_profiling_description')?.content ?? '',
      updatedAt: sections?.find((s) => s.section === 'racial_profiling_description')?.updated_at,
    },
    {
      section:   'disabilities_description',
      label:     'Disabilities — Description',
      value:     sections?.find((s) => s.section === 'disabilities_description')?.content ?? '',
      updatedAt: sections?.find((s) => s.section === 'disabilities_description')?.updated_at,
    },
    {
      section:   'sexualities_description',
      label:     'Sexualities — Description',
      value:     sections?.find((s) => s.section === 'sexualities_description')?.content ?? '',
      updatedAt: sections?.find((s) => s.section === 'sexualities_description')?.updated_at,
    },
  ]

  return (
    <div className="max-w-2xl mx-auto space-y-8 p-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] dark:text-white">
          Research Page
        </h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">
          Edit the heading, subtitle, and category descriptions shown on the public Research pages.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
          Page Heading &amp; Subtitle
        </h2>
        <PageHeroEditor
          page="research"
          initialTitle={title?.content ?? ''}
          initialSubtitle={subtitle?.content ?? ''}
          titleUpdatedAt={title?.updated_at}
          subtitleUpdatedAt={subtitle?.updated_at}
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
          Category Descriptions
        </h2>
        <p className="text-xs text-[var(--color-text-muted)]">
          Each description appears on the landing page card and at the top of the category list page.
        </p>
        <ResearchDescriptionsEditor initialDescriptions={descriptions} />
      </section>
    </div>
  )
}
