'use client'

import { useRef, useEffect } from 'react'
import ResearchCategorySection, { type ResearchSectionItem } from '@/components/research/ResearchCategorySection'

export default function CurrentIssuesClient({
  mmbmItems,
  racialProfilingItems,
  initialSection,
}: {
  mmbmItems: ResearchSectionItem[]
  racialProfilingItems: ResearchSectionItem[]
  initialSection: 'mmbm' | 'racial-profiling' | null
}) {
  const mmbmRef = useRef<HTMLDivElement>(null)
  const racialProfilingRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (initialSection === 'mmbm') {
      mmbmRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else if (initialSection === 'racial-profiling') {
      racialProfilingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="space-y-6">
      <div ref={mmbmRef}>
        <ResearchCategorySection
          title="MMBM"
          items={mmbmItems}
          defaultOpen={initialSection === 'mmbm' || initialSection === null}
        />
      </div>
      <div ref={racialProfilingRef}>
        <ResearchCategorySection
          title="Racial Profiling"
          items={racialProfilingItems}
          defaultOpen={initialSection === 'racial-profiling' || initialSection === null}
        />
      </div>
    </div>
  )
}
