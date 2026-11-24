import Image from 'next/image'
import { AlertTriangle, Inbox } from 'lucide-react'
import { CATEGORY_LABEL } from '@/lib/places'
import { formatSubmittedAt, type Submission } from '@/lib/moderation'
import { cn } from '@/lib/utils'

type SubmissionListProps = {
  items: Submission[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export function SubmissionList({ items, selectedId, onSelect }: SubmissionListProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 py-16 text-center">
        <Inbox className="size-8 text-muted-foreground/60" aria-hidden="true" />
        <p className="text-sm font-semibold text-foreground">Здесь пусто</p>
        <p className="text-sm text-muted-foreground">Заявок с таким статусом нет.</p>
      </div>
    )
  }

  return (
    <ul className="flex flex-col divide-y divide-border">
      {items.map((item) => {
        const isSelected = item.id === selectedId
        const warnings = item.checks.filter((c) => !c.ok).length
        return (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => onSelect(item.id)}
              aria-current={isSelected ? 'true' : undefined}
              className={cn(
                'relative flex w-full items-start gap-3 px-4 py-3 text-left transition-colors focus-visible:bg-muted focus-visible:outline-none',
                isSelected ? 'bg-muted' : 'hover:bg-muted/60',
              )}
            >
              {isSelected && <span className="absolute inset-y-0 left-0 w-0.5 bg-foreground" aria-hidden="true" />}
              <div className="relative size-12 shrink-0 overflow-hidden rounded-md bg-muted">
                <Image src={item.photos[0] || '/placeholder.svg'} alt="" fill sizes="48px" className="object-cover" />
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="truncate text-sm font-semibold text-foreground">{item.name}</p>
                  <span className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground">−{item.discount}%</span>
                </div>
                <p className="truncate text-xs text-muted-foreground">{item.address}</p>
                <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-mono">{item.id}</span>
                  <span aria-hidden="true">·</span>
                  <span>{CATEGORY_LABEL[item.category]}</span>
                  <span aria-hidden="true">·</span>
                  <time dateTime={item.submittedAt}>{formatSubmittedAt(item.submittedAt)}</time>
                  {warnings > 0 && (
                    <span className="ml-auto flex items-center gap-1 font-medium text-primary">
                      <AlertTriangle className="size-3.5" aria-hidden="true" />
                      {warnings}
                      <span className="sr-only"> предупреждений</span>
                    </span>
                  )}
                </div>
              </div>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
