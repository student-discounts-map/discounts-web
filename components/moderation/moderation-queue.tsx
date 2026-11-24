"use client";

import { useMemo, useState } from "react";
import { ClipboardList, Inbox, ScrollText, Undo2 } from "lucide-react";
import {
  STATUS_LABEL,
  type Submission,
  type SubmissionStatus,
} from "@/lib/moderation";
import { appendAuditLog } from "@/lib/audit-log";
import { SubmissionList } from "@/components/moderation/submission-list";
import { SubmissionDetails } from "@/components/moderation/submission-details";
import { AuditLog } from "@/components/moderation/audit-log";
import { cn } from "@/lib/utils";

const TABS: SubmissionStatus[] = ["pending", "approved", "rejected"];

type View = "queue" | "audit";

const VIEWS: { id: View; label: string; icon: typeof Inbox }[] = [
  { id: "queue", label: "Очередь", icon: Inbox },
  { id: "audit", label: "Журнал действий", icon: ScrollText },
];

type LastAction = { id: string; name: string; status: SubmissionStatus };

function byStatus(items: Submission[], status: SubmissionStatus) {
  return items
    .filter((s) => s.status === status)
    .sort((a, b) =>
      status === "pending"
        ? a.submittedAt.localeCompare(b.submittedAt)
        : b.submittedAt.localeCompare(a.submittedAt),
    );
}

