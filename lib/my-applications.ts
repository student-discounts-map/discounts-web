export type ApplicationStatus = 'pending' | 'approved' | 'rejected'

export type MyApplication = {
  key: string
  name: string
  date: string | null
  status: ApplicationStatus
  rejectReason: string | null
}

const STORAGE_KEYS: Record<ApplicationStatus, string> = {
  pending: 'pending_places',
  approved: 'approved_places',
  rejected: 'rejected_places',
}

const NAME_FIELDS = ['name', 'title', 'placeName']
const DATE_FIELDS = ['submittedAt', 'createdAt', 'created_at', 'date', 'updatedAt']
const REASON_FIELDS = ['rejectReason', 'rejectionReason', 'reject_reason', 'reason', 'comment']

function pickString(record: Record<string, unknown>, fields: string[]) {
  for (const field of fields) {
    const value = record[field]
    if (typeof value === 'string' && value.trim()) return value.trim()
    if (typeof value === 'number' && field !== 'name') return String(value)
  }
  return null
}

function readArray(key: string): unknown[] {
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(key) ?? '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function toTimestamp(date: string | null) {
  if (!date) return 0
  const numeric = Number(date)
  const time = Number.isFinite(numeric) ? numeric : new Date(date).getTime()
  return Number.isNaN(time) ? 0 : time
}

function parseApplications(): MyApplication[] {
  const result: MyApplication[] = []

  for (const status of Object.keys(STORAGE_KEYS) as ApplicationStatus[]) {
    readArray(STORAGE_KEYS[status]).forEach((item, index) => {
      if (!item || typeof item !== 'object') return
      const record = item as Record<string, unknown>
      const id = pickString(record, ['id'])
      result.push({
        key: `${status}-${id ?? index}`,
        name: pickString(record, NAME_FIELDS) ?? 'Без названия',
        date: pickString(record, DATE_FIELDS),
        status,
        rejectReason: status === 'rejected' ? pickString(record, REASON_FIELDS) : null,
      })
    })
  }

  return result.sort((a, b) => toTimestamp(b.date) - toTimestamp(a.date))
}

let cachedRaw: string | null = null
let cachedApplications: MyApplication[] = []

export function getApplicationsSnapshot() {
  const raw = Object.values(STORAGE_KEYS)
    .map((key) => window.localStorage.getItem(key) ?? '')
    .join('\u0000')
  if (raw !== cachedRaw) {
    cachedRaw = raw
    cachedApplications = parseApplications()
  }
  return cachedApplications
}

export function getApplicationsServerSnapshot() {
  return null
}

export function subscribeToApplications(onChange: () => void) {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === null || Object.values(STORAGE_KEYS).includes(event.key)) onChange()
  }
  window.addEventListener('storage', handleStorage)
  window.addEventListener('focus', onChange)
  return () => {
    window.removeEventListener('storage', handleStorage)
    window.removeEventListener('focus', onChange)
  }
}

const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

export function formatApplicationDate(date: string | null) {
  const time = toTimestamp(date)
  return time ? dateFormatter.format(new Date(time)) : 'Дата не указана'
}
