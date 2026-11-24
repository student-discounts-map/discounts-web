import Link from 'next/link'

export function VkLoginButton() {
  return (
    <Link
      href="/login"
      className="flex h-12 shrink-0 items-center gap-2.5 rounded-full bg-[#0077FF] pl-2 pr-2 text-sm font-semibold text-white shadow-lg shadow-[#0077FF]/25 transition hover:bg-[#0068E0] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#0077FF]/30 sm:pr-5"
    >
      <span
        aria-hidden="true"
        className="flex size-8 items-center justify-center rounded-full bg-white text-[13px] font-extrabold tracking-tight text-[#0077FF]"
      >
        VK
      </span>
      <span className="sr-only sm:not-sr-only">Войти через VK ID</span>
    </Link>
  )
}
