'use server'

import { CATEGORIES, type Category } from '@/lib/places'

export type AddPlaceField = 'name' | 'category' | 'address' | 'discount' | 'conditions' | 'website' | 'photos' | 'agree'

export type AddPlaceState =
  | { status: 'idle' }
  | { status: 'error'; errors: Partial<Record<AddPlaceField, string>> }
  | { status: 'success'; name: string }

const MAX_PHOTOS = 5

export async function submitPlace(_prev: AddPlaceState, formData: FormData): Promise<AddPlaceState> {
  const text = (key: string) => String(formData.get(key) ?? '').trim()

  const name = text('name')
  const category = text('category')
  const address = text('address')
  const discount = Number(text('discount'))
  const conditions = text('conditions')
  const website = text('website')
  const photoCount = Number(text('photoCount'))
  const agree = formData.get('agree') === 'on'

  const errors: Partial<Record<AddPlaceField, string>> = {}

  if (name.length < 2 || name.length > 80) errors.name = 'Укажите название от 2 до 80 символов'
  if (!CATEGORIES.some((c) => c.id === (category as Category))) errors.category = 'Выберите категорию'
  if (address.length < 5 || address.length > 120) errors.address = 'Укажите адрес заведения'
  if (!Number.isInteger(discount) || discount < 1 || discount > 100) errors.discount = 'Скидка — целое число от 1 до 100'
  if (conditions.length < 10 || conditions.length > 600) errors.conditions = 'Опишите условия (от 10 до 600 символов)'
  if (website) {
    try {
      const url = new URL(website.startsWith('http') ? website : `https://${website}`)
      if (!url.hostname.includes('.')) throw new Error('invalid')
    } catch {
      errors.website = 'Похоже, ссылка указана с ошибкой'
    }
  }
  if (!Number.isInteger(photoCount) || photoCount < 1 || photoCount > MAX_PHOTOS)
    errors.photos = `Добавьте от 1 до ${MAX_PHOTOS} фото`
  if (!agree) errors.agree = 'Подтвердите, что информация достоверна'

  if (Object.keys(errors).length > 0) return { status: 'error', errors }

  return { status: 'success', name }
}
