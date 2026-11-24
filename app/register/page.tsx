import type { Metadata } from 'next'
import Link from 'next/link'
import { AuthShell } from '@/components/auth/auth-shell'
import { RegisterForm } from '@/components/auth/register-form'

export const metadata: Metadata = {
  title: 'Регистрация — СтудСкидки',
  description: 'Создайте аккаунт в СтудСкидки, чтобы добавлять места со студенческими скидками.',
}

export default function RegisterPage() {
  return (
    <AuthShell
      title="Создать аккаунт"
      description="Пара минут — и вы сможете добавлять скидки на карту"
      footer={
        <>
          Уже есть аккаунт?{' '}
          <Link href="/login" className="font-semibold text-[#0077FF] hover:underline">
            Войти
          </Link>
        </>
      }
    >
      <RegisterForm />
    </AuthShell>
  )
}
