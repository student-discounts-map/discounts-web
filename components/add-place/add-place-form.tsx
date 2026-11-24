'use client'

import Link from 'next/link'
import { CheckCircle2, Loader2, Map, Pencil, Plus, Send } from 'lucide-react'
import { startTransition, useActionState, useState, type FormEvent, type ReactNode } from 'react'
import { submitPlace, type AddPlaceField, type AddPlaceState } from '@/app/add/actions'
import { PhotoDropzone, type PhotoItem } from '@/components/add-place/photo-dropzone'
import type { PlaceFormValues } from '@/lib/edit-place'
import { CATEGORIES } from '@/lib/places'
import { cn } from '@/lib/utils'

const INITIAL_STATE: AddPlaceState = { status: 'idle' }

const inputClass =
  'h-12 w-full rounded-xl border border-foreground/10 bg-white px-4 text-base text-foreground shadow-sm transition placeholder:text-muted-foreground focus-visible:border-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15 aria-[invalid=true]:border-destructive/50 aria-[invalid=true]:ring-destructive/10'

type AddPlaceFormProps = {
  mode?: 'create' | 'edit'
  initialValues?: PlaceFormValues
  onSaved?: (formData: FormData) => void
}

function toInitialPhotos(values?: PlaceFormValues): PhotoItem[] {
  return (values?.photos ?? []).map((photo, index) => ({
    id: `initial-${index}`,
    file: new File([], photo.name, { type: 'image/png' }),
    url: photo.url,
  }))
}

export function AddPlaceForm({ mode = 'create', initialValues, onSaved }: AddPlaceFormProps) {
  const isEdit = mode === 'edit'
  const [state, formAction, pending] = useActionState(async (prev: AddPlaceState, formData: FormData) => {
    const result = await submitPlace(prev, formData)
    if (result.status === 'success') onSaved?.(formData)
    return result
  }, INITIAL_STATE)
  const [photos, setPhotos] = useState<PhotoItem[]>(() => toInitialPhotos(initialValues))
  const [formKey, setFormKey] = useState(0)

  const errors = state.status === 'error' ? state.errors : {}
  const fieldProps = (field: AddPlaceField) => ({
    'aria-invalid': Boolean(errors[field]),
    'aria-describedby': errors[field] ? `${field}-error` : undefined,
  })

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    formData.set('photoCount', String(photos.length))
    startTransition(() => formAction(formData))
  }

  if (state.status === 'success') {
    return (
      <SuccessCard
        name={state.name}
        isEdit={isEdit}
        onAddAnother={() => {
          photos.forEach((photo) => URL.revokeObjectURL(photo.url))
          setPhotos(isEdit ? toInitialPhotos(initialValues) : [])
          setFormKey((k) => k + 1)
          startTransition(() => formAction(new FormData()))
        }}
      />
    )
  }

  return (
    <form
      key={formKey}
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col gap-6 rounded-3xl border border-white/60 bg-white/85 p-5 shadow-xl shadow-foreground/5 backdrop-blur-xl sm:p-8"
    >
      <Section title="О заведении" step={1}>
        <Field id="name" label="Название" error={errors.name}>
          <input id="name" name="name" placeholder="Например, кофейня «Зерно»" maxLength={80} autoComplete="off" defaultValue={initialValues?.name} className={inputClass} {...fieldProps('name')} />
        </Field>

        <fieldset className="flex flex-col gap-2" {...fieldProps('category')}>
          <legend className="mb-2 text-sm font-semibold text-foreground">Категория</legend>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => (
              <label key={category.id} className="cursor-pointer">
                <input type="radio" name="category" value={category.id} defaultChecked={initialValues?.category === category.id} className="peer sr-only" />
                <span className="flex h-10 items-center rounded-full border border-foreground/10 bg-white px-4 text-sm font-semibold text-foreground/80 shadow-sm transition hover:border-primary/40 peer-checked:border-primary peer-checked:bg-primary peer-checked:text-primary-foreground peer-focus-visible:ring-4 peer-focus-visible:ring-primary/20">
                  {category.label}
                </span>
              </label>
            ))}
          </div>
          <FieldError id="category-error" message={errors.category} />
        </fieldset>

        <Field id="address" label="Адрес" error={errors.address}>
          <input id="address" name="address" placeholder="Улица, дом" maxLength={120} autoComplete="street-address" defaultValue={initialValues?.address} className={inputClass} {...fieldProps('address')} />
        </Field>

        <Field id="website" label="Сайт или соцсети" optional error={errors.website}>
          <input id="website" name="website" type="url" inputMode="url" placeholder="vk.com/zerno_coffee" defaultValue={initialValues?.website} className={inputClass} {...fieldProps('website')} />
        </Field>
      </Section>

      <Divider />

      <Section title="Скидка" step={2}>
        <Field id="discount" label="Размер скидки" error={errors.discount}>
          <div className="relative max-w-40">
            <input id="discount" name="discount" type="number" inputMode="numeric" min={1} max={100} placeholder="15" defaultValue={initialValues?.discount} className={cn(inputClass, 'pr-10')} {...fieldProps('discount')} />
            <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-base font-semibold text-muted-foreground" aria-hidden="true">
              %
            </span>
          </div>
        </Field>

        <Field id="conditions" label="Условия получения" hint="Что нужно показать, в какие дни и часы действует, есть ли ограничения" error={errors.conditions}>
          <textarea
            id="conditions"
            name="conditions"
            rows={4}
            maxLength={600}
            defaultValue={initialValues?.conditions}
            placeholder="Скидка по студенческому билету на всё меню, кроме бизнес-ланчей. Пн–Пт до 16:00."
            className={cn(inputClass, 'h-auto resize-none py-3 leading-relaxed')}
            {...fieldProps('conditions')}
          />
        </Field>
      </Section>

      <Divider />

      <Section title="Фотографии" step={3} description="Первое фото станет обложкой карточки на карте">
        <PhotoDropzone photos={photos} onChange={setPhotos} error={errors.photos} />
      </Section>

      <Divider />

      <div className="flex flex-col gap-2">
        <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-foreground/80">
          <input type="checkbox" name="agree" className="mt-0.5 size-5 shrink-0 rounded accent-primary" {...fieldProps('agree')} />
          Подтверждаю, что скидка действует и информация достоверна. Модератор может связаться с заведением для проверки.
        </label>
        <FieldError id="agree-error" message={errors.agree} />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="flex h-14 w-full items-center justify-center gap-2.5 rounded-2xl bg-primary text-base font-bold text-primary-foreground shadow-lg shadow-primary/30 transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30 disabled:cursor-wait disabled:opacity-80 sm:h-16 sm:text-lg"
      >
        {pending ? <Loader2 className="size-5 animate-spin" aria-hidden="true" /> : <Send className="size-5" aria-hidden="true" />}
        {pending ? 'Отправляем…' : isEdit ? 'Отправить изменения на модерацию' : 'Отправить на модерацию'}
      </button>

      {state.status === 'error' && (
        <p className="-mt-2 text-center text-sm font-medium text-destructive" role="alert">
          Проверьте отмеченные поля
        </p>
      )}
    </form>
  )
}

