'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ArrowLeft, Check, CheckCircle2, ExternalLink, RotateCcw, X, XCircle } from 'lucide-react'
import { CATEGORY_LABEL } from '@/lib/places'
import { REJECT_REASONS, formatSubmittedAt, toSafeUrl, type Submission } from '@/lib/moderation'
import { cn } from '@/lib/utils'

type SubmissionDetailsProps = {
  submission: Submission
  onApprove: () => void
  onReject: (reason: string) => void
  onReturn: () => void
  onBack: () => void
}

export function SubmissionDetails({ submission, onApprove, onReject, onReturn, onBack }: SubmissionDetailsProps) {
  const [activePhoto, setActivePhoto] = useState(0)
  const [rejecting, setRejecting] = useState(false)
  const [reason, setReason] = useState<string>(REJECT_REASONS[0])
  const [comment, setComment] = useState('')

  const websiteUrl = submission.website ? toSafeUrl(submission.website) : null
  const isPending = submission.status === 'pending'

  function confirmReject() {
    const note = comment.trim()
    onReject(note ? `${reason}. ${note}` : reason)
  }

  return (
    <article className="flex min-h-full flex-col" aria-labelledby="submission-title">
      <div className="flex-1 px-4 py-5 sm:px-8 sm:py-6">
        <button
          type="button"
          onClick={onBack}
          className="mb-4 flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground lg:hidden"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Все заявки
        </button>

        <header className="flex flex-col gap-3 border-b border-border pb-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-1">
            <p className="font-mono text-xs text-muted-foreground">
              {submission.id} · отправлена <time dateTime={submission.submittedAt}>{formatSubmittedAt(submission.submittedAt)}</time>
            </p>
            <h2 id="submission-title" className="text-balance text-2xl font-bold tracking-tight text-foreground">
              {submission.name}
            </h2>
          </div>
          <StatusBadge status={submission.status} />
        </header>

        {submission.status === 'rejected' && submission.rejectReason && (
          <p className="mt-5 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            <span className="font-semibold">Причина отказа:</span> {submission.rejectReason}
          </p>
        )}

        <div className="mt-6 grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,20rem)]">
          <div className="flex flex-col gap-3">
            <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-border bg-muted">
              <Image
                src={submission.photos[activePhoto] || '/placeholder.svg'}
                alt={`Фото ${activePhoto + 1} из ${submission.photos.length}: ${submission.name}`}
                fill
                sizes="(min-width: 1280px) 640px, 100vw"
                className="object-cover"
                priority
              />
            </div>
            {submission.photos.length > 1 && (
              <div className="flex gap-2" role="group" aria-label="Фотографии заявки">
                {submission.photos.map((src, index) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setActivePhoto(index)}
                    aria-label={`Показать фото ${index + 1}`}
                    aria-pressed={index === activePhoto}
                    className={cn(
                      'relative size-16 overflow-hidden rounded-md border-2 transition',
                      index === activePhoto ? 'border-foreground' : 'border-transparent opacity-70 hover:opacity-100',
                    )}
                  >
                    <Image src={src || '/placeholder.svg'} alt="" fill sizes="64px" className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <dl className="flex flex-col divide-y divide-border rounded-lg border border-border bg-white text-sm">
            <Field label="Категория">{CATEGORY_LABEL[submission.category]}</Field>
            <Field label="Адрес">{submission.address}</Field>
            <Field label="Скидка">
              <span className="font-mono font-semibold tabular-nums">−{submission.discount}%</span>
            </Field>
            <Field label="Сайт">
              {websiteUrl ? (
                <a
                  href={websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="inline-flex items-center gap-1 font-medium text-foreground underline underline-offset-4 hover:text-primary"
                >
                  {submission.website}
                  <ExternalLink className="size-3.5" aria-hidden="true" />
                  <span className="sr-only">(откроется в новой вкладке)</span>
                </a>
              ) : (
                <span className="text-muted-foreground">Не указан</span>
              )}
            </Field>
            <Field label="Автор">
              {submission.author.name}
              <span className="block text-xs text-muted-foreground">{submission.author.university}</span>
            </Field>
          </dl>
        </div>

        <section className="mt-8" aria-labelledby="conditions-title">
          <h3 id="conditions-title" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Условия скидки
          </h3>
          <p className="mt-2 max-w-3xl whitespace-pre-line text-pretty text-sm leading-relaxed text-foreground">
            {submission.conditions}
          </p>
        </section>

        <section className="mt-8" aria-labelledby="checks-title">
          <h3 id="checks-title" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Автоматические проверки
          </h3>
          <ul className="mt-2 flex flex-col gap-1.5">
            {submission.checks.map((check) => (
              <li key={check.label} className="flex items-center gap-2 text-sm">
                {check.ok ? (
                  <CheckCircle2 className="size-4 shrink-0 text-foreground/60" aria-hidden="true" />
                ) : (
                  <XCircle className="size-4 shrink-0 text-primary" aria-hidden="true" />
                )}
                <span className={check.ok ? 'text-muted-foreground' : 'font-medium text-foreground'}>{check.label}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <footer className="sticky bottom-0 border-t border-border bg-white px-4 py-4 sm:px-8">
        {!isPending ? (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">Решение по заявке уже принято.</p>
            <button
              type="button"
              onClick={onReturn}
              className="flex h-10 items-center gap-2 rounded-md border border-border px-4 text-sm font-semibold text-foreground transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <RotateCcw className="size-4" aria-hidden="true" />
              Вернуть на проверку
            </button>
          </div>
        ) : rejecting ? (
          <fieldset className="flex flex-col gap-3">
            <legend className="mb-2 text-sm font-semibold text-foreground">Причина отказа</legend>
            <div className="flex flex-wrap gap-2">
              {REJECT_REASONS.map((option) => (
                <label
                  key={option}
                  className={cn(
                    'cursor-pointer rounded-md border px-3 py-1.5 text-sm transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring',
                    reason === option
                      ? 'border-destructive bg-destructive/5 font-medium text-destructive'
                      : 'border-border text-foreground hover:bg-muted',
                  )}
                >
                  <input
                    type="radio"
                    name="reject-reason"
                    value={option}
                    checked={reason === option}
                    onChange={() => setReason(option)}
                    className="sr-only"
                  />
                  {option}
                </label>
              ))}
            </div>
            <label className="sr-only" htmlFor="reject-comment">
              Комментарий для автора
            </label>
            <textarea
              id="reject-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={300}
              rows={2}
              placeholder="Комментарий для автора (необязательно)"
              className="w-full resize-none rounded-md border border-border bg-white px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <div className="flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={() => setRejecting(false)}
                className="flex h-10 items-center rounded-md px-4 text-sm font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                Отмена
              </button>
              <button
                type="button"
                onClick={confirmReject}
                className="flex h-10 items-center gap-2 rounded-md bg-destructive px-5 text-sm font-semibold text-white transition hover:bg-destructive/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive/40"
              >
                <X className="size-4" aria-hidden="true" />
                Подтвердить отказ
              </button>
            </div>
          </fieldset>
        ) : (
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => setRejecting(true)}
              className="flex h-11 items-center justify-center gap-2 rounded-md border border-destructive/40 px-6 text-sm font-semibold text-destructive transition hover:bg-destructive/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive/40"
            >
              <X className="size-4" aria-hidden="true" />
              Отклонить
            </button>
            <button
              type="button"
              onClick={onApprove}
              className="flex h-11 items-center justify-center gap-2 rounded-md bg-foreground px-6 text-sm font-semibold text-background transition hover:bg-foreground/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Check className="size-4" aria-hidden="true" />
              Одобрить
            </button>
          </div>
        )}
      </footer>
    </article>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4 px-4 py-3">
      <dt className="w-24 shrink-0 text-muted-foreground">{label}</dt>
      <dd className="min-w-0 flex-1 break-words text-foreground">{children}</dd>
    </div>
  )
}

function StatusBadge({ status }: { status: Submission['status'] }) {
  const config = {
    pending: { label: 'На проверке', className: 'border-primary/30 bg-primary/10 text-primary' },
    approved: { label: 'Одобрена', className: 'border-foreground/15 bg-foreground/5 text-foreground' },
    rejected: { label: 'Отклонена', className: 'border-destructive/30 bg-destructive/5 text-destructive' },
  }[status]
  return (
    <span
      className={cn(
        'inline-flex h-7 shrink-0 items-center self-start rounded-md border px-2.5 text-xs font-semibold uppercase tracking-wide',
        config.className,
      )}
    >
      {config.label}
    </span>
  )
}
