'use client'

import { useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { MoreVertical, PenLine, Trash2, Plus, Microscope, Search, X } from 'lucide-react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import PublishPill from '@/components/admin/PublishPill'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { createResearchPost, deleteResearchPost, toggleResearchPublished } from '@/actions/research'
import Pagination from '@/components/shared/Pagination'
import { formatDate } from '@/lib/utils'
import { RESEARCH_CATEGORIES, RESEARCH_CATEGORY_LABELS } from '@/types'
import type { ResearchPost, ResearchCategory } from '@/types'

type StatusFilter = 'all' | 'published' | 'drafts'
type SortOrder     = 'recent' | 'oldest' | 'a-z' | 'z-a'

interface ResearchListItem extends ResearchPost {
  cover_url: string | null
}

const TABS: { category: ResearchCategory; label: string }[] = RESEARCH_CATEGORIES.map((category) => ({
  category,
  label: RESEARCH_CATEGORY_LABELS[category],
}))

const TAB_CATEGORIES = TABS.map((t) => t.category)

export default function ResearchListClient({ posts: initial }: { posts: ResearchListItem[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [posts, setPosts]       = useState(initial)
  const tabParam = searchParams.get('tab')
  const initialTab = TAB_CATEGORIES.includes(tabParam as ResearchCategory) ? (tabParam as ResearchCategory) : 'announcements'
  const [activeTab, setActiveTab]   = useState<ResearchCategory>(initialTab)
  const [query, setQuery]           = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [sortOrder, setSortOrder]       = useState<SortOrder>('recent')
  const [deleteId, setDeleteId]     = useState<string | null>(null)
  const [deleting, setDeleting]     = useState(false)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [page, setPage] = useState(1)

  const PAGE_SIZE = 20
  function resetPage() { setPage(1) }

  const tabPosts = posts.filter((p) => p.category === activeTab)
  const filtered = tabPosts.filter((p) => {
    const q = query.toLowerCase()
    const matchesQuery =
      !q ||
      p.title.toLowerCase().includes(q) ||
      (p.excerpt ?? '').toLowerCase().includes(q)
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'published' && p.published) ||
      (statusFilter === 'drafts' && !p.published)
    return matchesQuery && matchesStatus
  })

  const sorted = [...filtered].sort((a, b) => {
    if (sortOrder === 'a-z') return a.title.localeCompare(b.title)
    if (sortOrder === 'z-a') return b.title.localeCompare(a.title)
    const aDate = a.updated_at ? new Date(a.updated_at).getTime() : 0
    const bDate = b.updated_at ? new Date(b.updated_at).getTime() : 0
    if (sortOrder === 'oldest') return aDate - bDate
    return bDate - aDate
  })

  const isFiltering = query !== '' || statusFilter !== 'all'
  const totalPages = Math.ceil(sorted.length / PAGE_SIZE)
  const paginated  = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function handleTabChange(category: ResearchCategory) {
    setActiveTab(category)
    setQuery('')
    setStatusFilter('all')
    setSortOrder('recent')
    resetPage()
    router.replace(`/admin/research?tab=${category}`, { scroll: false })
  }

  async function handleNew() {
    startTransition(async () => {
      const result = await createResearchPost(activeTab)
      if (!result.success || !result.data) {
        toast.error(result.error ?? 'Could not create post.')
        return
      }
      router.push(`/admin/research/${result.data.id}`)
    })
  }

  async function handleDelete() {
    if (!deleteId) return
    setDeleting(true)
    const result = await deleteResearchPost(deleteId)
    setDeleting(false)
    setDeleteId(null)
    if (!result.success) {
      toast.error(result.error ?? 'Could not delete post.')
      return
    }
    setPosts((prev) => prev.filter((p) => p.id !== deleteId))
    toast.success('Research post deleted.')
  }

  async function handleToggle(id: string, current: boolean) {
    setTogglingId(id)
    setPosts((prev) => prev.map((p) => p.id === id ? { ...p, published: !current } : p))
    const result = await toggleResearchPublished(id, !current)
    setTogglingId(null)
    if (!result.success) {
      setPosts((prev) => prev.map((p) => p.id === id ? { ...p, published: current } : p))
      toast.error(result.error ?? 'Failed to update status.')
    }
  }

  function clearFilters() {
    setQuery('')
    setStatusFilter('all')
    setSortOrder('recent')
    setPage(1)
  }

  const tabClass = (active: boolean) =>
    `px-4 py-2 text-sm font-medium rounded-lg cursor-pointer transition-colors whitespace-nowrap ${
      active
        ? 'bg-[var(--color-brand-teal)] text-white'
        : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] dark:hover:bg-[var(--color-dark-surface-hover)]'
    }`

  const filterBtnClass = (active: boolean) =>
    `px-3 py-1.5 text-sm rounded-md cursor-pointer transition-colors ${
      active
        ? 'bg-[var(--color-brand-teal)] text-white'
        : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] dark:hover:bg-[var(--color-dark-surface-hover)]'
    }`

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold text-[var(--color-brand-teal)] dark:text-white">
            Research
          </h1>
          <Button onClick={handleNew} disabled={isPending} className="cursor-pointer bg-[var(--color-brand-teal)] hover:bg-[var(--color-brand-teal-dark)] text-white gap-1.5">
            <Plus size={16} /> New Post
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

        <div className="flex flex-col sm:flex-row flex-wrap gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-muted)] pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); resetPage() }}
              placeholder="Search by title or excerpt…"
              className="w-full sm:w-80 pl-9 pr-8 h-9 text-sm rounded-lg border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-background)] dark:bg-[var(--color-dark-surface)] text-[var(--color-text-primary)] dark:text-[#e8ecec] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand-teal)] transition-colors"
            />
            {query && (
              <button
                onClick={() => { setQuery(''); resetPage() }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="flex gap-1 p-1 rounded-lg bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] w-fit">
            {(['all', 'published', 'drafts'] as StatusFilter[]).map((f) => (
              <button key={f} onClick={() => { setStatusFilter(f); resetPage() }} className={filterBtnClass(statusFilter === f)}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          <select
            value={sortOrder}
            onChange={(e) => { setSortOrder(e.target.value as SortOrder); resetPage() }}
            className="h-9 px-3 text-sm rounded-lg border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-background)] dark:bg-[var(--color-dark-surface)] text-[var(--color-text-primary)] dark:text-[#e8ecec] focus:outline-none focus:border-[var(--color-brand-teal)] transition-colors cursor-pointer"
          >
            <option value="recent">Date Added: Newest</option>
            <option value="oldest">Date Added: Oldest</option>
            <option value="a-z">A–Z</option>
            <option value="z-a">Z–A</option>
          </select>
        </div>

        {isFiltering && (
          <p className="text-sm text-[var(--color-text-muted)] -mt-2">
            Showing {sorted.length} of {tabPosts.length} {tabPosts.length === 1 ? 'post' : 'posts'}
          </p>
        )}

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center rounded-xl border border-dashed border-[var(--color-border)] dark:border-[var(--color-dark-border)]">
            <Microscope size={32} className="text-[var(--color-text-muted)]" />
            <div>
              <p className="font-medium text-[var(--color-text-primary)] dark:text-[#e8ecec]">
                {isFiltering ? `No results${query ? ` for "${query}"` : ''}` : `No ${RESEARCH_CATEGORY_LABELS[activeTab].toLowerCase()} posts yet`}
              </p>
              <p className="text-sm text-[var(--color-text-muted)] mt-1">
                {isFiltering ? 'Try a different search or clear the filters.' : 'Create your first post in this category to get started.'}
              </p>
            </div>
            {isFiltering ? (
              <Button variant="ghost" onClick={clearFilters} className="cursor-pointer text-[var(--color-brand-teal)]">
                Clear filters
              </Button>
            ) : (
              <button onClick={handleNew} className="text-sm text-[var(--color-brand-teal)] hover:underline cursor-pointer">
                Create your first post →
              </button>
            )}
          </div>
        ) : (
          <motion.ul
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
            className="space-y-2"
          >
            {paginated.map((post) => (
              <motion.li
                key={post.id}
                variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
                className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] px-4 py-3 cursor-pointer hover:bg-[var(--color-surface-hover)] dark:hover:bg-[var(--color-dark-surface-hover)] transition-colors"
                onClick={() => router.push(`/admin/research/${post.id}`)}
              >
                {post.cover_url ? (
                  <div className="h-10 w-10 rounded-md overflow-hidden relative shrink-0">
                    <Image src={post.cover_url} alt={post.title} fill className="object-contain" sizes="40px" />
                  </div>
                ) : (
                  <div className="h-10 w-10 rounded-md bg-[var(--color-background)] dark:bg-[var(--color-dark-surface-hover)] flex items-center justify-center shrink-0">
                    <Microscope className="h-5 w-5 text-[var(--color-text-muted)]" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-[var(--color-text-primary)] dark:text-white truncate">
                    {post.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-xs text-[var(--color-text-muted)]">
                      {formatDate(post.updated_at)}
                    </span>
                  </div>
                </div>

                <div onClick={(e) => e.stopPropagation()}>
                  <PublishPill
                    published={post.published}
                    toggling={togglingId === post.id}
                    onClick={() => handleToggle(post.id, post.published)}
                  />
                </div>

                <div onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <DropdownMenuTrigger className="p-1.5 rounded-md hover:bg-[var(--color-surface-hover)] dark:hover:bg-[var(--color-dark-surface-hover)] transition-colors cursor-pointer shrink-0">
                          <MoreVertical size={16} className="text-[var(--color-text-muted)]" />
                        </DropdownMenuTrigger>
                      </TooltipTrigger>
                      <TooltipContent side="left"><p>More actions</p></TooltipContent>
                    </Tooltip>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="cursor-pointer gap-2"
                        onClick={() => router.push(`/admin/research/${post.id}`)}
                      >
                        <PenLine size={14} /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer gap-2 text-destructive focus:text-destructive"
                        onClick={() => setDeleteId(post.id)}
                      >
                        <Trash2 size={14} /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        )}

        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => { if (!open) setDeleteId(null) }}
        title="Delete research post?"
        description="This action cannot be undone. The post will be permanently removed."
        loading={deleting}
        onConfirm={handleDelete}
      />
    </>
  )
}
