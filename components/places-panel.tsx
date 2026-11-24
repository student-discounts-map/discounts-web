'use client'

import Image from 'next/image'
import { ChevronLeft, ChevronRight, MapPin, SearchX } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { CATEGORY_LABEL, type Place } from '@/lib/places'
import { cn } from '@/lib/utils'

const pluralRules = new Intl.PluralRules('ru-RU')
const PLACE_FORMS: Partial<Record<Intl.LDMLPluralRule, string>> = { one: 'место', few: 'места', many: 'мест' }

function pluralizePlaces(count: number) {
  return PLACE_FORMS[pluralRules.select(count)] ?? 'мест'
}

type PlacesPanelProps = {
  places: Place[]
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedId: string | null
  onSelect: (id: string) => void
}

export function PlacesPanel({ places, open, onOpenChange, selectedId, onSelect }: PlacesPanelProps) {
  const listRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    if (!selectedId) return
    listRef.current
      ?.querySelector(`[data-place-id="${selectedId}"]`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [selectedId])

  return (
    <aside
      aria-label="Список заведений"
      className={cn(
        'absolute bottom-4 left-4 top-36 z-20 flex w-[calc(100%-4rem)] max-w-sm transition-transform duration-300 ease-out md:top-4',
        open ? 'translate-x-0' : '-translate-x-[calc(100%+1rem)]',
      )}
    >
      <div
        id="places-panel"
        className="flex min-h-0 w-full flex-col overflow-hidden rounded-3xl border border-white/60 bg-white/70 shadow-2xl shadow-foreground/10 backdrop-blur-xl"
      >
        <div className="flex items-end justify-between px-5 pb-3 pt-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">СтудСкидки</p>
            <h2 className="text-lg font-bold text-foreground">Рядом с вами</h2>
          </div>
          <span className="rounded-full bg-foreground/5 px-2.5 py-1 text-xs font-medium text-muted-foreground">
            {places.length} {pluralizePlaces(places.length)}
          </span>
        </div>

        {places.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center">
            <SearchX className="size-8 text-muted-foreground" aria-hidden="true" />
            <p className="font-medium text-foreground">Ничего не найдено</p>
            <p className="text-sm text-muted-foreground">Попробуйте изменить запрос или фильтры</p>
          </div>
        ) : (
          <ul ref={listRef} className="flex-1 space-y-2 overflow-y-auto px-3 pb-3">
            {places.map((place) => {
              const isSelected = place.id === selectedId
              return (
                <li key={place.id} data-place-id={place.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(place.id)}
                    aria-current={isSelected ? 'true' : undefined}
                    className={cn(
                      'flex w-full gap-3 rounded-2xl p-2 text-left transition',
                      isSelected
                        ? 'bg-white shadow-md ring-2 ring-primary/60'
                        : 'hover:bg-white/80 hover:shadow-sm',
                    )}
                  >
                    <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-muted">
                      <Image
                        src={place.image || '/placeholder.svg'}
                        alt={place.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col py-0.5">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="truncate font-semibold text-foreground">{place.name}</h3>
                        <span className="shrink-0 rounded-lg bg-primary px-2 py-0.5 text-sm font-bold text-primary-foreground">
                          {place.discount}
                        </span>
                      </div>
                      <p className="mt-0.5 flex items-center gap-1 truncate text-sm text-muted-foreground">
                        <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
                        <span className="truncate">{place.address}</span>
                      </p>
                      <p className="mt-auto truncate pt-1 text-xs text-muted-foreground">
                        <span className="font-medium text-foreground/70">{CATEGORY_LABEL[place.category]}</span>
                        {' · '}
                        {place.note}
                      </p>
                    </div>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      <button
        type="button"
        onClick={() => onOpenChange(!open)}
        aria-expanded={open}
        aria-controls="places-panel"
        aria-label={open ? 'Скрыть список' : 'Показать список'}
        className="absolute -right-9 top-1/2 flex h-14 w-8 -translate-y-1/2 items-center justify-center rounded-r-2xl rounded-l-md border border-white/60 bg-white/80 text-foreground shadow-lg backdrop-blur-xl transition hover:bg-white"
      >
        {open ? <ChevronLeft className="size-5" aria-hidden="true" /> : <ChevronRight className="size-5" aria-hidden="true" />}
      </button>
    </aside>
  )
}
