import Link from 'next/link'
import { cn } from '@/lib/utils'

export function ViewToggle({ basePath, view, project }: { basePath: string; view: 'category' | 'latest'; project?: string }) {
  const items = [
    { value: 'category' as const, label: '주제별' },
    { value: 'latest' as const, label: '최신순' }
  ]
  return (
    <div className="mt-6 inline-flex rounded-md border border-border bg-card p-1">
      {items.map((item) => (
        <Link
          key={item.value}
          href={`${basePath}?view=${item.value}${project ? `&project=${encodeURIComponent(project)}` : ''}`}
          className={cn(
            'rounded-sm px-3 py-1.5 text-sm font-medium transition-colors',
            view === item.value ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'
          )}
        >
          {item.label}
        </Link>
      ))}
    </div>
  )
}
