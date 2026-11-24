'use client'

import { useSyncExternalStore } from 'react'
import { ScrollText, Trash2 } from 'lucide-react'
import {
  AUDIT_ACTION_LABEL,
  clearAuditLog,
  formatAuditTimestamp,
  getAuditLogServerSnapshot,
  getAuditLogSnapshot,
  subscribeToAuditLog,
} from '@/lib/audit-log'
import { cn } from '@/lib/utils'

export function AuditLog() {
  const entries = useSyncExternalStore(subscribeToAuditLog, getAuditLogSnapshot, getAuditLogServerSnapshot)

  function handleClear() {
    if (window.confirm('Очистить журнал действий? Это действие нельзя отменить.')) clearAuditLog()
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 p-4 lg:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-foreground">Журнал действий</h1>
          <p className="text-sm text-muted-foreground">Все решения модераторов по заявкам, от новых к старым.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-muted-foreground">{entries?.length ?? 0} записей</span>
          {entries && entries.length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              className="flex h-8 items-center gap-1.5 rounded-md border border-border bg-white px-3 text-xs font-semibold text-muted-foreground transition hover:border-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Trash2 className="size-3.5" aria-hidden="true" />
              Очистить
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto rounded-md border border-border bg-white">
        <table className="w-full min-w-[40rem] border-collapse text-sm">
          <caption className="sr-only">Журнал действий модераторов</caption>
          <thead>
            <tr className="border-b border-border bg-muted text-left">
              {['Время', 'Заявка', 'Действие', 'Модератор'].map((heading) => (
                <th
                  key={heading}
                  scope="col"
                  className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {entries === null ? (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-muted-foreground">
                  Загрузка…
                </td>
              </tr>
            ) : entries.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-12">
                  <div className="flex flex-col items-center gap-2 text-center">
                    <ScrollText className="size-8 text-muted-foreground/50" aria-hidden="true" />
                    <p className="font-semibold text-foreground">Записей пока нет</p>
                    <p className="text-muted-foreground">Одобрите или отклоните заявку в очереди — действие появится здесь.</p>
                  </div>
                </td>
              </tr>
            ) : (
              entries.map((entry) => (
                <tr key={entry.id} className="border-b border-border last:border-b-0 hover:bg-muted/50">
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-xs tabular-nums text-muted-foreground">
                    <time dateTime={entry.timestamp}>{formatAuditTimestamp(entry.timestamp)}</time>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-foreground">{entry.submissionName}</span>
                    <span className="ml-2 font-mono text-xs text-muted-foreground">{entry.submissionId}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        'inline-flex items-center gap-1.5 rounded border px-2 py-0.5 text-xs font-semibold',
                        entry.action === 'approved'
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                          : 'border-red-200 bg-red-50 text-red-700',
                      )}
                    >
                      <span
                        className={cn('size-1.5 rounded-full', entry.action === 'approved' ? 'bg-emerald-600' : 'bg-red-600')}
                        aria-hidden="true"
                      />
                      {AUDIT_ACTION_LABEL[entry.action]}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-foreground">{entry.moderatorId}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
