'use client'

import { useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { MoreVertical, PenLine, Trash2, Plus, User, Search, X } from 'lucide-react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import PublishPill from '@/components/admin/PublishPill'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { createDirectoryEntry, deleteDirectoryEntry, toggleDirectoryEntryPublished } from '@/actions/directory'
import Pagination from '@/components/shared/Pagination'
import { DIRECTORY_CATEGORY_LABELS, DIRECTORY_HIDE_NAME, DIRECTORY_MODE_LABELS, type DirectoryCategory, type DirectoryEntry } from '@/types'

interface DirectoryListItem extends DirectoryEntry {
  photo_url: string | null
}

interface Props {
  entries: DirectoryListItem[]
}

const TABS: { category: DirectoryCategory; label: string }[] = [
  { category: 'advocate',                    label: 'Advocates' },
  { category: 'psychotherapist',             label: 'Psychotherapists' },
  { category: 'referral_agency',             label: 'Referral Agencies' },
  { category: 'black_mens_group',            label: "Black Men's Groups" },
  { category: 'youth_service_organization',  label: 'Youth Service Organizations' },
  { category: 'community_organization',      label: 'Community and Professional Organizations' },
]

type DirSortOption = 'name_az' | 'name_za' | 'newest' | 'oldest' | 'org_az' | 'org_za' | 'mode'

const DIR_SORT_LABELS: Record<DirSortOption, string> = {
  name_az: 'Name A → Z',
  name_za: 'Name Z → A',
  newest:  'Date Added: Newest',
  oldest:  'Date Added: Oldest',
  org_az:  'Organization A → Z',
  org_za:  'Organization Z → A',
  mode:    'Mode',
}

const selectClass =
  'text-sm rounded-lg border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-background)] dark:bg-[var(--color-dark-surface)] text-[var(--color-text-primary)] dark:text-[#e8ecec] px-3 h-9 cursor-pointer focus:outline-none focus:border-[var(--color-brand-teal)] transition-colors'

const TAB_CATEGORIES = TABS.map((t) => t.category)

export default function AdminDirectoryClient({ entries: initial }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [entries, setEntries] = useState(initial)
  const tabParam = searchParams.get('tab')
  const initialTab = TAB_CATEGORIES.includes(tabParam as DirectoryCategory) ? (tabParam as DirectoryCategory) : 'advocate'
  const [activeTab, setActiveTab] = useState<DirectoryCategory>(initialTab)
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<DirSortOption>('name_az')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [page, setPage] = useState(1)

  const PAGE_SIZE = 20
  function resetPage() { setPage(1) }

  const tabEntries = entries.filter((e) => e.category === activeTab)
  const filtered = tabEntries.filter((e) => {
    const q = query.toLowerCase()
    return !q || e.name.toLowerCase().includes(q) || (e.organization ?? '').toLowerCase().includes(q)
  })

  const sorted = [...filtered].sort((a, b) => {
    switch (sort) {
      case 'name_az': return a.name.localeCompare(b.name)
      case 'name_za': return b.name.localeCompare(a.name)
      case 'newest':  return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      case 'oldest':  return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      case 'org_az':  return (a.organization ?? 'zzz').localeCompare(b.organization ?? 'zzz')
      case 'org_za':  return (b.organization ?? 'zzz').localeCompare(a.organization ?? 'zzz')
      case 'mode':    return (a.mode ?? 'zzz').localeCompare(b.mode ?? 'zzz')
      default:        return 0
    }
  })

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE)
  const paginated  = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function handleNew() {
    startTransition(async () => {
      const result = await createDirectoryEntry(activeTab)
      if (!result.success || !result.data) {
        toast.error(result.error ?? 'Could not create entry.')
        return
      }
      router.push(`/admin/directory/${result.data.id}`)
    })
  }

  async function handleDelete() {
    if (!deleteId) return
    setDeleting(true)
    const result = await deleteDirectoryEntry(deleteId)
    setDeleting(false)
    setDeleteId(null)
    if (!result.success) { toast.error(result.error ?? 'Could not delete.'); return }
    setEntries((prev) => prev.filter((e) => e.id !== deleteId))
    toast.success('Entry deleted.')
  }

  function handleTabChange(category: DirectoryCategory) {
    setActiveTab(category)
    setQuery('')
    setSort('name_az')
    resetPage()
    router.replace(`/admin/directory?tab=${category}`, { scroll: false })
  }

  async function handleToggle(id: string, current: boolean) {
    setTogglingId(id)
    setEntries((prev) => prev.map((e) => e.id === id ? { ...e, published: !current } : e))
    const result = await toggleDirectoryEntryPublished(id, !current)
    setTogglingId(null)
    if (!result.success) {
      setEntries((prev) => prev.map((e) => e.id === id ? { ...e, published: current } : e))
      toast.error(result.error ?? 'Failed to update status.')
    }
  }

  const tabClass = (active: boolean) =>
    `px-4 py-2 text-sm font-medium rounded-lg cursor-pointer transition-colors ${
      active
        ? 'bg-[var(--color-brand-teal)] text-white'
        : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] dark:hover:bg-[var(--color-dark-surface-hover)]'
    }`

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold text-[var(--color-brand-teal)] dark:text-white">
            Directory
          </h1>
          <Button
            onClick={handleNew}
            disabled={isPending}
            className="cursor-pointer bg-[var(--color-brand-teal)] hover:bg-[var(--color-brand-teal-dark)] text-white gap-1.5"
          >
            <Plus className="h-4 w-4" />
            New {DIRECTORY_CATEGORY_LABELS[activeTab].slice(0, -1)}
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] overflow-x-auto">
          {TABS.map(({ category, label }) => (
            <button key={category} onClick={() => handleTabChange(category)} className={tabClass(activeTab === category)}>
              {label}
            </button>
          ))}
        </div>

        {/* Search + sort */}
        <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-muted)] pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); resetPage() }}
            placeholder="Search by name or organization…"
            className="w-full pl-9 pr-8 h-9 text-sm rounded-lg border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-background)] dark:bg-[var(--color-dark-surface)] text-[var(--color-text-primary)] dark:text-[#e8ecec] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand-teal)] transition-colors"
          />
          {query && (
            <button onClick={() => { setQuery(''); resetPage() }} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <select
          value={sort}
          onChange={(e) => { setSort(e.target.value as DirSortOption); resetPage() }}
          className={selectClass}
        >
          {(Object.keys(DIR_SORT_LABELS) as DirSortOption[]).map((key) => (
            <option key={key} value={key}>{DIR_SORT_LABELS[key]}</option>
          ))}
        </select>
        </div>

        {query && (
          <p className="text-sm text-[var(--color-text-muted)] -mt-2">
            Showing {filtered.length} of {tabEntries.length} entries
          </p>
        )}

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 rounded-xl border border-dashed border-[var(--color-border)] dark:border-[var(--color-dark-border)]">
            <div className="h-12 w-12 rounded-full bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] flex items-center justify-center">
              <User className="h-6 w-6 text-[var(--color-text-muted)]" />
            </div>
            <div className="text-center">
              <p className="font-medium text-[var(--color-text-primary)] dark:text-[#e8ecec]">
                {query ? `No results for "${query}"` : `No ${DIRECTORY_CATEGORY_LABELS[activeTab].toLowerCase()} yet`}
              </p>
              {!query && (
                <p className="text-sm text-[var(--color-text-muted)] mt-1">Add your first entry to get started.</p>
              )}
            </div>
            {!query && (
              <Button onClick={handleNew} disabled={isPending} className="cursor-pointer bg-[var(--color-brand-teal)] hover:bg-[var(--color-brand-teal-dark)] text-white gap-1.5">
                <Plus className="h-4 w-4" />
                Add entry
              </Button>
            )}
          </div>
        ) : (
          <div className="rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] overflow-hidden">
            {paginated.map((entry, i) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03, duration: 0.2 }}
                className="flex items-center gap-4 px-4 py-3 border-b last:border-b-0 border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-background)] dark:bg-[var(--color-dark-surface)] hover:bg-[var(--color-surface)] dark:hover:bg-[var(--color-dark-surface-hover)] transition-colors cursor-pointer"
                onClick={() => router.push(`/admin/directory/${entry.id}`)}
              >
                {entry.photo_url ? (
                  <div className="h-10 w-10 rounded-full overflow-hidden relative shrink-0">
                    <Image src={entry.photo_url} alt={entry.name} fill className="object-cover object-top" sizes="40px" />
                  </div>
                ) : (
                  <div className="h-10 w-10 rounded-full bg-[var(--color-brand-teal)] flex items-center justify-center shrink-0">
                    <span className="text-white text-xs font-bold uppercase">
                      {entry.name.trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join('')}
                    </span>
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[var(--color-text-primary)] dark:text-[#e8ecec] truncate">{entry.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {entry.organization && !DIRECTORY_HIDE_NAME.includes(entry.category) && (
                      <span className="text-sm text-[var(--color-text-muted)] truncate">{entry.organization}</span>
                    )}
                    {entry.mode && (
                      <span className="hidden sm:inline text-xs text-[var(--color-text-muted)]">· {DIRECTORY_MODE_LABELS[entry.mode]}</span>
                    )}
                  </div>
                </div>

                <div onClick={(e) => e.stopPropagation()}>
                  <PublishPill
                    published={entry.published}
                    toggling={togglingId === entry.id}
                    onClick={() => handleToggle(entry.id, entry.published)}
                  />
                </div>

                <div onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <DropdownMenuTrigger className="p-1 rounded cursor-pointer text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] dark:hover:text-[#e8ecec] hover:bg-[var(--color-surface-hover)] dark:hover:bg-[var(--color-dark-surface-hover)] transition-colors">
                          <MoreVertical className="h-4 w-4" />
                        </DropdownMenuTrigger>
                      </TooltipTrigger>
                      <TooltipContent side="left"><p>More actions</p></TooltipContent>
                    </Tooltip>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => router.push(`/admin/directory/${entry.id}`)} className="cursor-pointer gap-2">
                        <PenLine className="h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setDeleteId(entry.id)} className="cursor-pointer gap-2 text-red-600 focus:text-red-600">
                        <Trash2 className="h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Entry"
        description="This action cannot be undone. The entry will be permanently removed."
        onConfirm={handleDelete}
        loading={deleting}
      />
    </>
  )
}
