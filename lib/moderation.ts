import type { Category } from '@/lib/places'

export type SubmissionStatus = 'pending' | 'approved' | 'rejected'

export type SubmissionCheck = { label: string; ok: boolean }

export type Submission = {
  id: string
  name: string
  category: Category
  address: string
  discount: number
  conditions: string
  website?: string
  photos: string[]
  author: { name: string; university: string }
  submittedAt: string
  status: SubmissionStatus
  checks: SubmissionCheck[]
  rejectReason?: string
}

export const STATUS_LABEL: Record<SubmissionStatus, string> = {
  pending: 'Ожидают',
  approved: 'Одобрены',
  rejected: 'Отклонены',
}

export const REJECT_REASONS = [
  'Скидка не подтвердилась',
  'Место уже есть на карте',
  'Неверный или неполный адрес',
  'Фото не соответствуют месту',
  'Недостоверная информация',
]

export const SUBMISSIONS: Submission[] = [
  {
    id: 'REQ-1048',
    name: 'Пекарня «Мука»',
    category: 'food',
    address: 'ул. Сретенка, 9',
    discount: 15,
    conditions:
      'Скидка 15% на всю выпечку и кофе при предъявлении студенческого билета. Действует ежедневно с 8:00 до 12:00, не суммируется с другими акциями.',
    website: 'muka-bakery.ru',
    photos: ['/places/coffee.png', '/places/burger.png'],
    author: { name: 'Алина Сергеева', university: 'НИУ ВШЭ' },
    submittedAt: '2026-02-10T08:42:00+03:00',
    status: 'pending',
    checks: [
      { label: 'Адрес найден на карте', ok: true },
      { label: 'Дубликатов не найдено', ok: true },
      { label: 'Сайт доступен', ok: true },
    ],
  },
  {
    id: 'REQ-1049',
    name: 'Vintage Corner',
    category: 'clothes',
    address: 'Петровка, 26 стр. 2',
    discount: 20,
    conditions:
      'Минус 20% на всю одежду секонд-хенд по студенческому. В последнюю пятницу месяца — дополнительно 10% на аксессуары.',
    photos: ['/places/clothing.png'],
    author: { name: 'Марк Ли', university: 'МГУ им. Ломоносова' },
    submittedAt: '2026-02-10T11:15:00+03:00',
    status: 'pending',
    checks: [
      { label: 'Адрес найден на карте', ok: true },
      { label: 'Дубликатов не найдено', ok: true },
      { label: 'Сайт не указан', ok: false },
    ],
  },
  {
    id: 'REQ-1050',
    name: 'Strike Bowling',
    category: 'fun',
    address: 'Комсомольский пр-т, 28',
    discount: 50,
    conditions: 'Скидка 50% на дорожки в выходные для студентов, нужно показать студенческий у каждого.',
    website: 'strike-bowling.ru',
    photos: ['/places/bowling.png'],
    author: { name: 'Даниил Орлов', university: 'МФТИ' },
    submittedAt: '2026-02-10T14:03:00+03:00',
    status: 'pending',
    checks: [
      { label: 'Адрес найден на карте', ok: true },
      { label: 'Похожее место уже есть на карте', ok: false },
      { label: 'Сайт доступен', ok: true },
    ],
  },
  {
    id: 'REQ-1051',
    name: 'Йога-студия «Прана»',
    category: 'sport',
    address: 'Чистопрудный б-р, 12к2',
    discount: 30,
    conditions:
      'Абонемент на 8 занятий со скидкой 30% для студентов очной формы. Первое пробное занятие бесплатно.',
    website: 'prana-yoga.ru',
    photos: ['/places/gym.png', '/places/climbing.png'],
    author: { name: 'Екатерина Новак', university: 'РУДН' },
    submittedAt: '2026-02-11T09:27:00+03:00',
    status: 'pending',
    checks: [
      { label: 'Адрес найден на карте', ok: true },
      { label: 'Дубликатов не найдено', ok: true },
      { label: 'Сайт доступен', ok: true },
    ],
  },
  {
    id: 'REQ-1052',
    name: 'Кинотеатр «Ракурс»',
    category: 'fun',
    address: 'Ленинский',
    discount: 25,
    conditions: 'Скидка на билеты для студентов на дневные сеансы.',
    photos: ['/places/cinema.png'],
    author: { name: 'Илья Петров', university: 'МГТУ им. Баумана' },
    submittedAt: '2026-02-11T10:51:00+03:00',
    status: 'pending',
    checks: [
      { label: 'Адрес не распознан', ok: false },
      { label: 'Дубликатов не найдено', ok: true },
      { label: 'Сайт не указан', ok: false },
    ],
  },
  {
    id: 'REQ-1044',
    name: 'Run Store',
    category: 'sport',
    address: 'ул. Лесная, 5',
    discount: 10,
    conditions: 'Скидка 10% на беговую обувь и экипировку по студенческому билету, кроме товаров со скидкой.',
    website: 'runstore.ru',
    photos: ['/places/sneakers.png'],
    author: { name: 'Олег Ким', university: 'РАНХиГС' },
    submittedAt: '2026-02-09T16:20:00+03:00',
    status: 'approved',
    checks: [
      { label: 'Адрес найден на карте', ok: true },
      { label: 'Дубликатов не найдено', ok: true },
      { label: 'Сайт доступен', ok: true },
    ],
  },
  {
    id: 'REQ-1041',
    name: 'Burger Lab',
    category: 'food',
    address: 'ул. Покровка, 17',
    discount: 15,
    conditions: 'Комбо-обеды со скидкой для студентов в будни до 16:00.',
    photos: ['/places/burger.png'],
    author: { name: 'Софья Миронова', university: 'МПГУ' },
    submittedAt: '2026-02-08T13:05:00+03:00',
    status: 'rejected',
    rejectReason: 'Место уже есть на карте',
    checks: [
      { label: 'Адрес найден на карте', ok: true },
      { label: 'Похожее место уже есть на карте', ok: false },
      { label: 'Сайт не указан', ok: false },
    ],
  },
]

const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'Europe/Moscow',
})

export function formatSubmittedAt(iso: string) {
  return dateFormatter.format(new Date(iso))
}

export function toSafeUrl(website: string) {
  try {
    const url = new URL(/^https?:\/\//i.test(website) ? website : `https://${website}`)
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : null
  } catch {
    return null
  }
}
