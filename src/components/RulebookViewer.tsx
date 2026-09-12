"use client";

import React, { useState } from "react";
import { PAYER_POLICIES } from "@/lib/rules-engine";
import {
  BookOpen,
  ShieldCheck,
  CheckCircle,
  FileCheck,
  Lock,
  Sparkles,
  Code,
  FileText,
  Building,
  HelpCircle,
  ExternalLink
} from "lucide-react";

export function RulebookViewer() {
  const policyKeys = Object.keys(PAYER_POLICIES);
  const [selectedKey, setSelectedKey] = useState(policyKeys[0]);
  const currentPolicy = PAYER_POLICIES[selectedKey];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header & Architectural Explainer */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="rounded-md bg-[var(--color-stripe-purple)]/10 p-2 text-[var(--color-stripe-purple)]">
                <BookOpen className="h-5 w-5" />
              </span>
              <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
                Deterministic Payer Rulebook
              </h2>
            </div>
            <p className="mt-1 text-xs text-[var(--color-text-muted)] max-w-3xl">
              Official Local Coverage Determinations (LCD), National Coverage Determinations (NCD), and Payer Clinical Policy Bulletins (CPB) implemented as audit-grade deterministic rule logic.
            </p>
          </div>

          <div className="rounded-lg bg-[var(--color-ready-bg)] border border-[var(--color-ready-border)] px-3 py-2 text-xs text-[var(--color-ready)] font-medium flex items-center space-x-2">
            <ShieldCheck className="h-4 w-4 shrink-0" />
            <span>0% Hallucination Guarantee: Code Evaluates Rules, Not LLM</span>
          </div>
        </div>

        {/* Why this architecture wins */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-[var(--color-border)]">
          <div className="rounded-xl bg-[var(--color-panel-subtle)] p-3 border border-[var(--color-border-subtle)]">
            <span className="text-xs font-bold text-[var(--color-text-primary)] flex items-center space-x-1.5">
              <Sparkles className="h-3.5 w-3.5 text-[var(--color-stripe-purple)]" />
              <span>1. AI Role (Extraction Only)</span>
            </span>
            <p className="mt-1 text-[11px] text-[var(--color-text-muted)]">
              The LLM parses messy physician notes and maps clinical evidence (durations, lab values, tests) to a typed Zod schema.
            </p>
          </div>

          <div className="rounded-xl bg-[var(--color-panel-subtle)] p-3 border border-[var(--color-border-subtle)]">
            <span className="text-xs font-bold text-[var(--color-text-primary)] flex items-center space-x-1.5">
              <Code className="h-3.5 w-3.5 text-blue-500" />
              <span>2. Engine Role (Deterministic Logic)</span>
            </span>
            <p className="mt-1 text-[11px] text-[var(--color-text-muted)]">
              Strict rules check if conservative therapy &ge; 6 weeks, if TB tests are &le; 12 months, and if X-rays exclude severe OA.
            </p>
          </div>

          <div className="rounded-xl bg-[var(--color-panel-subtle)] p-3 border border-[var(--color-border-subtle)]">
            <span className="text-xs font-bold text-[var(--color-text-primary)] flex items-center space-x-1.5">
              <Lock className="h-3.5 w-3.5 text-emerald-500" />
              <span>3. Legal & HIPAA Compliance</span>
            </span>
            <p className="mt-1 text-[11px] text-[var(--color-text-muted)]">
              No black-box decisions. If a claim is audited, every single criteria match is accompanied by an exact sentence quote.
            </p>
          </div>
        </div>
      </div>

      {/* Policy Selector Tabs */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {policyKeys.map((key) => {
          const p = PAYER_POLICIES[key];
          const isSelected = selectedKey === key;
          return (
            <button
              key={key}
              onClick={() => setSelectedKey(key)}
              className={`rounded-xl px-4 py-3 text-left border transition-all shrink-0 ${
                isSelected
                  ? "border-[var(--color-stripe-purple)] bg-[var(--color-stripe-purple)]/5 shadow-xs"
                  : "border-[var(--color-border)] bg-[var(--color-panel)] hover:border-[var(--color-stripe-purple)]/50"
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className="font-mono text-[10px] text-[var(--color-text-muted)] font-semibold">
                  {p.policyId}
                </span>
                <span className="rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 text-[10px] text-[var(--color-text-muted)]">
                  CPT {p.applicableCptCodes.join(", ")}
                </span>
              </div>
              <h4 className="mt-1 text-xs font-bold text-[var(--color-text-primary)]">
                {p.payerName}
              </h4>
            </button>
          );
        })}
      </div>

      {/* Policy Rule Detail Card */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] p-6 shadow-xs space-y-6">
        <div>
          <span className="font-mono text-xs text-[var(--color-stripe-purple)] font-semibold">
            {currentPolicy.policyId}
          </span>
          <h3 className="text-lg font-bold text-[var(--color-text-primary)] mt-0.5">
            {currentPolicy.policyTitle}
          </h3>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">
            Governing Payer: <strong>{currentPolicy.payerName}</strong> • Applicable CPT Codes: {currentPolicy.applicableCptCodes.join(", ")}
          </p>
        </div>

        {/* Rules List */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
            Configured Clinical Evaluation Rules ({currentPolicy.rules.length} Total)
          </h4>

          <div className="grid grid-cols-1 gap-3">
            {currentPolicy.rules.map((rule, idx) => (
              <div
                key={rule.id}
                className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-subtle)] p-4 flex flex-col md:flex-row md:items-start md:justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-stripe-purple)]/10 text-[10px] font-bold text-[var(--color-stripe-purple)]">
                      {idx + 1}
                    </span>
                    <h5 className="text-sm font-semibold text-[var(--color-text-primary)]">
                      {rule.title}
                    </h5>
                    <span className="font-mono text-[10px] text-[var(--color-text-muted)]">
                      [{rule.id}]
                    </span>
                    {rule.isRequired && (
                      <span className="rounded bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 px-1.5 py-0.2 text-[10px] font-semibold border border-rose-200 dark:border-rose-900">
                        Mandatory
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[var(--color-text-secondary)] pl-7">
                    {rule.requirementDescription}
                  </p>
                </div>

                <div className="rounded-lg bg-[var(--color-panel)] px-3 py-1.5 text-[11px] text-[var(--color-text-muted)] border border-[var(--color-border)] shrink-0 self-start md:self-auto">
                  Category: <strong>{rule.category}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
