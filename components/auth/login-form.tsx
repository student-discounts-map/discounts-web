'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AuthDivider, authInputClass, authPrimaryButtonClass } from '@/components/auth/auth-shell'
import { Field, PasswordInput, VkIdButton } from '@/components/auth/auth-fields'
import { VK_DEMO_NAME, nameFromEmail, signInAsStudent } from '@/lib/auth'

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function completeSignIn(name: string) {
    signInAsStudent(name)
    router.push('/')
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    completeSignIn(nameFromEmail(email))
  }

  return (
    <>
      <VkIdButton label="Войти через VK ID" onClick={() => completeSignIn(VK_DEMO_NAME)} />
      <AuthDivider />

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field id="login-email" label="Email">
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            required
            placeholder="student@university.ru"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={authInputClass}
          />
        </Field>

        <Field
          id="login-password"
          label="Пароль"
          labelAside={
            <Link
              href="#"
              className="rounded text-sm font-semibold text-[#0077FF] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0077FF]/30"
            >
              Забыли пароль?
            </Link>
          }
        >
          <PasswordInput
            id="login-password"
            autoComplete="current-password"
            required
            placeholder="Введите пароль"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </Field>

        <button type="submit" className={`${authPrimaryButtonClass} mt-2`}>
          Войти
        </button>
      </form>
    </>
  )
}
