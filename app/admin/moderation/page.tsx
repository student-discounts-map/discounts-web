import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, BadgePercent, ShieldCheck } from 'lucide-react'
import { ModerationQueue } from '@/components/moderation/moderation-queue'
import { SUBMISSIONS } from '@/lib/moderation'

export const metadata: Metadata = {
  title: 'Очередь модерации — СтудСкидки',
  description: 'Проверка заявок на добавление мест со студенческими скидками.',
  robots: { index: false, follow: false },
}

export default function ModerationPage() {
  return (
    <div className="flex h-dvh flex-col bg-white">
      <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border bg-white px-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 text-sm font-extrabold tracking-tight text-foreground">
            <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground" aria-hidden="true">
              <BadgePercent className="size-4" />
            </span>
            <span className="hidden sm:inline">СтудСкидки</span>
          </Link>
          <span className="h-5 w-px bg-border" aria-hidden="true" />
          <span className="flex items-center gap-1.5 rounded-md bg-foreground px-2 py-1 text-xs font-semibold uppercase tracking-wide text-background">
            <ShieldCheck className="size-3.5" aria-hidden="true" />
            Админ
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="flex h-9 items-center gap-1.5 rounded-md px-3 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            <span className="hidden sm:inline">К карте</span>
          </Link>
          <div className="flex items-center gap-2 rounded-md border border-border py-1 pl-1 pr-3">
            <span className="flex size-7 items-center justify-center rounded bg-muted text-xs font-bold text-foreground" aria-hidden="true">
              АК
            </span>
            <span className="hidden text-sm font-medium text-foreground sm:inline">Анна К.</span>
            <span className="sr-only sm:hidden">Модератор Анна К.</span>
          </div>
        </div>
      </header>
      <ModerationQueue initialItems={SUBMISSIONS} />
    </div>
  )
}
