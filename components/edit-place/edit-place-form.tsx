'use client'

import { AddPlaceForm } from '@/components/add-place/add-place-form'
import { savePendingEdit, type PlaceFormValues } from '@/lib/edit-place'

export function EditPlaceForm({ placeId, initialValues }: { placeId: string; initialValues: PlaceFormValues }) {
  return <AddPlaceForm mode="edit" initialValues={initialValues} onSaved={(formData) => savePendingEdit(placeId, formData)} />
}
