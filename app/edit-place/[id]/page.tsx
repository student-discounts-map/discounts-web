import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, BadgePercent, Clock, Eye, Pencil, ShieldCheck } from 'lucide-react'
import { EditPlaceForm } from '@/components/edit-place/edit-place-form'
import { MyApplicationsLink } from '@/components/my-applications-link'
import { VkLoginButton } from '@/components/vk-login-button'
import { EDITABLE_PLACES } from '@/lib/edit-place'

export const metadata: Metadata = {
  title: 'Редактирование места — СтудСкидки',
  description: 'Обновите информацию о заведении — изменения появятся на карте после проверки модератором.',
}

const STEPS = [
  { icon: Pencil, title: 'Вы вносите правки', text: 'Измените только то, что устарело, — остальное оставьте как есть.' },
  { icon: ShieldCheck, title: 'Модератор сверяет', text: 'Проверяем новые условия и адрес у заведения.' },
  { icon: Clock, title: 'Карточка обновляется', text: 'До одобрения на карте остаётся прежняя версия.' },
]

export default async function EditPlacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const place = EDITABLE_PLACES[id]
  if (!place) notFound()

  return (
    <div className="min-h-dvh bg-muted">
      <header className="sticky top-0 z-20 border-b border-foreground/5 bg-white/75 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
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
          <div className="flex items-center gap-2">
            <MyApplicationsLink />
            <VkLoginButton />
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 lg:flex-row lg:items-start lg:gap-10 lg:py-12">
        <div className="flex min-w-0 flex-1 flex-col gap-6">
          <div role="note" className="flex items-start gap-3 rounded-2xl border border-primary/20 bg-primary/10 p-4 sm:items-center">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground" aria-hidden="true">
              <Pencil className="size-5" />
            </span>
            <div className="flex flex-col gap-0.5">
              <p className="font-bold text-foreground">Вы редактируете карточку</p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                «{place.name}» — изменения уйдут на модерацию и заменят текущую версию после одобрения.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="text-balance text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">Редактировать место</h1>
            <p className="max-w-xl text-pretty text-base leading-relaxed text-muted-foreground">
              Поменялись условия скидки или адрес? Поправьте карточку, чтобы студенты видели актуальную информацию.
            </p>
          </div>
          <EditPlaceForm placeId={id} initialValues={place} />
        </div>

        <aside className="flex flex-col gap-4 lg:sticky lg:top-28 lg:w-80 lg:shrink-0" aria-labelledby="moderation-title">
          <div className="rounded-3xl border border-white/60 bg-white/70 p-6 backdrop-blur-xl">
            <h2 id="moderation-title" className="text-lg font-bold text-foreground">
              Как проверяются правки
            </h2>
            <ol className="mt-5 flex flex-col gap-5">
              {STEPS.map(({ icon: Icon, title, text }) => (
                <li key={title} className="flex gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary" aria-hidden="true">
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <p className="font-semibold text-foreground">{title}</p>
                    <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="flex gap-3 rounded-3xl bg-primary p-6 text-primary-foreground">
            <Eye className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
            <div>
              <p className="font-bold">Статус правок</p>
              <p className="mt-1 text-sm leading-relaxed text-primary-foreground/85">
                Следите за проверкой на странице{' '}
                <Link href="/my-applications" className="font-semibold underline underline-offset-2">
                  Мои заявки
                </Link>
                .
              </p>
            </div>
          </div>
        </aside>
      </main>
    </div>
  )
}
