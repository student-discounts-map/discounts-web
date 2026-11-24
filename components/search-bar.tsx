'use client'

import { Search, X } from 'lucide-react'

type SearchBarProps = {
  value: string
  onChange: (value: string) => void
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative w-full">
      <label htmlFor="place-search" className="sr-only">
        Поиск заведений
      </label>
      <Search
        className="pointer-events-none absolute left-4 z-10 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <input
        id="place-search"
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Найти кафе, магазин или спортзал"
        autoComplete="off"
        className="h-12 w-full rounded-full border border-border bg-card/90 pl-12 pr-11 text-[15px] text-foreground shadow-lg shadow-foreground/5 backdrop-blur-md outline-none transition placeholder:text-muted-foreground focus:border-primary/50 focus:ring-4 focus:ring-primary/15 [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
          aria-label="Очистить поиск"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      )}
    </div>
  )
}
