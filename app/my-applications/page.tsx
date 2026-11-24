import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, BadgePercent } from 'lucide-react'
import { ApplicationsList } from '@/components/my-applications/applications-list'
import { VkLoginButton } from '@/components/vk-login-button'

export const metadata: Metadata = {
  title: 'Мои заявки — СтудСкидки',
  description: 'Статус мест со студенческими скидками, которые вы предложили добавить на карту.',
}

export default function MyApplicationsPage() {
  return (
    <div className="min-h-dvh bg-muted">
      <header className="sticky top-0 z-20 border-b border-foreground/5 bg-white/75 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between gap-3 px-4">
          <Link
            href="/"
            className="flex h-10 items-center gap-2 rounded-full pl-2 pr-4 text-sm font-semibold text-foreground transition hover:bg-foreground/5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
          >
            <ArrowLeft className="size-5" aria-hidden="true" />
            К карте
          </Link>
          <Link href="/" className="flex items-center gap-2 text-base font-extrabold tracking-tight text-foreground">
            <span className="flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground" aria-hidden="true">
              <BadgePercent className="size-5" />
            </span>
            <span className="hidden sm:inline">СтудСкидки</span>
          </Link>
          <VkLoginButton />
        </div>
      </header>

      <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8 lg:py-12">
        <div className="flex flex-col gap-2">
          <h1 className="text-balance text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">Мои заявки</h1>
          <p className="max-w-xl text-pretty text-base leading-relaxed text-muted-foreground">
            Места, которые вы предложили добавить на карту, и статус их проверки.
          </p>
        </div>
        <ApplicationsList />
      </main>
    </div>
  )
}
