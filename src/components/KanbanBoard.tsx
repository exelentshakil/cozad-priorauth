"use client";

import React, { useState } from "react";
import { PriorAuthCase, RoutingStatus } from "@/lib/types";
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Send,
  Search,
  Filter,
  Clock,
  User,
  FileText,
  ChevronRight,
  Sparkles,
  Zap,
  ArrowRight,
  ShieldAlert,
  Building2,
  Calendar
} from "lucide-react";

interface KanbanBoardProps {
  cases: PriorAuthCase[];
  onSelectCase: (c: PriorAuthCase) => void;
  onVerifyCase: (caseId: string) => void;
  onSubmitCase: (caseId: string) => void;
  onOpenIntake: () => void;
}

export function KanbanBoard({
  cases,
  onSelectCase,
  onVerifyCase,
  onSubmitCase,
  onOpenIntake
}: KanbanBoardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [payerFilter, setPayerFilter] = useState("ALL");

  const filteredCases = cases.filter(c => {
    const matchesSearch =
      c.patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.request.cptCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.request.cptDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.patient.memberId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPayer = payerFilter === "ALL" || c.payer.id.includes(payerFilter);

    return matchesSearch && matchesPayer;
  });

  const readyCases = filteredCases.filter(c => c.status === "READY" && c.stage !== "SUBMITTED");
  const verifyCases = filteredCases.filter(c => c.status === "VERIFY");
  const exceptionCases = filteredCases.filter(c => c.status === "EXCEPTION");
  const submittedCases = filteredCases.filter(c => c.stage === "SUBMITTED");

  return (
    <div className="space-y-6">
      {/* Top Banner: Workflow Metrology & Automation Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)] p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[var(--color-text-muted)]">Touchless Automation</span>
            <Zap className="h-4 w-4 text-[var(--color-stripe-purple)]" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-[var(--color-text-primary)]">92.8%</span>
            <span className="text-xs text-[var(--color-ready)] font-medium">Routine Cases</span>
          </div>
          <p className="mt-1 text-xs text-[var(--color-text-muted)]">
            Zero employee prompt-writing or manual copy-paste
          </p>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)] p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[var(--color-text-muted)]">Turnaround Velocity</span>
            <Clock className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-[var(--color-text-primary)]">&lt; 15 sec</span>
            <span className="text-xs text-[var(--color-text-muted)] font-medium">vs 48–72 hrs manual</span>
          </div>
          <p className="mt-1 text-xs text-[var(--color-text-muted)]">
            Instant extraction & payer rule compliance
          </p>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)] p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[var(--color-text-muted)]">Payer Decision Grounding</span>
            <ShieldAlert className="h-4 w-4 text-blue-500" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-[var(--color-text-primary)]">100%</span>
            <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">Deterministic Rules</span>
          </div>
          <p className="mt-1 text-xs text-[var(--color-text-muted)]">
            No hallucinated coverage determinations
          </p>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)] p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[var(--color-text-muted)]">Active Prior Auth Queue</span>
            <Building2 className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-[var(--color-text-primary)]">{filteredCases.length} Cases</span>
            <span className="text-xs text-[var(--color-text-muted)]">Synthetic Pilot</span>
          </div>
          <p className="mt-1 text-xs text-[var(--color-text-muted)]">
            Ready, Verify & Exception triage queues
          </p>
        </div>
      </div>

      {/* Control & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)] p-3">
        <div className="flex flex-1 items-center space-x-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[var(--color-text-muted)]" />
            <input
              type="text"
              placeholder="Search by patient, CPT, member ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] py-1.5 pl-9 pr-3 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-stripe-purple)]"
            />
          </div>

          <div className="flex items-center space-x-1.5">
            <Filter className="h-4 w-4 text-[var(--color-text-muted)] hidden sm:block" />
            <select
              value={payerFilter}
              onChange={(e) => setPayerFilter(e.target.value)}
              className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-2.5 py-1.5 text-xs text-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-stripe-purple)]"
            >
              <option value="ALL">All Payers</option>
              <option value="UHC">UnitedHealthcare</option>
              <option value="CMS">Medicare (CMS)</option>
              <option value="AETNA">Aetna</option>
            </select>
          </div>
        </div>

        <button
          onClick={onOpenIntake}
          className="inline-flex items-center justify-center rounded-lg bg-[var(--color-stripe-purple)] px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[var(--color-stripe-purple-hover)] transition-colors"
        >
          <Sparkles className="mr-1.5 h-3.5 w-3.5" />
          Test New Intake Case
        </button>
      </div>

      {/* Kanban Columns */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
        {/* Column 1: READY */}
        <div className="flex flex-col rounded-xl border border-[var(--color-ready-border)] bg-[var(--color-ready-bg)]/30 p-3">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--color-ready-border)]/50">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 text-[var(--color-ready)]" />
              <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">READY</h3>
            </div>
            <span className="rounded-full bg-[var(--color-ready-bg)] px-2.5 py-0.5 text-xs font-bold text-[var(--color-ready)] border border-[var(--color-ready-border)]">
              {readyCases.length}
            </span>
          </div>
          <p className="py-2 text-[11px] text-[var(--color-text-muted)]">
            Required documentation complete against payer criteria. Ready for electronic submission.
          </p>

          <div className="flex-1 space-y-3 pt-1">
            {readyCases.map((c) => (
              <CaseCard
                key={c.id}
                caseItem={c}
                onSelect={() => onSelectCase(c)}
                onAction={() => onSubmitCase(c.id)}
                actionLabel="Submit 278 EDI"
                actionType="ready"
              />
            ))}
            {readyCases.length === 0 && (
              <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-[var(--color-border)] text-xs text-[var(--color-text-muted)]">
                No cases currently in READY state
              </div>
            )}
          </div>
        </div>

        {/* Column 2: VERIFY */}
        <div className="flex flex-col rounded-xl border border-[var(--color-verify-border)] bg-[var(--color-verify-bg)]/30 p-3">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--color-verify-border)]/50">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-[var(--color-verify)]" />
              <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">VERIFY</h3>
            </div>
            <span className="rounded-full bg-[var(--color-verify-bg)] px-2.5 py-0.5 text-xs font-bold text-[var(--color-verify)] border border-[var(--color-verify-border)]">
              {verifyCases.length}
            </span>
          </div>
          <p className="py-2 text-[11px] text-[var(--color-text-muted)]">
            Specific item requires quick human confirmation. 1-click promotion to READY.
          </p>

          <div className="flex-1 space-y-3 pt-1">
            {verifyCases.map((c) => (
              <CaseCard
                key={c.id}
                caseItem={c}
                onSelect={() => onSelectCase(c)}
                onAction={() => onVerifyCase(c.id)}
                actionLabel="1-Click Verify"
                actionType="verify"
              />
            ))}
            {verifyCases.length === 0 && (
              <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-[var(--color-border)] text-xs text-[var(--color-text-muted)]">
                No cases awaiting verification
              </div>
            )}
          </div>
        </div>

        {/* Column 3: EXCEPTION */}
        <div className="flex flex-col rounded-xl border border-[var(--color-exception-border)] bg-[var(--color-exception-bg)]/30 p-3">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--color-exception-border)]/50">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-[var(--color-exception)]" />
              <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">EXCEPTION</h3>
            </div>
            <span className="rounded-full bg-[var(--color-exception-bg)] px-2.5 py-0.5 text-xs font-bold text-[var(--color-exception)] border border-[var(--color-exception-border)]">
              {exceptionCases.length}
            </span>
          </div>
          <p className="py-2 text-[11px] text-[var(--color-text-muted)]">
            Clinical gap or unmet criteria. Automated physician query letter drafted.
          </p>

          <div className="flex-1 space-y-3 pt-1">
            {exceptionCases.map((c) => (
              <CaseCard
                key={c.id}
                caseItem={c}
                onSelect={() => onSelectCase(c)}
                actionLabel="Review Query"
                actionType="exception"
              />
            ))}
            {exceptionCases.length === 0 && (
              <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-[var(--color-border)] text-xs text-[var(--color-text-muted)]">
                No active exception cases
              </div>
            )}
          </div>
        </div>

        {/* Column 4: SUBMITTED / ACTIONED */}
        <div className="flex flex-col rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)] p-3">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)]">
            <div className="flex items-center space-x-2">
              <Send className="h-4 w-4 text-[var(--color-stripe-purple)]" />
              <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">SUBMITTED</h3>
            </div>
            <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-xs font-bold text-[var(--color-text-muted)] border border-[var(--color-border)]">
              {submittedCases.length}
            </span>
          </div>
          <p className="py-2 text-[11px] text-[var(--color-text-muted)]">
            EDI 278 dispatched to clearinghouse with assigned payer control number.
          </p>

          <div className="flex-1 space-y-3 pt-1">
            {submittedCases.map((c) => (
              <CaseCard
                key={c.id}
                caseItem={c}
                onSelect={() => onSelectCase(c)}
                actionLabel="View EDI 278"
                actionType="submitted"
              />
            ))}
            {submittedCases.length === 0 && (
              <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-[var(--color-border)] text-xs text-[var(--color-text-muted)]">
                Submit a READY case to view
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface CaseCardProps {
  caseItem: PriorAuthCase;
  onSelect: () => void;
  onAction?: () => void;
  actionLabel?: string;
  actionType: "ready" | "verify" | "exception" | "submitted";
}

function CaseCard({
  caseItem,
  onSelect,
  onAction,
  actionLabel,
  actionType
}: CaseCardProps) {
  const { patient, request, payer, criteriaEvaluation, status } = caseItem;

  const totalRules = criteriaEvaluation.totalRules;
  const metRules = criteriaEvaluation.rulesMet;
  const progressPercent = Math.round((metRules / totalRules) * 100);

  return (
    <div className="group rounded-lg border border-[var(--color-border)] bg-[var(--color-panel)] p-3.5 shadow-xs hover:border-[var(--color-stripe-purple)] hover:shadow-md transition-all">
      {/* Card Header: Patient & CPT badge */}
      <div className="flex items-start justify-between">
        <div>
          <span className="font-semibold text-sm text-[var(--color-text-primary)] group-hover:text-[var(--color-stripe-purple)] transition-colors">
            {patient.name}
          </span>
          <div className="flex items-center space-x-1.5 text-[11px] text-[var(--color-text-muted)] mt-0.5">
            <span>{patient.memberId}</span>
            <span>•</span>
            <span>{patient.gender}, age {new Date().getFullYear() - parseInt(patient.dob.slice(0, 4))}</span>
          </div>
        </div>

        <span className="rounded bg-[var(--color-panel-subtle)] px-2 py-0.5 text-xs font-mono font-medium text-[var(--color-stripe-purple)] border border-[var(--color-border)]">
          CPT {request.cptCode}
        </span>
      </div>

      {/* Procedure Description */}
      <div className="mt-2 text-xs font-medium text-[var(--color-text-secondary)] line-clamp-1">
        {request.cptDescription}
      </div>

      {/* Payer & Policy ID */}
      <div className="mt-1 flex items-center justify-between text-[11px] text-[var(--color-text-muted)]">
        <span className="truncate max-w-[170px]">{payer.name}</span>
        <span className="font-mono text-[10px]">{payer.policyGuidelineId}</span>
      </div>

      {/* Criteria Audit Progress Meter */}
      <div className="mt-3">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-[var(--color-text-muted)] font-medium">Criteria Audit</span>
          <span className="font-semibold text-[var(--color-text-primary)]">
            {metRules}/{totalRules} Met ({progressPercent}%)
          </span>
        </div>
        <div className="mt-1 h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              status === "READY"
                ? "bg-[var(--color-ready)]"
                : status === "VERIFY"
                ? "bg-[var(--color-verify)]"
                : "bg-[var(--color-exception)]"
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Flagged Line / Excerpt */}
      {status === "VERIFY" && (
        <div className="mt-2.5 rounded bg-[var(--color-verify-bg)] p-2 text-[11px] text-[var(--color-verify)] border border-[var(--color-verify-border)]">
          <span className="font-semibold">Needs Confirmation:</span> PT duration 5 wks clinic + 2 wks home exercise.
        </div>
      )}

      {status === "EXCEPTION" && (
        <div className="mt-2.5 rounded bg-[var(--color-exception-bg)] p-2 text-[11px] text-[var(--color-exception)] border border-[var(--color-exception-border)]">
          <span className="font-semibold">Deficiency:</span> Missing 12-mo TB screening & DMARD trial.
        </div>
      )}

      {status === "READY" && (
        <div className="mt-2.5 rounded bg-[var(--color-ready-bg)] p-2 text-[11px] text-[var(--color-ready)] border border-[var(--color-ready-border)]">
          <span className="font-semibold">Ready:</span> 100% criteria cited with verbatim EHR evidence.
        </div>
      )}

      {/* Action Footer */}
      <div className="mt-3 flex items-center justify-between pt-2.5 border-t border-[var(--color-border)]">
        <button
          onClick={onSelect}
          className="inline-flex items-center text-xs font-medium text-[var(--color-text-muted)] hover:text-[var(--color-stripe-purple)] transition-colors"
        >
          <FileText className="mr-1 h-3.5 w-3.5" />
          Triage Details
        </button>

        {onAction && actionLabel && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAction();
            }}
            className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium shadow-2xs transition-colors ${
              actionType === "ready"
                ? "bg-[var(--color-ready)] text-white hover:bg-emerald-700"
                : actionType === "verify"
                ? "bg-[var(--color-verify)] text-white hover:bg-amber-600"
                : actionType === "exception"
                ? "bg-[var(--color-exception)] text-white hover:bg-red-700"
                : "bg-[var(--color-stripe-purple)] text-white hover:bg-[var(--color-stripe-purple-hover)]"
            }`}
          >
            {actionLabel}
            <ArrowRight className="ml-1 h-3 w-3" />
          </button>
        )}
      </div>
    </div>
  );
}
