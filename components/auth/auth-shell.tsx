import Link from 'next/link'
import { BadgePercent } from 'lucide-react'
import type { ReactNode } from 'react'

type AuthShellProps = {
  title: string
  description: string
  children: ReactNode
  footer: ReactNode
}

export function AuthShell({ title, description, children, footer }: AuthShellProps) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-muted px-4 py-10">
      <Link
        href="/"
        className="mb-6 flex items-center gap-2 rounded-full text-lg font-extrabold tracking-tight text-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#0077FF]/20"
      >
        <span className="flex size-9 items-center justify-center rounded-xl bg-[#0077FF] text-white" aria-hidden="true">
          <BadgePercent className="size-5" />
        </span>
        СтудСкидки
      </Link>

      <main className="w-full max-w-md rounded-3xl border border-foreground/5 bg-card p-6 shadow-xl shadow-foreground/5 sm:p-8">
        <div className="mb-6 flex flex-col gap-1.5 text-center">
          <h1 className="text-balance text-2xl font-extrabold tracking-tight text-card-foreground sm:text-3xl">{title}</h1>
          <p className="text-pretty text-sm leading-relaxed text-muted-foreground">{description}</p>
        </div>
        {children}
        <p className="mt-6 text-center text-sm text-muted-foreground">{footer}</p>
      </main>
    </div>
  )
}

export function AuthDivider() {
  return (
    <div className="my-6 flex items-center gap-3" role="separator" aria-label="или">
      <span className="h-px flex-1 bg-border" />
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground" aria-hidden="true">
        или
      </span>
      <span className="h-px flex-1 bg-border" />
    </div>
  )
}

export const authInputClass =
  'h-12 w-full rounded-xl border border-border bg-background px-4 text-base text-foreground shadow-sm outline-none transition placeholder:text-muted-foreground/70 focus:border-[#0077FF] focus:ring-4 focus:ring-[#0077FF]/15 aria-[invalid=true]:border-destructive aria-[invalid=true]:focus:ring-destructive/15'

export const authPrimaryButtonClass =
  'flex h-12 w-full items-center justify-center rounded-xl bg-[#0077FF] text-base font-bold text-white shadow-lg shadow-[#0077FF]/25 transition hover:bg-[#0068E0] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#0077FF]/30 disabled:cursor-not-allowed disabled:bg-muted-foreground/40 disabled:shadow-none'
