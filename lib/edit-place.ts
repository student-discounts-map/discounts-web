import type { Category } from '@/lib/places'

export type PlaceFormValues = {
  name: string
  category: Category
  address: string
  website: string
  discount: number
  conditions: string
  photos: { url: string; name: string }[]
}

export const EDITABLE_PLACES: Record<string, PlaceFormValues> = {
  '1': {
    name: 'Кофейня №1',
    category: 'food',
    address: 'ул. Маросейка, 7/8',
    website: 'vk.com/coffee_no1',
    discount: 15,
    conditions: 'Скидка по студенческому билету на все напитки и выпечку. Пн–Пт с 8:00 до 16:00, не суммируется с другими акциями.',
    photos: [{ url: '/images/edit-place/coffee-1.png', name: 'coffee-1.png' }],
  },
}

const PENDING_KEY = 'pending_places'

function readPending(): Record<string, unknown>[] {
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(PENDING_KEY) ?? '[]')
    return Array.isArray(parsed) ? parsed.filter((item) => item && typeof item === 'object') : []
  } catch {
    return []
  }
}

export function savePendingEdit(placeId: string, formData: FormData) {
  const text = (key: string) => String(formData.get(key) ?? '').trim()
  const entryId = `edit_${placeId}`

  const entry = {
    id: entryId,
    placeId,
    type: 'edit',
    name: text('name'),
    category: text('category'),
    address: text('address'),
    website: text('website'),
    discount: Number(text('discount')),
    conditions: text('conditions'),
    photoCount: Number(text('photoCount')),
    submittedAt: new Date().toISOString(),
  }

  const pending = readPending().filter((item) => item.id !== entryId)
  window.localStorage.setItem(PENDING_KEY, JSON.stringify([...pending, entry]))
}
