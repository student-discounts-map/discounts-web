import Link from 'next/link'
import { FileText } from 'lucide-react'

export function MyApplicationsLink() {
  return (
    <Link
      href="/my-applications"
      className="flex h-12 items-center gap-2 rounded-full border border-white/60 bg-white/85 px-3.5 text-sm font-semibold text-foreground shadow-lg shadow-foreground/5 backdrop-blur-xl transition hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 lg:px-5"
    >
      <FileText className="size-5 text-primary" aria-hidden="true" />
      <span className="sr-only lg:not-sr-only">Мои заявки</span>
    </Link>
  )
}
