'use client'

import Link from 'next/link'
import { useSyncExternalStore } from 'react'
import { CalendarDays, FileText, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  formatApplicationDate,
  getApplicationsServerSnapshot,
  getApplicationsSnapshot,
  subscribeToApplications,
  type ApplicationStatus,
} from '@/lib/my-applications'

const STATUS_BADGE: Record<ApplicationStatus, { label: string; className: string; dot: string }> = {
  pending: { label: 'На проверке', className: 'bg-amber-100 text-amber-800', dot: 'bg-amber-500' },
  approved: { label: 'Опубликовано', className: 'bg-emerald-100 text-emerald-800', dot: 'bg-emerald-500' },
  rejected: { label: 'Отклонено', className: 'bg-red-100 text-red-800', dot: 'bg-red-500' },
}

export function ApplicationsList() {
  const applications = useSyncExternalStore(
    subscribeToApplications,
    getApplicationsSnapshot,
    getApplicationsServerSnapshot,
  )

  if (applications === null) {
    return (
      <div className="flex flex-col gap-3" aria-busy="true" aria-label="Загрузка заявок">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-3xl bg-white/70" />
        ))}
      </div>
    )
  }

  if (applications.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-3xl border border-white/60 bg-white/70 px-6 py-14 text-center backdrop-blur-xl">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary" aria-hidden="true">
          <FileText className="size-7" />
        </span>
        <div className="flex flex-col gap-1">
          <p className="text-lg font-bold text-foreground">Заявок пока нет</p>
          <p className="max-w-sm text-pretty text-sm leading-relaxed text-muted-foreground">
            Добавьте место со студенческой скидкой — здесь появится его статус проверки.
          </p>
        </div>
        <Link
          href="/add"
          className="flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
        >
          <Plus className="size-4" aria-hidden="true" />
          Добавить место
        </Link>
      </div>
    )
  }

  return (
    <ul className="flex flex-col gap-3">
      {applications.map((application) => {
        const badge = STATUS_BADGE[application.status]
        return (
          <li
            key={application.key}
            className="flex flex-col gap-3 rounded-3xl border border-white/60 bg-white/80 p-5 backdrop-blur-xl sm:flex-row sm:items-start sm:justify-between"
          >
            <div className="flex min-w-0 flex-col gap-1.5">
              <h2 className="truncate text-base font-bold text-foreground">{application.name}</h2>
              <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <CalendarDays className="size-4" aria-hidden="true" />
                <time dateTime={application.date ?? undefined}>{formatApplicationDate(application.date)}</time>
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:max-w-xs sm:items-end">
              <span
                className={cn(
                  'inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold',
                  badge.className,
                )}
              >
                <span className={cn('size-1.5 rounded-full', badge.dot)} aria-hidden="true" />
                {badge.label}
              </span>
              {application.status === 'rejected' && (
                <p className="rounded-2xl bg-red-50 px-3 py-2 text-sm leading-relaxed text-red-800 sm:text-right">
                  <span className="font-semibold">Причина: </span>
                  {application.rejectReason ?? 'не указана'}
                </p>
              )}
            </div>
          </li>
        )
      })}
    </ul>
  )
}
