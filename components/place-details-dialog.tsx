'use client'

import Image from 'next/image'
import { ArrowLeft, CheckCircle2, Flag, Map, MapPin, X } from 'lucide-react'
import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { CATEGORY_LABEL, type Place } from '@/lib/places'
import { cn } from '@/lib/utils'

const REPORT_REASONS = [
  'Скидка больше не действует',
  'Неверный адрес',
  'Заведение закрыто',
  'Другое',
] as const

type View = 'details' | 'report' | 'reported'

type PlaceDetailsDialogProps = {
  place: Place | null
  onClose: () => void
  onShowOnMap: (id: string) => void
}

export function PlaceDetailsDialog({ place, onClose, onShowOnMap }: PlaceDetailsDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (place && !dialog.open) dialog.showModal()
    if (!place && dialog.open) dialog.close()
  }, [place])

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-md overflow-visible border-0 bg-transparent p-0 text-foreground backdrop:bg-foreground/30 backdrop:backdrop-blur-sm open:animate-in open:fade-in-0 open:zoom-in-95"
    >
      {place && (
        <PlaceDetailsContent
          key={place.id}
          place={place}
          titleId={titleId}
          onClose={onClose}
          onShowOnMap={onShowOnMap}
        />
      )}
    </dialog>
  )
}

type PlaceDetailsContentProps = {
  place: Place
  titleId: string
  onClose: () => void
  onShowOnMap: (id: string) => void
}

function PlaceDetailsContent({ place, titleId, onClose, onShowOnMap }: PlaceDetailsContentProps) {
  const [view, setView] = useState<View>('details')
  const [reason, setReason] = useState<string>(REPORT_REASONS[0])
  const [comment, setComment] = useState('')

  const handleReportSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setView('reported')
  }

  return (
    <div className="flex max-h-[calc(100dvh-2rem)] flex-col overflow-hidden rounded-3xl border border-white/60 bg-white/85 shadow-2xl shadow-foreground/20 backdrop-blur-xl">
      <div className="relative aspect-[16/10] w-full shrink-0 bg-muted">
        <Image
          src={place.image || '/placeholder.svg'}
          alt={place.name}
          fill
          sizes="(max-width: 480px) 100vw, 448px"
          className="object-cover"
          priority
        />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/40 to-transparent" aria-hidden="true" />
        <span className="absolute bottom-4 left-4 rounded-xl bg-primary px-3 py-1.5 text-xl font-bold text-primary-foreground shadow-lg">
          {place.discount}
        </span>
        <span className="absolute left-4 top-4 rounded-full bg-white/85 px-3 py-1 text-xs font-semibold text-foreground backdrop-blur">
          {CATEGORY_LABEL[place.category]}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Закрыть"
          className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-white/85 text-foreground shadow-md backdrop-blur transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <X className="size-5" aria-hidden="true" />
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-5">
        <h2 id={titleId} className="text-balance text-2xl font-bold leading-tight text-foreground">
          {place.name}
        </h2>
        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="size-4 shrink-0" aria-hidden="true" />
          {place.address}
        </p>

        {view === 'details' && (
          <section aria-labelledby={`${titleId}-conditions`} className="mt-5 rounded-2xl bg-foreground/[0.04] p-4">
            <h3 id={`${titleId}-conditions`} className="text-sm font-semibold text-foreground">
              Условия скидки
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">{place.note}</p>
            <ul className="mt-3 flex flex-col gap-2">
              {place.conditions.map((condition) => (
                <li key={condition} className="flex items-start gap-2 text-sm leading-relaxed text-foreground/85">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                  {condition}
                </li>
              ))}
            </ul>
          </section>
        )}

        {view === 'report' && (
          <form id={`${titleId}-report`} onSubmit={handleReportSubmit} className="mt-5 flex flex-col gap-3">
            <fieldset className="flex flex-col gap-2">
              <legend className="mb-2 text-sm font-semibold text-foreground">Что не так с этим местом?</legend>
              {REPORT_REASONS.map((option) => (
                <label
                  key={option}
                  className={cn(
                    'flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 text-sm transition',
                    reason === option
                      ? 'border-primary bg-primary/5 text-foreground'
                      : 'border-foreground/10 bg-white/60 text-foreground/80 hover:bg-white',
                  )}
                >
                  <input
                    type="radio"
                    name="reason"
                    value={option}
                    checked={reason === option}
                    onChange={() => setReason(option)}
                    className="size-4 accent-primary"
                  />
                  {option}
                </label>
              ))}
            </fieldset>
            <label className="flex flex-col gap-1.5 text-sm font-medium text-foreground">
              Комментарий <span className="sr-only">(необязательно)</span>
              <textarea
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                rows={3}
                maxLength={500}
                placeholder="Расскажите подробнее (необязательно)"
                className="resize-none rounded-xl border border-foreground/10 bg-white/70 px-3 py-2 text-sm font-normal text-foreground placeholder:text-muted-foreground focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
              />
            </label>
          </form>
        )}

        {view === 'reported' && (
          <div role="status" className="mt-5 flex flex-col items-center gap-2 rounded-2xl bg-primary/5 p-5 text-center">
            <CheckCircle2 className="size-8 text-primary" aria-hidden="true" />
            <p className="font-semibold text-foreground">Спасибо за сигнал!</p>
            <p className="text-sm text-muted-foreground">Мы проверим информацию о «{place.name}» в ближайшее время.</p>
          </div>
        )}
      </div>

      <div className="flex shrink-0 gap-2 border-t border-foreground/5 bg-white/60 p-4">
        {view === 'report' ? (
          <>
            <button
              type="button"
              onClick={() => setView('details')}
              className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-foreground/10 bg-white text-sm font-semibold text-foreground transition hover:bg-foreground/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              Назад
            </button>
            <button
              type="submit"
              form={`${titleId}-report`}
              className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-destructive text-sm font-semibold text-white shadow-md transition hover:bg-destructive/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-2"
            >
              <Flag className="size-4" aria-hidden="true" />
              Отправить
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setView('report')}
              disabled={view === 'reported'}
              className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-foreground/10 bg-white text-sm font-semibold text-foreground transition hover:border-destructive/30 hover:bg-destructive/5 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50"
            >
              <Flag className="size-4" aria-hidden="true" />
              {view === 'reported' ? 'Отправлено' : 'Пожаловаться'}
            </button>
            <button
              type="button"
              onClick={() => onShowOnMap(place.id)}
              className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-md shadow-primary/30 transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <Map className="size-4" aria-hidden="true" />
              Показать на карте
            </button>
          </>
        )}
      </div>
    </div>
  )
}
