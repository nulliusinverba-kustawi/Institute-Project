'use client'

import { useState, useMemo } from 'react'
import { ChevronDown } from 'lucide-react'
import ResearchSourceRows from '@/components/research/ResearchSourceRows'
import Pagination from '@/components/shared/Pagination'
import { ITEM_TYPE_LABELS } from '@/types'
import type { ResearchItemType } from '@/types'
import type { ResearchSourceRowProps } from '@/components/research/ResearchSourceRow'

const PAGE_SIZE = 16

export interface ResearchSectionItem extends ResearchSourceRowProps {
  created_at: string
  image_fit?: 'cover' | 'contain'
}

type SortOption = 'author_az' | 'author_za' | 'newest' | 'oldest' | 'az' | 'za'
type TypeFilter  = 'all' | ResearchItemType

const SORT_LABELS: Record<SortOption, string> = {
  author_az: 'Author A → Z',
  author_za: 'Author Z → A',
  newest:    'Date Added (Newest)',
  oldest:    'Date Added (Oldest)',
  az:        'Title A → Z',
  za:        'Title Z → A',
}

const selectClass =
  'text-sm rounded-lg border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-background)] dark:bg-[var(--color-dark-surface)] text-[var(--color-text-primary)] dark:text-[#e8ecec] px-3 py-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-teal)]'

export default function ResearchCategorySection({
  title,
  items,
  defaultOpen,
  collapsible = true,
}: {
  title: string
  items: ResearchSectionItem[]
  defaultOpen: boolean
  collapsible?: boolean
}) {
  const [open, setOpen]                 = useState(collapsible ? defaultOpen : true)
  const [sort, setSort]                 = useState<SortOption>('az')
  const [authorFilter, setAuthorFilter] = useState('all')
  const [typeFilter, setTypeFilter]     = useState<TypeFilter>('all')
  const [page, setPage]                 = useState(1)

  const authors = useMemo(
    () => [...new Set(items.map((i) => i.author).filter(Boolean))].sort(),
    [items],
  )

  const hasTypeData = useMemo(() => items.some((i) => i.item_type), [items])

  const displayed = useMemo(() => {
    let result = items.filter((i) => {
      if (authorFilter !== 'all' && i.author !== authorFilter) return false
      if (typeFilter !== 'all' && i.item_type !== typeFilter) return false
      return true
    })

    switch (sort) {
      case 'author_az': result = [...result].sort((a, b) => (a.author ?? '').trim().localeCompare((b.author ?? '').trim())); break
      case 'author_za': result = [...result].sort((a, b) => (b.author ?? '').trim().localeCompare((a.author ?? '').trim())); break
      case 'newest':    result = [...result].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()); break
      case 'oldest':    result = [...result].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()); break
      case 'az':        result = [...result].sort((a, b) => a.title.localeCompare(b.title)); break
      case 'za':        result = [...result].sort((a, b) => b.title.localeCompare(a.title)); break
    }

    return result
  }, [items, sort, authorFilter, typeFilter])

  const totalPages = Math.ceil(displayed.length / PAGE_SIZE)
  const paginated  = displayed.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const isFiltered = authorFilter !== 'all' || typeFilter !== 'all'

  function resetPage() { setPage(1) }

  return (
    <section className="rounded-2xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] overflow-hidden">
      <div
        onClick={collapsible ? () => setOpen((v) => !v) : undefined}
        className={`w-full flex items-center justify-between gap-3 px-5 py-4 bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] ${collapsible ? 'cursor-pointer' : ''}`}
      >
        <span className="font-display text-xl font-bold text-[var(--color-brand-teal)] dark:text-white">
          {title}
        </span>
        <span className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
          {items.length} {items.length === 1 ? 'item' : 'items'}
          {collapsible && (
            <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
          )}
        </span>
      </div>

      {open && (
        <div className="p-5 space-y-6 border-t border-[var(--color-border)] dark:border-[var(--color-dark-border)]">
          {items.length === 0 ? (
            <p className="text-[var(--color-text-muted)] py-4">No items yet — check back soon.</p>
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <label className="text-sm text-[var(--color-text-muted)] font-medium whitespace-nowrap">
                    Sort by
                  </label>
                  <select
                    value={sort}
                    onChange={(e) => { setSort(e.target.value as SortOption); resetPage() }}
                    className={selectClass}
                  >
                    {(Object.keys(SORT_LABELS) as SortOption[]).map((key) => (
                      <option key={key} value={key}>{SORT_LABELS[key]}</option>
                    ))}
                  </select>
                </div>

                {authors.length >= 2 && (
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-[var(--color-text-muted)] font-medium whitespace-nowrap">
                      Author
                    </label>
                    <select
                      value={authorFilter}
                      onChange={(e) => { setAuthorFilter(e.target.value); resetPage() }}
                      className={selectClass}
                    >
                      <option value="all">All authors</option>
                      {authors.map((author) => (
                        <option key={author} value={author}>{author}</option>
                      ))}
                    </select>
                  </div>
                )}

                {hasTypeData && (
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-[var(--color-text-muted)] font-medium whitespace-nowrap">
                      Type
                    </label>
                    <select
                      value={typeFilter}
                      onChange={(e) => { setTypeFilter(e.target.value as TypeFilter); resetPage() }}
                      className={selectClass}
                    >
                      <option value="all">All types</option>
                      {(Object.entries(ITEM_TYPE_LABELS) as [ResearchItemType, string][]).map(([val, label]) => (
                        <option key={val} value={val}>{label}</option>
                      ))}
                    </select>
                  </div>
                )}

                <span className="ml-auto text-sm text-[var(--color-text-muted)]">
                  {isFiltered
                    ? `${displayed.length} of ${items.length} items`
                    : `${items.length} item${items.length !== 1 ? 's' : ''}`}
                </span>
              </div>

              {displayed.length === 0 ? (
                <p className="text-[var(--color-text-muted)] py-8">No items match your filter.</p>
              ) : (
                <>
                  <ResearchSourceRows items={paginated} />
                  <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
                </>
              )}
            </>
          )}
        </div>
      )}
    </section>
  )
}
