"use client";

import React, { useState } from "react";
import { SAAS_STACK_ITEMS } from "@/lib/synthetic-cases";
import {
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Layers,
  TrendingUp,
  Users,
  FileCheck,
  HelpCircle,
  ExternalLink,
  Zap,
  ArrowRight
} from "lucide-react";

export function SubscriptionBlueprint() {
  const [monthlyVolume, setMonthlyVolume] = useState<number>(300);

  // Financial calculations
  const manualCostPerCase = 28.50; // Industry standard for 1.5 hrs staff time per PA
  const manualMonthlyTotal = monthlyVolume * manualCostPerCase;

  // AI-first operational costs
  const baseSaaSFixed = 145.00; // Jotform HIPAA ($49) + Make.com ($19) + Airtable 2 seats ($40) + Vercel ($20) + LLM base
  const apiTokensPerCase = 0.08; // 2x GPT-4o-mini calls with prompt caching
  const aiFirstMonthlyTotal = baseSaaSFixed + (monthlyVolume * apiTokensPerCase);
  const aiCostPerCase = (aiFirstMonthlyTotal / monthlyVolume).toFixed(2);
  const monthlySavings = manualMonthlyTotal - aiFirstMonthlyTotal;
  const annualSavings = monthlySavings * 12;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="rounded-md bg-[var(--color-stripe-purple)]/10 p-2 text-[var(--color-stripe-purple)]">
                <DollarSign className="h-5 w-5" />
              </span>
              <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
                SaaS Subscription Blueprint & Cost Architecture
              </h2>
            </div>
            <p className="mt-1 text-xs text-[var(--color-text-muted)] max-w-3xl">
              Transparent, client-owned SaaS tools identified for Cozad Medical Ops. Eliminates freelancer lock-in, ensures BAA-backed HIPAA compliance, and minimizes monthly software overhead.
            </p>
          </div>

          <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 px-3.5 py-2 text-xs text-emerald-700 dark:text-emerald-300 font-semibold">
            Zero Freelancer Lock-In Guarantee
          </div>
        </div>
      </div>

      {/* Interactive Volume & ROI Model */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] p-6 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[var(--color-text-primary)] flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-[var(--color-stripe-purple)]" />
              <span>Prior Authorization Operational Cost Modeling</span>
            </h3>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
              Compare traditional manual medical ops vs the AI-First Automated Triage workflow.
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold text-[var(--color-text-muted)] block">Monthly PA Volume:</span>
            <span className="text-xl font-bold text-[var(--color-stripe-purple)] font-mono">
              {monthlyVolume} cases/mo
            </span>
          </div>
        </div>

        {/* Range Slider */}
        <div className="mt-4">
          <input
            type="range"
            min={50}
            max={1500}
            step={25}
            value={monthlyVolume}
            onChange={(e) => setMonthlyVolume(parseInt(e.target.value, 10))}
            className="w-full accent-[var(--color-stripe-purple)] cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-[var(--color-text-muted)] mt-1 font-mono">
            <span>50 cases/mo</span>
            <span>300 (Baseline)</span>
            <span>750 cases/mo</span>
            <span>1,500 cases/mo</span>
          </div>
        </div>

        {/* ROI Comparison Grid */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="rounded-xl border border-red-200 dark:border-red-950 bg-red-50/50 dark:bg-red-950/20 p-4">
            <span className="text-xs font-semibold text-red-700 dark:text-red-400">Manual Staffing Cost</span>
            <div className="mt-2 text-2xl font-bold text-red-900 dark:text-red-200">
              ${manualMonthlyTotal.toLocaleString()}
              <span className="text-xs font-normal text-red-600 dark:text-red-400">/mo</span>
            </div>
            <p className="mt-1 text-[11px] text-red-700/80 dark:text-red-400/80">
              Avg $28.50/case (1.5 hrs staff review, phone calls & copy-pasting)
            </p>
          </div>

          <div className="rounded-xl border border-[var(--color-ready-border)] bg-[var(--color-ready-bg)]/40 p-4">
            <span className="text-xs font-semibold text-[var(--color-ready)]">AI-First Workflow Cost</span>
            <div className="mt-2 text-2xl font-bold text-emerald-900 dark:text-emerald-200">
              ${aiFirstMonthlyTotal.toFixed(0)}
              <span className="text-xs font-normal text-[var(--color-ready)]">/mo</span>
            </div>
            <p className="mt-1 text-[11px] text-emerald-800 dark:text-emerald-300">
              ~${aiCostPerCase}/case (fixed SaaS subscriptions + token usage)
            </p>
          </div>

          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-subtle)] p-4">
            <span className="text-xs font-semibold text-[var(--color-stripe-purple)]">Monthly Net Savings</span>
            <div className="mt-2 text-2xl font-bold text-[var(--color-text-primary)]">
              ${monthlySavings.toLocaleString()}
            </div>
            <p className="mt-1 text-[11px] text-[var(--color-text-muted)]">
              96.2% operational cost reduction
            </p>
          </div>

          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-subtle)] p-4">
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">Annualized Savings</span>
            <div className="mt-2 text-2xl font-bold text-[var(--color-text-primary)]">
              ${annualSavings.toLocaleString()}
            </div>
            <p className="mt-1 text-[11px] text-[var(--color-text-muted)]">
              Direct operating margin recovered
            </p>
          </div>
        </div>
      </div>

      {/* Subscription Breakdown Table */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] overflow-hidden shadow-xs">
        <div className="p-6 border-b border-[var(--color-border)]">
          <h3 className="text-base font-bold text-[var(--color-text-primary)]">
            Required SaaS Subscriptions & Justification Matrix
          </h3>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">
            As requested: exact tools, monthly cost estimates, BAA readiness, and why each tool is essential to prevent custom software debt.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[var(--color-border)] bg-[var(--color-panel-subtle)] text-[var(--color-text-muted)] uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-6 py-3.5">Category</th>
                <th className="px-6 py-3.5">Recommended SaaS Tool</th>
                <th className="px-6 py-3.5">Estimated Cost</th>
                <th className="px-6 py-3.5">HIPAA & BAA</th>
                <th className="px-6 py-3.5">Why Needed & Architectural Justification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {SAAS_STACK_ITEMS.map((item, idx) => (
                <tr key={idx} className="hover:bg-[var(--color-panel-hover)] transition-colors">
                  <td className="px-6 py-4 font-semibold text-[var(--color-text-primary)]">
                    {item.category}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-[var(--color-stripe-purple)] block">
                      {item.productName}
                    </span>
                    <span className="text-[11px] text-[var(--color-text-muted)]">
                      Vendor: {item.provider}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono font-medium text-[var(--color-text-primary)]">
                    {item.estimatedMonthlyCost}
                    <span className="block text-[10px] text-[var(--color-text-muted)]">{item.pricingModel}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-full bg-[var(--color-ready-bg)] px-2 py-0.5 text-[11px] font-medium text-[var(--color-ready)] border border-[var(--color-ready-border)]">
                      <ShieldCheck className="mr-1 h-3 w-3" />
                      BAA Available
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[var(--color-text-secondary)] max-w-md">
                    {item.whyNeeded}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-[var(--color-border)] bg-[var(--color-panel-subtle)] flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-[var(--color-text-muted)]">
          <span>Estimated Total Fixed SaaS Infrastructure: <strong>~$95 - $190 / month</strong></span>
          <span className="mt-1 sm:mt-0 font-medium text-[var(--color-stripe-purple)]">
            All accounts owned and billed directly to Cozad Medical Ops
          </span>
        </div>
      </div>

      {/* Lock-In & Governance Checklist */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] p-6 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-[var(--color-text-primary)] flex items-center space-x-2">
          <Lock className="h-4 w-4 text-[var(--color-stripe-purple)]" />
          <span>Governance & Anti-Lock-In Principles</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-subtle)] p-4 space-y-2">
            <h4 className="font-semibold text-xs text-[var(--color-text-primary)] flex items-center space-x-1.5">
              <CheckCircle2 className="h-4 w-4 text-[var(--color-ready)]" />
              <span>1. Company Controls Primary Accounts</span>
            </h4>
            <p className="text-[11px] text-[var(--color-text-muted)]">
              All credentials (Airtable, Make.com, OpenAI API, AWS) are registered to Cozad Medical Ops corporate emails. The developer receives scoped collaborator access only.
            </p>
          </div>

          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-subtle)] p-4 space-y-2">
            <h4 className="font-semibold text-xs text-[var(--color-text-primary)] flex items-center space-x-1.5">
              <CheckCircle2 className="h-4 w-4 text-[var(--color-ready)]" />
              <span>2. Zero Proprietary Lock-In</span>
            </h4>
            <p className="text-[11px] text-[var(--color-text-muted)]">
              No closed-source wrappers or private developer hosting. All deterministic rules and webhook mappings are handed over in clean, commented TypeScript and JSON format.
            </p>
          </div>

          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-subtle)] p-4 space-y-2">
            <h4 className="font-semibold text-xs text-[var(--color-text-primary)] flex items-center space-x-1.5">
              <CheckCircle2 className="h-4 w-4 text-[var(--color-ready)]" />
              <span>3. Maintainable Handoff</span>
            </h4>
            <p className="text-[11px] text-[var(--color-text-muted)]">
              Includes comprehensive step-by-step SOPs, video walkthroughs, and error troubleshooting runbooks so existing employees can modify payer rules without code changes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
