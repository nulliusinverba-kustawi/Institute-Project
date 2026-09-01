import { SkeletonReadingRow } from '@/components/shared/skeletons/SkeletonReadingRow'
import { SkeletonBox } from '@/components/shared/skeletons/SkeletonBox'

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      <div className="space-y-3">
        <SkeletonBox className="h-4 w-20" />
        <SkeletonBox className="h-10 w-72" />
        <SkeletonBox className="h-5 w-80" />
      </div>

      {/* Controls bar */}
      <div className="flex flex-wrap gap-3">
        <SkeletonBox className="h-9 w-44" />
        <SkeletonBox className="h-9 w-36" />
        <SkeletonBox className="h-9 w-36" />
      </div>

      {/* List rows */}
      <div className="rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] overflow-hidden divide-y divide-[var(--color-border)] dark:divide-[var(--color-dark-border)]">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonReadingRow key={i} />
        ))}
      </div>
    </div>
  )
}
