import { SkeletonBox } from '@/components/shared/skeletons/SkeletonBox'

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      <header className="space-y-3">
        <SkeletonBox className="h-4 w-20" />
        <SkeletonBox className="h-10 w-56" />
        <SkeletonBox className="h-5 w-80" />
      </header>

      <div className="space-y-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] overflow-hidden">
            <div className="flex items-center justify-between gap-3 px-5 py-4 bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)]">
              <SkeletonBox className="h-6 w-32" />
              <SkeletonBox className="h-5 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
