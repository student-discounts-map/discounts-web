import { getPasswordStrength } from '@/lib/auth'
import { cn } from '@/lib/utils'

const SEGMENT_COLORS = {
  1: 'bg-red-500',
  2: 'bg-amber-400',
  3: 'bg-emerald-500',
} as const

const LABEL_COLORS = {
  1: 'text-red-600',
  2: 'text-amber-600',
  3: 'text-emerald-600',
} as const

type PasswordStrengthMeterProps = {
  id: string
  password: string
}

export function PasswordStrengthMeter({ id, password }: PasswordStrengthMeterProps) {
  const { score, label } = getPasswordStrength(password)

  return (
    <div id={id} className="flex flex-col gap-1.5 pt-1" aria-live="polite">
      <div className="flex gap-1.5" aria-hidden="true">
        {[1, 2, 3].map((segment) => (
          <span
            key={segment}
            className={cn(
              'h-1.5 flex-1 rounded-full bg-border transition-colors',
              score > 0 && segment <= score && SEGMENT_COLORS[score as 1 | 2 | 3],
            )}
          />
        ))}
      </div>
      {score > 0 ? (
        <p className={cn('text-xs font-semibold', LABEL_COLORS[score as 1 | 2 | 3])}>{label}</p>
      ) : (
        <p className="text-xs text-muted-foreground">Используйте буквы разного регистра, цифры и символы</p>
      )}
    </div>
  )
}
