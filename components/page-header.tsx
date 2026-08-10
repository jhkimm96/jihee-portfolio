import { Inbox } from 'lucide-react'

export function PageHeader({
  title,
  description,
  count
}: {
  title: string
  description?: string
  count?: number
}) {
  return (
    <div className="space-y-3 border-b border-border pb-7">
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
        <h1 className="text-3xl font-bold tracking-[-0.02em] text-balance sm:text-4xl">{title}</h1>
        {typeof count === 'number' ? (
          <span className="font-mono text-sm tabular-nums text-muted-foreground">{count} entries</span>
        ) : null}
      </div>
      {description ? (
        <p className="max-w-[62ch] text-[0.95rem] leading-relaxed text-muted-foreground text-pretty">{description}</p>
      ) : null}
    </div>
  )
}

export function EmptyState({ message, action }: { message: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border bg-muted/25 px-6 py-16 text-center">
      <span
        className="flex size-11 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground shadow-e1"
        aria-hidden="true"
      >
        <Inbox className="size-5" />
      </span>
      <p className="max-w-[42ch] text-sm leading-relaxed text-muted-foreground text-pretty">{message}</p>
      {action}
    </div>
  )
}
