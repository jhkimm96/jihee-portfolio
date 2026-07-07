export function PageHeader({
  eyebrow,
  title,
  description,
  count
}: {
  eyebrow?: string
  title: string
  description?: string
  count?: number
}) {
  return (
    <div className="space-y-3 border-b border-border pb-6">
      {eyebrow ? <p className="font-mono text-xs font-medium uppercase tracking-widest text-brand">{eyebrow}</p> : null}
      <div className="flex flex-wrap items-baseline gap-3">
        <h1 className="text-2xl font-bold tracking-tight text-balance sm:text-3xl">{title}</h1>
        {typeof count === 'number' ? <span className="font-mono text-sm text-muted-foreground">{count} entries</span> : null}
      </div>
      {description ? <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground text-pretty">{description}</p> : null}
    </div>
  )
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border py-16 text-center">
      <p className="font-mono text-sm text-muted-foreground">{message}</p>
    </div>
  )
}
