import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, BadgePercent, Clock, ShieldCheck, Sparkles } from 'lucide-react'
import { AddPlaceForm } from '@/components/add-place/add-place-form'
import { MyApplicationsLink } from '@/components/my-applications-link'
import { VkLoginButton } from '@/components/vk-login-button'

export const metadata: Metadata = {
  title: 'Добавить место — СтудСкидки',
  description: 'Знаете заведение со студенческой скидкой? Добавьте его на карту — после модерации его увидят все студенты города.',
}

const STEPS = [
  { icon: Sparkles, title: 'Вы отправляете заявку', text: 'Название, адрес, условия и пара фото — этого достаточно.' },
  { icon: ShieldCheck, title: 'Модератор проверяет', text: 'Сверяем адрес и уточняем условия скидки у заведения.' },
  { icon: Clock, title: 'Место появляется на карте', text: 'Обычно в течение 1–2 дней после отправки.' },
]

export default function AddPlacePage() {
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
          <div className="flex flex-col gap-2">
            <h1 className="text-balance text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">Добавить место</h1>
            <p className="max-w-xl text-pretty text-base leading-relaxed text-muted-foreground">
              Знаете кафе, магазин или студию со скидкой для студентов? Расскажите о нём — после проверки место появится на карте.
            </p>
          </div>
          <AddPlaceForm />
        </div>

        <aside className="flex flex-col gap-4 lg:sticky lg:top-28 lg:w-80 lg:shrink-0" aria-labelledby="moderation-title">
          <div className="rounded-3xl border border-white/60 bg-white/70 p-6 backdrop-blur-xl">
            <h2 id="moderation-title" className="text-lg font-bold text-foreground">
              Как проходит модерация
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
          <div className="rounded-3xl bg-primary p-6 text-primary-foreground">
            <p className="font-bold">Совет</p>
            <p className="mt-1 text-sm leading-relaxed text-primary-foreground/85">
              Заявки с фото вывески и меню с ценами проходят проверку быстрее.
            </p>
          </div>
        </aside>
      </main>
    </div>
  )
}
