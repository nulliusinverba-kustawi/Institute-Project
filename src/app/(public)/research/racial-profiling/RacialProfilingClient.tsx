'use client'

import { useState, useMemo } from 'react'
import ResearchSourceRows from '@/components/research/ResearchSourceRows'
import Pagination from '@/components/shared/Pagination'
import { ITEM_TYPE_LABELS } from '@/types'
import type { ResearchItemType } from '@/types'
import type { ResearchSourceRowProps } from '@/components/research/ResearchSourceRow'

const PAGE_SIZE = 16

export interface RacialProfilingItem extends ResearchSourceRowProps {
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

export default function RacialProfilingClient({ items }: { items: RacialProfilingItem[] }) {
  const [sort, setSort]             = useState<SortOption>('az')
  const [authorFilter, setAuthorFilter] = useState('all')
  const [typeFilter, setTypeFilter]     = useState<TypeFilter>('all')
  const [page, setPage]             = useState(1)

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
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Sort */}
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

        {/* Author filter — only shown when 2+ distinct authors exist */}
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

        {/* Item Type filter */}
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

        {/* Result count */}
        <span className="ml-auto text-sm text-[var(--color-text-muted)]">
          {isFiltered
            ? `${displayed.length} of ${items.length} items`
            : `${items.length} item${items.length !== 1 ? 's' : ''}`}
        </span>
      </div>

      {/* Rows */}
      {displayed.length === 0 ? (
        <p className="text-[var(--color-text-muted)] py-8">No items match your filter.</p>
      ) : (
        <>
          <ResearchSourceRows items={paginated} />
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  )
}
