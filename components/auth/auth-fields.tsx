'use client'

import { useState, type InputHTMLAttributes, type ReactNode } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { authInputClass } from '@/components/auth/auth-shell'
import { cn } from '@/lib/utils'

type FieldProps = {
  id: string
  label: string
  labelAside?: ReactNode
  error?: string
  children: ReactNode
}

export function Field({ id, label, labelAside, error, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={id} className="text-sm font-semibold text-foreground">
          {label}
        </label>
        {labelAside}
      </div>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-sm font-medium text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  )
}

export function PasswordInput({ className, ...props }: Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="relative">
      <input {...props} type={visible ? 'text' : 'password'} className={cn(authInputClass, 'pr-12', className)} />
      <button
        type="button"
        onClick={() => setVisible((value) => !value)}
        aria-label={visible ? 'Скрыть пароль' : 'Показать пароль'}
        aria-pressed={visible}
        className="absolute right-1.5 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-foreground/5 hover:text-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#0077FF]/20"
      >
        {visible ? <EyeOff className="size-5" aria-hidden="true" /> : <Eye className="size-5" aria-hidden="true" />}
      </button>
    </div>
  )
}

type VkIdButtonProps = {
  label: string
  onClick: () => void
}

export function VkIdButton({ label, onClick }: VkIdButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-13 w-full items-center justify-center gap-3 rounded-xl bg-[#0077FF] py-3 text-base font-bold text-white shadow-lg shadow-[#0077FF]/25 transition hover:bg-[#0068E0] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#0077FF]/30"
    >
      <span
        aria-hidden="true"
        className="flex size-7 items-center justify-center rounded-full bg-white text-[12px] font-extrabold tracking-tight text-[#0077FF]"
      >
        VK
      </span>
      {label}
    </button>
  )
}
