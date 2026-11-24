'use client'

import { Dumbbell, Shirt, Ticket, UtensilsCrossed, type LucideIcon } from 'lucide-react'
import { CATEGORIES, type Category } from '@/lib/places'
import { cn } from '@/lib/utils'

const ICONS: Record<Category, LucideIcon> = {
  food: UtensilsCrossed,
  clothes: Shirt,
  fun: Ticket,
  sport: Dumbbell,
}

type CategoryFiltersProps = {
  active: Category[]
  onToggle: (category: Category) => void
}

export function CategoryFilters({ active, onToggle }: CategoryFiltersProps) {
  return (
    <div
      role="group"
      aria-label="Фильтр по категориям"
      className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] md:justify-center"
    >
      {CATEGORIES.map(({ id, label }) => {
        const Icon = ICONS[id]
        const isActive = active.includes(id)
        return (
          <button
            key={id}
            type="button"
            aria-pressed={isActive}
            onClick={() => onToggle(id)}
            className={cn(
              'flex h-9 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-medium shadow-sm backdrop-blur-md transition',
              isActive
                ? 'border-primary bg-primary text-primary-foreground shadow-primary/25'
                : 'border-border bg-card/90 text-foreground hover:border-foreground/20 hover:bg-card',
            )}
          >
            <Icon className="size-4" aria-hidden="true" />
            {label}
          </button>
        )
      })}
    </div>
  )
}
