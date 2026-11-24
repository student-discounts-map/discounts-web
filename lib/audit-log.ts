export type AuditAction = 'approved' | 'rejected'

export type AuditLogEntry = {
  id: string
  timestamp: string
  submissionId: string
  submissionName: string
  action: AuditAction
  moderatorId: string
  rejectReason?: string
}

export const AUDIT_STORAGE_KEY = 'audit_logs'
export const CURRENT_MODERATOR_ID = 'moderator_1'
const CHANGE_EVENT = 'audit-logs-change'

export const AUDIT_ACTION_LABEL: Record<AuditAction, string> = {
  approved: 'Одобрено',
  rejected: 'Отклонено',
}

function readEntries(): AuditLogEntry[] {
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(AUDIT_STORAGE_KEY) ?? '[]')
    return Array.isArray(parsed) ? (parsed as AuditLogEntry[]) : []
  } catch {
    return []
  }
}

function writeEntries(entries: AuditLogEntry[]) {
  window.localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(entries))
  window.dispatchEvent(new Event(CHANGE_EVENT))
}

export function appendAuditLog(entry: Omit<AuditLogEntry, 'id' | 'timestamp' | 'moderatorId'>) {
  writeEntries([
    ...readEntries(),
    {
      ...entry,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      moderatorId: CURRENT_MODERATOR_ID,
    },
  ])
}

export function clearAuditLog() {
  window.localStorage.removeItem(AUDIT_STORAGE_KEY)
  window.dispatchEvent(new Event(CHANGE_EVENT))
}

let cachedRaw: string | null = null
let cachedEntries: AuditLogEntry[] = []

export function getAuditLogSnapshot() {
  const raw = window.localStorage.getItem(AUDIT_STORAGE_KEY) ?? ''
  if (raw !== cachedRaw) {
    cachedRaw = raw
    cachedEntries = readEntries().sort((a, b) => b.timestamp.localeCompare(a.timestamp))
  }
  return cachedEntries
}

export function getAuditLogServerSnapshot() {
  return null
}

export function subscribeToAuditLog(onChange: () => void) {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === AUDIT_STORAGE_KEY) onChange()
  }
  window.addEventListener(CHANGE_EVENT, onChange)
  window.addEventListener('storage', handleStorage)
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange)
    window.removeEventListener('storage', handleStorage)
  }
}

const timestampFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
})

export function formatAuditTimestamp(iso: string) {
  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? '—' : timestampFormatter.format(date)
}
