import type { Metadata } from 'next'
import Link from 'next/link'
import { AuthShell } from '@/components/auth/auth-shell'
import { LoginForm } from '@/components/auth/login-form'

export const metadata: Metadata = {
  title: 'Вход — СтудСкидки',
  description: 'Войдите в СтудСкидки, чтобы предлагать места со скидками и следить за своими заявками.',
}

export default function LoginPage() {
  return (
    <AuthShell
      title="Вход в СтудСкидки"
      description="Скидки для студентов рядом с вами"
      footer={
        <>
          Нет аккаунта?{' '}
          <Link href="/register" className="font-semibold text-[#0077FF] hover:underline">
            Зарегистрироваться
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthShell>
  )
}