export function ModerationQueue({
  initialItems,
}: {
  initialItems: Submission[];
}) {
  const [view, setView] = useState<View>("queue");
  const [items, setItems] = useState(initialItems);
  const [tab, setTab] = useState<SubmissionStatus>("pending");
  const [selectedId, setSelectedId] = useState<string | null>(
    () => byStatus(initialItems, "pending")[0]?.id ?? null,
  );
  const [showDetailsOnMobile, setShowDetailsOnMobile] = useState(false);
  const [lastAction, setLastAction] = useState<LastAction | null>(null);

  const visible = useMemo(() => byStatus(items, tab), [items, tab]);
  const counts = useMemo(
    () =>
      Object.fromEntries(
        TABS.map((t) => [t, items.filter((s) => s.status === t).length]),
      ) as Record<SubmissionStatus, number>,
    [items],
  );
  const selected = visible.find((s) => s.id === selectedId) ?? null;

  function changeTab(next: SubmissionStatus) {
    setTab(next);
    setSelectedId(byStatus(items, next)[0]?.id ?? null);
    setShowDetailsOnMobile(false);
  }

  function select(id: string) {
    setSelectedId(id);
    setShowDetailsOnMobile(true);
  }

  function setStatus(
    id: string,
    status: SubmissionStatus,
    rejectReason?: string,
  ) {
    const index = visible.findIndex((s) => s.id === id);
    const remaining = visible.filter((s) => s.id !== id);
    const next = remaining[index] ?? remaining[index - 1] ?? null;
    const target = items.find((s) => s.id === id);

    setItems((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status, rejectReason } : s)),
    );
    setSelectedId(next?.id ?? null);
    if (!next) setShowDetailsOnMobile(false);
    if (target) setLastAction({ id, name: target.name, status });
    if (target && (status === "approved" || status === "rejected")) {
      appendAuditLog({
        submissionId: id,
        submissionName: target.name,
        action: status,
        rejectReason,
      });
    }
  }

  function undo() {
    if (!lastAction) return;
    setItems((prev) =>
      prev.map((s) =>
        s.id === lastAction.id
          ? { ...s, status: "pending", rejectReason: undefined }
          : s,
      ),
    );
    setTab("pending");
    setSelectedId(lastAction.id);
    setLastAction(null);
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <nav
        className="flex shrink-0 gap-1 border-b border-border bg-white px-4"
        role="tablist"
        aria-label="Разделы модерации"
      >
        {VIEWS.map((v) => (
          <button
            key={v.id}
            type="button"
            role="tab"
            aria-selected={view === v.id}
            onClick={() => setView(v.id)}
            className={cn(
              "-mb-px flex items-center gap-2 border-b-2 px-3 py-2.5 text-xs font-semibold uppercase tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              view === v.id
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            <v.icon className="size-3.5" aria-hidden="true" />
            {v.label}
          </button>
        ))}
      </nav>

      {view === "audit" ? (
        <div
          className="min-h-0 flex-1 overflow-y-auto bg-muted"
          role="tabpanel"
          aria-label="Журнал действий"
        >
          <AuditLog />
        </div>
      ) : (
        <div
          className="flex min-h-0 flex-1"
          role="tabpanel"
          aria-label="Очередь"
        >
          <aside
            className={cn(
              "w-full min-h-0 flex-col border-r border-border bg-white lg:flex lg:w-[26rem] lg:shrink-0",
              showDetailsOnMobile ? "hidden" : "flex",
            )}
            aria-label="Список заявок"
          >
            <div className="border-b border-border px-4 pt-4">
              <div className="flex items-center justify-between">
                <h1 className="text-lg font-bold tracking-tight text-foreground">
                  Очередь модерации
                </h1>
                <span className="font-mono text-xs text-muted-foreground">
                  {items.length} всего
                </span>
              </div>
              <div
                className="mt-3 flex gap-1"
                role="tablist"
                aria-label="Статус заявок"
              >
                {TABS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    role="tab"
                    aria-selected={tab === t}
                    onClick={() => changeTab(t)}
                    className={cn(
                      "-mb-px flex items-center gap-2 border-b-2 px-3 pb-2.5 pt-1 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      tab === t
                        ? "border-foreground text-foreground"
                        : "border-transparent text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {STATUS_LABEL[t]}
                    <span
                      className={cn(
                        "rounded px-1.5 py-0.5 font-mono text-xs tabular-nums",
                        tab === t && t === "pending"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      {counts[t]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div aria-live="polite">
              {lastAction && (
                <div className="flex items-center justify-between gap-3 border-b border-border bg-muted px-4 py-2.5 text-sm">
                  <p className="min-w-0 truncate text-foreground">
                    «{lastAction.name}»{" "}
                    {lastAction.status === "approved"
                      ? "одобрена"
                      : "отклонена"}
                  </p>
                  <button
                    type="button"
                    onClick={undo}
                    className="flex shrink-0 items-center gap-1 font-semibold text-foreground underline-offset-4 hover:underline"
                  >
                    <Undo2 className="size-4" aria-hidden="true" />
                    Отменить
                  </button>
                </div>
              )}
            </div>

            <div
              className="flex min-h-0 flex-1 flex-col overflow-y-auto"
              role="tabpanel"
              aria-label={STATUS_LABEL[tab]}
            >
              <SubmissionList
                items={visible}
                selectedId={selected?.id ?? null}
                onSelect={select}
              />
            </div>
          </aside>

          <section
            className={cn(
              "min-h-0 flex-1 overflow-y-auto bg-muted lg:block",
              showDetailsOnMobile ? "block" : "hidden",
            )}
            aria-label="Детали заявки"
          >
            {selected ? (
              <SubmissionDetails
                key={selected.id}
                submission={selected}
                onApprove={() => setStatus(selected.id, "approved")}
                onReject={(reason) =>
                  setStatus(selected.id, "rejected", reason)
                }
                onReturn={() => setStatus(selected.id, "pending")}
                onBack={() => setShowDetailsOnMobile(false)}
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-2 p-8 text-center">
                <ClipboardList
                  className="size-10 text-muted-foreground/50"
                  aria-hidden="true"
                />
                <p className="font-semibold text-foreground">
                  {tab === "pending" && counts.pending === 0
                    ? "Очередь разобрана"
                    : "Выберите заявку"}
                </p>
                <p className="max-w-xs text-sm text-muted-foreground">
                  {tab === "pending" && counts.pending === 0
                    ? "Новых заявок нет. Отличная работа!"
                    : "Выберите заявку в списке слева, чтобы посмотреть детали."}
                </p>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
