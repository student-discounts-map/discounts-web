'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { CategoryFilters } from '@/components/category-filters'
import { MyApplicationsLink } from '@/components/my-applications-link'
import { PlaceDetailsDialog } from '@/components/place-details-dialog'
import { PlacesPanel } from '@/components/places-panel'
import { SearchBar } from '@/components/search-bar'
import { VkLoginButton } from '@/components/vk-login-button'
import { PLACES, type Category } from '@/lib/places'

const DiscountMap = dynamic(() => import('@/components/discount-map'), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-muted" aria-hidden="true" />,
})

export function DiscountsApp() {
  const [query, setQuery] = useState('')
  const [activeCategories, setActiveCategories] = useState<Category[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [panelOpen, setPanelOpen] = useState(true)
  const [detailsId, setDetailsId] = useState<string | null>(null)
  const [focusNonce, setFocusNonce] = useState(0)

  const filteredPlaces = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return PLACES.filter((place) => {
      const matchesCategory = activeCategories.length === 0 || activeCategories.includes(place.category)
      const matchesQuery =
        !normalized ||
        place.name.toLowerCase().includes(normalized) ||
        place.address.toLowerCase().includes(normalized)
      return matchesCategory && matchesQuery
    })
  }, [query, activeCategories])

  const toggleCategory = (category: Category) => {
    setActiveCategories((current) =>
      current.includes(category) ? current.filter((c) => c !== category) : [...current, category],
    )
  }

  const handleSelect = (id: string) => {
    setSelectedId(id)
    setDetailsId(id)
  }

  const handleShowOnMap = (id: string) => {
    setDetailsId(null)
    setSelectedId(id)
    setFocusNonce((n) => n + 1)
    if (window.matchMedia('(max-width: 767px)').matches) setPanelOpen(false)
  }

  const detailsPlace = PLACES.find((place) => place.id === detailsId) ?? null

  return (
    <main className="relative h-dvh w-full overflow-hidden bg-muted">
      <h1 className="sr-only">СтудСкидки — карта студенческих скидок</h1>

      <div className="absolute inset-0 isolate z-0">
        <DiscountMap
          places={filteredPlaces}
          selectedId={selectedId}
          focusNonce={focusNonce}
          onSelect={handleSelect}
        />
      </div>

      <header className="pointer-events-none absolute inset-x-0 top-0 z-30 flex flex-col gap-3 p-4">
        <div className="flex items-start gap-3 md:justify-center">
          <div className="pointer-events-auto flex min-w-0 flex-1 flex-col gap-3 md:max-w-xl">
            <SearchBar value={query} onChange={setQuery} />
            <CategoryFilters active={activeCategories} onToggle={toggleCategory} />
          </div>
          <div className="pointer-events-auto flex shrink-0 items-center gap-2 md:absolute md:right-4 md:top-4">
            <Link
              href="/add"
              className="flex h-12 items-center gap-2 rounded-full border border-white/60 bg-white/85 px-3.5 text-sm font-semibold text-foreground shadow-lg shadow-foreground/5 backdrop-blur-xl transition hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 lg:px-5"
            >
              <Plus className="size-5 text-primary" aria-hidden="true" />
              <span className="sr-only lg:not-sr-only">Добавить место</span>
            </Link>
            <MyApplicationsLink />
            <VkLoginButton />
          </div>
        </div>
      </header>

      <PlacesPanel
        places={filteredPlaces}
        open={panelOpen}
        onOpenChange={setPanelOpen}
        selectedId={selectedId}
        onSelect={handleSelect}
      />

      <PlaceDetailsDialog
        place={detailsPlace}
        onClose={() => setDetailsId(null)}
        onShowOnMap={handleShowOnMap}
      />
    </main>
  )
}
