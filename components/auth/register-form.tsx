'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Check } from 'lucide-react'
import { AuthDivider, authInputClass, authPrimaryButtonClass } from '@/components/auth/auth-shell'
import { Field, PasswordInput, VkIdButton } from '@/components/auth/auth-fields'
import { PasswordStrengthMeter } from '@/components/auth/password-strength-meter'
import { VK_DEMO_NAME, signInAsStudent } from '@/lib/auth'

export function RegisterForm() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword
  const showMismatch = passwordsMismatch || (submitted && password !== confirmPassword)

  function completeSignIn(userName: string) {
    signInAsStudent(userName)
    router.push('/')
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(true)
    if (password !== confirmPassword || !agreed) return
    completeSignIn(name)
  }

  return (
    <>
      <VkIdButton label="Зарегистрироваться через VK ID" onClick={() => completeSignIn(VK_DEMO_NAME)} />
      <AuthDivider />

      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate={false}>
        <Field id="register-name" label="Имя">
          <input
            id="register-name"
            type="text"
            autoComplete="given-name"
            required
            placeholder="Как к вам обращаться"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className={authInputClass}
          />
        </Field>

        <Field id="register-email" label="Email">
          <input
            id="register-email"
            type="email"
            autoComplete="email"
            required
            placeholder="student@university.ru"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={authInputClass}
          />
        </Field>

        <Field id="register-password" label="Пароль">
          <PasswordInput
            id="register-password"
            autoComplete="new-password"
            required
            minLength={6}
            placeholder="Минимум 6 символов"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            aria-describedby="register-password-strength"
          />
          <PasswordStrengthMeter id="register-password-strength" password={password} />
        </Field>

        <Field
          id="register-confirm"
          label="Подтверждение пароля"
          error={showMismatch ? 'Пароли не совпадают' : undefined}
        >
          <PasswordInput
            id="register-confirm"
            autoComplete="new-password"
            required
            placeholder="Повторите пароль"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            aria-invalid={showMismatch}
            aria-describedby={showMismatch ? 'register-confirm-error' : undefined}
          />
        </Field>

        <label className="flex cursor-pointer items-start gap-3 rounded-xl py-1 text-sm leading-relaxed text-foreground">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(event) => setAgreed(event.target.checked)}
            className="peer sr-only"
          />
          <span
            aria-hidden="true"
            className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border-2 border-border bg-background text-white transition peer-checked:border-[#0077FF] peer-checked:bg-[#0077FF] peer-focus-visible:ring-4 peer-focus-visible:ring-[#0077FF]/20"
          >
            {agreed ? <Check className="size-3.5" strokeWidth={3} /> : null}
          </span>
          <span>Я согласен с политикой конфиденциальности</span>
        </label>

        <button type="submit" disabled={!agreed} className={`${authPrimaryButtonClass} mt-2`}>
          Создать аккаунт
        </button>
      </form>
    </>
  )
}
