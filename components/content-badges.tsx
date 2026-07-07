import { cn } from '@/lib/utils'
import type { ProjectStatus } from '@/lib/content'

const statusConfig: Record<ProjectStatus, { label: string; dot: string; text: string }> = {
  live: {
    label: 'Live',
    dot: 'bg-status-live',
    text: 'text-status-live'
  },
  archived: {
    label: 'Archived',
    dot: 'bg-status-archived',
    text: 'text-status-archived'
  },
  'github-only': {
    label: 'GitHub Only',
    dot: 'bg-status-github',
    text: 'text-status-github'
  }
}

export function StatusBadge({ status, className }: { status: ProjectStatus; className?: string }) {
  const config = statusConfig[status]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 font-mono text-[0.7rem] font-medium',
        className
      )}
    >
      <span className={cn('size-1.5 rounded-full', config.dot)} aria-hidden />
      <span className={config.text}>{config.label}</span>
    </span>
  )
}

export function TechChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-md bg-secondary px-2 py-0.5 font-mono text-[0.7rem] font-medium text-secondary-foreground">
      {children}
    </span>
  )
}

export function TechStack({ items, max, className }: { items: string[]; max?: number; className?: string }) {
  const shown = max ? items.slice(0, max) : items
  const rest = max ? items.length - shown.length : 0
  return (
    <div className={cn('flex flex-wrap gap-1.5', className)}>
      {shown.map((item) => (
        <TechChip key={item}>{item}</TechChip>
      ))}
      {rest > 0 ? <TechChip>+{rest}</TechChip> : null}
    </div>
  )
}

export function TagList({ tags, className }: { tags?: string[]; className?: string }) {
  if (!tags || tags.length === 0) return null
  return (
    <div className={cn('flex flex-wrap gap-1.5', className)}>
      {tags.map((tag) => (
        <span key={tag} className="font-mono text-[0.7rem] text-muted-foreground">
          #{tag}
        </span>
      ))}
    </div>
  )
}
