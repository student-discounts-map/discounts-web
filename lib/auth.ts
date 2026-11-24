export const USER_ROLE_KEY = 'user_role'
export const USER_NAME_KEY = 'user_name'

export const VK_DEMO_NAME = 'Студент VK'

export function signInAsStudent(name: string) {
  window.localStorage.setItem(USER_ROLE_KEY, 'student')
  window.localStorage.setItem(USER_NAME_KEY, name.trim() || 'Студент')
}

export function nameFromEmail(email: string) {
  return email.split('@')[0]?.trim() || 'Студент'
}

export type PasswordStrength = {
  score: 0 | 1 | 2 | 3
  label: string
}

export function getPasswordStrength(password: string): PasswordStrength {
  if (!password) return { score: 0, label: '' }

  let points = 0
  if (password.length >= 8) points++
  if (password.length >= 12) points++
  if (/[a-zа-яё]/.test(password) && /[A-ZА-ЯЁ]/.test(password)) points++
  if (/\d/.test(password)) points++
  if (/[^\p{L}\d]/u.test(password)) points++

  if (points <= 2) return { score: 1, label: 'Слабый пароль' }
  if (points <= 3) return { score: 2, label: 'Средний пароль' }
  return { score: 3, label: 'Сильный пароль' }
}