function Section({ title, step, description, children }: { title: string; step: number; description?: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-5" aria-labelledby={`section-${step}`}>
      <div className="flex items-center gap-3">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary" aria-hidden="true">
          {step}
        </span>
        <div>
          <h2 id={`section-${step}`} className="text-lg font-bold text-foreground">
            {title}
          </h2>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
      </div>
      {children}
    </section>
  )
}

function Field({ id, label, hint, optional, error, children }: { id: string; label: string; hint?: string; optional?: boolean; error?: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="flex items-baseline gap-2 text-sm font-semibold text-foreground">
        {label}
        {optional && <span className="text-xs font-medium text-muted-foreground">необязательно</span>}
      </label>
      {hint && <p className="-mt-1 text-sm text-muted-foreground">{hint}</p>}
      {children}
      <FieldError id={`${id}-error`} message={error} />
    </div>
  )
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p id={id} className="text-sm font-medium text-destructive">
      {message}
    </p>
  )
}

function Divider() {
  return <hr className="border-foreground/5" />
}

function SuccessCard({ name, isEdit, onAddAnother }: { name: string; isEdit: boolean; onAddAnother: () => void }) {
  return (
    <div role="status" className="flex flex-col items-center gap-4 rounded-3xl border border-white/60 bg-white/85 px-6 py-12 text-center shadow-xl shadow-foreground/5 backdrop-blur-xl">
      <span className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
        <CheckCircle2 className="size-8" aria-hidden="true" />
      </span>
      <div className="flex flex-col gap-1.5">
        <p className="text-2xl font-bold text-foreground">{isEdit ? 'Изменения отправлены' : 'Заявка отправлена'}</p>
        <p className="max-w-sm text-pretty text-muted-foreground">
          {isEdit
            ? `Проверим изменения в карточке «${name}». До одобрения на карте остаётся прежняя версия.`
            : `Проверим «${name}» и опубликуем на карте после модерации. Обычно это занимает 1–2 дня.`}
        </p>
      </div>
      <div className="mt-2 flex w-full max-w-sm flex-col gap-2 sm:flex-row">
        <Link
          href="/"
          className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-md shadow-primary/30 transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30"
        >
          <Map className="size-4" aria-hidden="true" />
          Вернуться к карте
        </Link>
        <button
          type="button"
          onClick={onAddAnother}
          className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-foreground/10 bg-white text-sm font-semibold text-foreground transition hover:bg-foreground/5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
        >
          {isEdit ? <Pencil className="size-4" aria-hidden="true" /> : <Plus className="size-4" aria-hidden="true" />}
          {isEdit ? 'Изменить ещё раз' : 'Добавить ещё'}
        </button>
      </div>
    </div>
  )
}
