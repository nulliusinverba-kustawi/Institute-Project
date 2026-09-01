'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { ArrowLeft, MoreVertical, Trash2, FileText, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import PublishToggle from '@/components/shared/PublishToggle'
import ImageUpload from '@/components/shared/ImageUpload'
import ImageFitToggle from '@/components/shared/ImageFitToggle'
import RichTextEditor from '@/components/shared/RichTextEditor'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import { updateResearchPost, toggleResearchPublished, deleteResearchPost } from '@/actions/research'
import { slugify, formatDate } from '@/lib/utils'
import { RESEARCH_CATEGORIES, RESEARCH_CATEGORY_LABELS, ITEM_TYPE_LABELS } from '@/types'
import type { ResearchPost, ResearchCategory, ResearchItemType } from '@/types'

const EXCERPT_MAX = 300
const AUTOSAVE_MS = 2000

interface ResearchEditorProps {
  post: ResearchPost
  initialCoverUrl?: string
}

export default function ResearchEditor({ post, initialCoverUrl }: ResearchEditorProps) {
  const router = useRouter()

  const [title, setTitle]         = useState(post.title)
  const [slug, setSlug]           = useState(post.slug)
  const [excerpt, setExcerpt]     = useState(post.excerpt ?? '')
  const [content, setContent]     = useState(post.content)
  const [category, setCategory]       = useState<ResearchCategory>(post.category)
  const [externalUrl, setExternalUrl] = useState(post.external_url ?? '')
  const [region, setRegion]           = useState<'canadian' | 'world' | ''>(post.region ?? '')
  const [author, setAuthor]           = useState(post.author ?? '')
  const [itemType, setItemType]       = useState<ResearchItemType | ''>(post.item_type ?? '')
  const [email, setEmail]             = useState(post.email ?? '')
  const [coverPath, setCoverPath]     = useState<string | null>(post.cover_path)
  const [coverUrl, setCoverUrl]       = useState<string | undefined>(initialCoverUrl)
  const [imageFit, setImageFit]       = useState<'cover' | 'contain'>(post.image_fit ?? 'cover')
  const [docPath, setDocPath]         = useState<string | null>(post.doc_path)
  const [docName, setDocName]         = useState<string>('')
  const [docUploading, setDocUploading] = useState(false)
  const [published, setPublished]     = useState(post.published)

  const [saving, setSaving]         = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [deleting, setDeleting]     = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [slugManual, setSlugManual]   = useState(false)

  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isDirty = useRef(false)

  const adminHref = `/admin/research?tab=${post.category}`
  const showEmail = category === 'announcements' || category === 'call-for-papers'
  const showDoc   = category === 'announcements' || category === 'call-for-papers'

  async function uploadDoc(file: File) {
    setDocUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'research/docs')
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const json = await res.json()
      if (!res.ok) { toast.error(json.error ?? 'Upload failed.'); return }
      setDocPath(json.path)
      setDocName(file.name)
      await updateResearchPost(post.id, { doc_path: json.path })
      toast.success('Document uploaded.')
    } catch {
      toast.error('Upload failed.')
    } finally {
      setDocUploading(false)
    }
  }

  function handleDocUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) uploadDoc(file)
    e.target.value = ''
  }

  function handleDocDrop(e: React.DragEvent<HTMLElement>) {
    e.preventDefault()
    if (docUploading) return
    const file = e.dataTransfer.files?.[0]
    if (file) uploadDoc(file)
  }

  async function handleDocRemove() {
    setDocPath(null)
    setDocName('')
    await updateResearchPost(post.id, { doc_path: null })
    toast.success('Document removed.')
  }

  function scheduleAutosave() {
    isDirty.current = true
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current)
    autosaveTimer.current = setTimeout(async () => {
      if (!isDirty.current) return
      await updateResearchPost(post.id, { title, slug, excerpt: excerpt || null, content, cover_path: coverPath, image_fit: imageFit, doc_path: docPath, category, external_url: externalUrl.trim() || null, region: region || null, author: author.trim() || null, item_type: itemType || null, email: email.trim() || null })
      isDirty.current = false
    }, AUTOSAVE_MS)
  }

  useEffect(() => () => { if (autosaveTimer.current) clearTimeout(autosaveTimer.current) }, [])

  function handleTitleChange(val: string) {
    setTitle(val)
    if (!slugManual) setSlug(slugify(val))
    scheduleAutosave()
  }

  function handleSlugChange(val: string) {
    setSlugManual(true)
    setSlug(val)
    scheduleAutosave()
  }

  function handleCategoryChange(val: ResearchCategory) {
    setCategory(val)
    updateResearchPost(post.id, { category: val })
  }

  const handleContentChange = useCallback((html: string) => {
    setContent(html)
    scheduleAutosave()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleCoverUpload(url: string, path: string) {
    setCoverUrl(url)
    setCoverPath(path)
    updateResearchPost(post.id, { cover_path: path }).then((r) => {
      if (!r.success) toast.error(r.error ?? 'Failed to save cover image.')
    })
  }

  async function handleSave() {
    setSaving(true)
    const result = await updateResearchPost(post.id, { title, slug, excerpt: excerpt || null, content, cover_path: coverPath, image_fit: imageFit, doc_path: docPath, category, external_url: externalUrl.trim() || null, region: region || null, author: author.trim() || null, item_type: itemType || null, email: email.trim() || null })
    setSaving(false)
    if (!result.success) { toast.error(result.error ?? 'Save failed.'); return }
    isDirty.current = false
    toast.success('Saved.')
  }

  async function handleTogglePublish() {
    setPublishing(true)
    const next = !published
    const result = await toggleResearchPublished(post.id, next)
    setPublishing(false)
    if (!result.success) { toast.error(result.error ?? 'Failed to update publish state.'); return }
    setPublished(next)
    toast.success(next ? 'Post published.' : 'Post unpublished.')
  }

  async function handleDelete() {
    setDeleting(true)
    const result = await deleteResearchPost(post.id)
    setDeleting(false)
    if (!result.success) { toast.error(result.error ?? 'Delete failed.'); return }
    toast.success('Post deleted.')
    router.push(adminHref)
  }

  return (
    <>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-3">
          <Link
            href={adminHref}
            className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-brand-teal)] transition-colors"
          >
            <ArrowLeft size={15} /> All Posts
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleSave} disabled={saving} className="cursor-pointer">
              {saving ? 'Saving…' : 'Save'}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger className="p-2 rounded-md border border-[var(--color-border)] dark:border-[var(--color-dark-border)] hover:bg-[var(--color-surface-hover)] dark:hover:bg-[var(--color-dark-surface-hover)] transition-colors cursor-pointer">
                <MoreVertical size={16} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="cursor-pointer gap-2 text-destructive focus:text-destructive"
                  onClick={() => setConfirmOpen(true)}
                >
                  <Trash2 size={14} /> Delete post
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Post title"
                className="text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="post-slug"
                className="font-mono text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">
                Excerpt{' '}
                <span className="text-[var(--color-text-muted)] font-normal text-xs">
                  ({excerpt.length}/{EXCERPT_MAX})
                </span>
              </Label>
              <Textarea
                id="excerpt"
                rows={3}
                maxLength={EXCERPT_MAX}
                value={excerpt}
                onChange={(e) => { setExcerpt(e.target.value); scheduleAutosave() }}
                placeholder="Short description shown on the list page…"
              />
            </div>

            <div className="space-y-2">
              <Label>Body</Label>
              <div className="rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] overflow-hidden">
                <RichTextEditor
                  content={content}
                  onChange={handleContentChange}
                  folder="research/inline"
                  placeholder="Start writing…"
                />
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] p-4 space-y-3">
              <p className="text-sm font-semibold text-[var(--color-text-primary)] dark:text-white">
                Cover Image
              </p>
              <ImageUpload
                currentUrl={coverUrl}
                fit={imageFit}
                folder="research/covers"
                onUpload={handleCoverUpload}
                onRemove={() => { setCoverUrl(undefined); setCoverPath(null); updateResearchPost(post.id, { cover_path: null }) }}
                accept="image/jpeg,image/png,image/webp,image/svg+xml,image/avif"
              />
              <ImageFitToggle
                value={imageFit}
                onChange={(val) => {
                  setImageFit(val)
                  updateResearchPost(post.id, { image_fit: val }).then((r) => {
                    if (!r.success) toast.error(r.error ?? 'Failed to save image fit.')
                  })
                }}
              />
            </div>

            {/* Downloadable Document — Call for Participants / Call for Papers only */}
            {showDoc && (
              <div className="rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] p-4 space-y-3">
                <p className="text-sm font-semibold text-[var(--color-text-primary)] dark:text-white">
                  Downloadable Document
                </p>
                <p className="text-xs text-[var(--color-text-muted)]">
                  Optional PDF, DOC, DOCX, or image (JPG, PNG, WebP, AVIF) that visitors can download from this post. Max 20 MB.
                </p>

                {docPath ? (
                  <div
                    className="flex items-center gap-2 rounded-lg bg-[var(--color-background)] dark:bg-[var(--color-dark-background)] px-3 py-2"
                    onDrop={handleDocDrop}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    <FileText size={16} className="text-[var(--color-brand-teal)] shrink-0" />
                    <span className="text-xs text-[var(--color-text-primary)] dark:text-white truncate flex-1">
                      {docName || docPath.split('/').pop()}
                    </span>
                    <button
                      onClick={handleDocRemove}
                      className="text-[var(--color-text-muted)] hover:text-destructive transition-colors cursor-pointer shrink-0"
                      aria-label="Remove document"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <label
                    className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-[var(--color-border)] dark:border-[var(--color-dark-border)] p-4 cursor-pointer hover:border-[var(--color-brand-teal)] transition-colors"
                    onDrop={handleDocDrop}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    <FileText size={20} className="text-[var(--color-text-muted)]" />
                    <span className="text-xs text-[var(--color-text-muted)]">
                      {docUploading ? 'Uploading…' : 'Click or drag a file to upload — PDF, DOC, DOCX, or image'}
                    </span>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg,image/png,image/webp,image/avif"
                      className="sr-only"
                      onChange={handleDocUpload}
                      disabled={docUploading}
                    />
                  </label>
                )}
              </div>
            )}

            <div className="rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] p-4 space-y-3">
              <p className="text-sm font-semibold text-[var(--color-text-primary)] dark:text-white">
                Status
              </p>
              <PublishToggle
                published={published}
                loading={publishing}
                onChange={handleTogglePublish}
              />
              {post.published_at && (
                <p className="text-xs text-[var(--color-text-muted)]">
                  Published {formatDate(post.published_at)}
                </p>
              )}
            </div>

            <div className="rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] p-4 space-y-3">
              <p className="text-sm font-semibold text-[var(--color-text-primary)] dark:text-white">
                Category
              </p>
              <select
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value as ResearchCategory)}
                className="w-full h-9 px-3 text-sm rounded-lg border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-background)] dark:bg-[var(--color-dark-surface)] text-[var(--color-text-primary)] dark:text-[#e8ecec] focus:outline-none focus:border-[var(--color-brand-teal)] transition-colors cursor-pointer"
              >
                {RESEARCH_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{RESEARCH_CATEGORY_LABELS[cat]}</option>
                ))}
              </select>
            </div>

            {/* External URL */}
            <div className="rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] p-4 space-y-3">
              <p className="text-sm font-semibold text-[var(--color-text-primary)] dark:text-white">
                External URL
              </p>
              <Input
                type="url"
                value={externalUrl}
                onChange={(e) => { setExternalUrl(e.target.value); scheduleAutosave() }}
                placeholder="https://..."
                className="text-sm border-[var(--color-border)] dark:border-[var(--color-dark-border)]"
              />
              <p className="text-xs text-[var(--color-text-muted)]">
                Link to an external website, paper, or call announcement.
              </p>
            </div>

            {/* Region */}
            <div className="rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] p-4 space-y-3">
              <p className="text-sm font-semibold text-[var(--color-text-primary)] dark:text-white">
                Region
              </p>
              <select
                value={region}
                onChange={(e) => { setRegion(e.target.value as 'canadian' | 'world' | ''); scheduleAutosave() }}
                className="w-full h-9 px-3 text-sm rounded-lg border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-background)] dark:bg-[var(--color-dark-surface)] text-[var(--color-text-primary)] dark:text-[#e8ecec] focus:outline-none focus:border-[var(--color-brand-teal)] transition-colors cursor-pointer"
              >
                <option value="">— None —</option>
                <option value="canadian">Canadian</option>
                <option value="world">International</option>
              </select>
            </div>

            {/* Author */}
            <div className="rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] p-4 space-y-3">
              <p className="text-sm font-semibold text-[var(--color-text-primary)] dark:text-white">
                Author
              </p>
              <Input
                value={author}
                onChange={(e) => { setAuthor(e.target.value); scheduleAutosave() }}
                placeholder="Author name"
                className="text-sm border-[var(--color-border)] dark:border-[var(--color-dark-border)]"
              />
            </div>

            {/* Item Type */}
            <div className="rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] p-4 space-y-3">
              <p className="text-sm font-semibold text-[var(--color-text-primary)] dark:text-white">
                Item Type
              </p>
              <select
                value={itemType}
                onChange={(e) => { setItemType(e.target.value as ResearchItemType | ''); scheduleAutosave() }}
                className="w-full h-9 px-3 text-sm rounded-lg border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-background)] dark:bg-[var(--color-dark-surface)] text-[var(--color-text-primary)] dark:text-[#e8ecec] focus:outline-none focus:border-[var(--color-brand-teal)] transition-colors cursor-pointer"
              >
                <option value="">— None —</option>
                {(Object.entries(ITEM_TYPE_LABELS) as [ResearchItemType, string][]).map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
              {(category === 'sexual-abuse-boys-men' || category === 'mmbm' || category === 'racial-profiling') && (
                <p className="text-xs text-[var(--color-text-muted)]">
                  Link to the full paper, book listing, or video using External URL above.
                </p>
              )}
            </div>

            {/* Email — Call for Participants / Call for Papers only */}
            {showEmail && (
              <div className="rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] p-4 space-y-3">
                <p className="text-sm font-semibold text-[var(--color-text-primary)] dark:text-white">
                  Email
                </p>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); scheduleAutosave() }}
                  placeholder="contact@example.com"
                  className="text-sm border-[var(--color-border)] dark:border-[var(--color-dark-border)]"
                />
                <p className="text-xs text-[var(--color-text-muted)]">
                  Contact email shown on the public post for this opportunity.
                </p>
              </div>
            )}

          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete this post?"
        description="This action cannot be undone. The post and its content will be permanently removed."
        loading={deleting}
        onConfirm={handleDelete}
      />
    </>
  )
}
