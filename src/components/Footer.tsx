"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Clock,
  DollarSign,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  ExternalLink,
  Code,
  Layers,
  Sparkles,
  Lock,
  Cpu
} from "lucide-react";

export function Footer() {
  const [pitchExpanded, setPitchExpanded] = useState(false);

  return (
    <footer className="mt-20 border-t border-[var(--color-border)] bg-[var(--color-panel)] py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Summary Bar: Enterprise Architecture Framing */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-8 border-b border-[var(--color-border)]">
          <div>
            <div className="flex items-center space-x-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--color-stripe-purple)] text-white">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <span className="text-base font-bold text-[var(--color-text-primary)]">
                Cozad Medical Ops — AI Prior Auth Architecture
              </span>
            </div>
            <p className="mt-1 text-xs text-[var(--color-text-muted)] max-w-xl">
              AI-first prior authorization pipeline combining non-deterministic clinical extraction with deterministic payer LCD/NCD rule validation.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center space-x-6">
            <div>
              <span className="text-[11px] text-[var(--color-text-muted)] font-medium block">Turnaround Velocity</span>
              <span className="text-base font-bold text-[var(--color-text-primary)] font-mono">48–72 Hours</span>
            </div>
            <div className="h-8 w-px bg-[var(--color-border)]" />
            <div>
              <span className="text-[11px] text-[var(--color-text-muted)] font-medium block">Pilot Scope Investment</span>
              <span className="text-base font-bold text-[var(--color-stripe-purple)] font-mono">$250 Fixed</span>
            </div>
            <div className="h-8 w-px bg-[var(--color-border)]" />
            <div>
              <span className="text-[11px] text-[var(--color-text-muted)] font-medium block">Target Automation</span>
              <span className="text-base font-bold text-[var(--color-ready)] font-mono">92%+ Touchless</span>
            </div>
          </div>
        </div>

        {/* 4 Architectural Decision Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-subtle)] p-4">
            <span className="text-xs font-bold text-[var(--color-text-primary)] flex items-center space-x-1.5">
              <Cpu className="h-3.5 w-3.5 text-[var(--color-stripe-purple)]" />
              <span>Deterministic Payer Check</span>
            </span>
            <p className="mt-1 text-[11px] text-[var(--color-text-muted)]">
              Coverage rules are evaluated by deterministic code against explicit LCD/NCD criteria, preventing AI hallucinations.
            </p>
          </div>

          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-subtle)] p-4">
            <span className="text-xs font-bold text-[var(--color-text-primary)] flex items-center space-x-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              <span>Grounded Evidence Citation</span>
            </span>
            <p className="mt-1 text-[11px] text-[var(--color-text-muted)]">
              Every satisfied or deficient requirement is backed by verbatim sentence quotes from the patient's EHR records.
            </p>
          </div>

          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-subtle)] p-4">
            <span className="text-xs font-bold text-[var(--color-text-primary)] flex items-center space-x-1.5">
              <Layers className="h-3.5 w-3.5 text-blue-500" />
              <span>Zero-Drag Triage Routing</span>
            </span>
            <p className="mt-1 text-[11px] text-[var(--color-text-muted)]">
              Routine cases route to READY with generated 278 EDI payloads. Staff intervene only on VERIFY (1-click) and EXCEPTION.
            </p>
          </div>

          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-subtle)] p-4">
            <span className="text-xs font-bold text-[var(--color-text-primary)] flex items-center space-x-1.5">
              <Lock className="h-3.5 w-3.5 text-amber-500" />
              <span>Zero-Lock-In SaaS Blueprint</span>
            </span>
            <p className="mt-1 text-[11px] text-[var(--color-text-muted)]">
              Turnkey SaaS stack (Airtable + Make + OpenAI BAA) costs ~$110/mo, 100% owned by Cozad Medical Ops.
            </p>
          </div>
        </div>

        {/* Expandable Cover Letter & Upwork Bid Section */}
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel-subtle)] overflow-hidden">
          <button
            onClick={() => setPitchExpanded(!pitchExpanded)}
            className="w-full flex items-center justify-between p-5 text-left hover:bg-[var(--color-panel-hover)] transition-colors"
          >
            <div className="flex items-center space-x-3">
              <Sparkles className="h-4 w-4 text-[var(--color-stripe-purple)]" />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] block">
                  Proposal & Implementation Scope
                </span>
                <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                  Review Shakil's Upwork Bid Proposal & Screening Answers
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-xs text-[var(--color-stripe-purple)] font-medium">
              <span>{pitchExpanded ? "Hide Proposal" : "Read Proposal"}</span>
              {pitchExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
          </button>

          {pitchExpanded && (
            <div className="p-6 border-t border-[var(--color-border)] space-y-6 text-xs text-[var(--color-text-secondary)] leading-relaxed">
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)] p-5 space-y-3 font-mono">
                <p className="text-[var(--color-text-primary)]">
                  you are worried about ungrounded ai inventing facts or making unauthorized coverage determinations, and employees wasting hours manually running prompts and moving cards around.
                </p>

                <p>
                  live: <a href="https://cozad-priorauth.vercel.app" target="_blank" rel="noopener noreferrer" className="text-[var(--color-stripe-purple)] underline">https://cozad-priorauth.vercel.app</a><br />
                  code: <a href="https://github.com/exelentshakil/cozad-priorauth" target="_blank" rel="noopener noreferrer" className="text-[var(--color-stripe-purple)] underline">https://github.com/exelentshakil/cozad-priorauth</a><br />
                  portfolio: <a href="https://shakilhq.com" target="_blank" rel="noopener noreferrer" className="text-[var(--color-stripe-purple)] underline">https://shakilhq.com</a>
                </p>

                <p>
                  i already built your end-to-end workflow on the link above. it ingests clinical notes, extracts parameters with zero manual prompts, checks them deterministically against medicare lcd l38924 and uhc criteria, and routes cases into ready, verify, and exception queues with cited quotes.
                </p>

                <p>
                  the live clearinghouse sftp connection is simulated with real edi 278 payloads.
                </p>

                <p>
                  4 years leading engineering at legiit, ai dashboards on a 2m+ user platform.
                </p>

                <p>
                  are you planning to use airtable or clickup for your employee board, and would you like to jump on a quick 10-minute walkthrough today?
                </p>
              </div>

              {/* Answers to Client Screening Questions */}
              <div className="space-y-4 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-primary)]">
                  Screening Questions & Direct Technical Responses
                </h4>

                <div className="space-y-3">
                  <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-panel)] p-3">
                    <span className="font-bold text-[var(--color-text-primary)] block mb-1">
                      1. What exact stack/tools would you use to implement the attached workflow, and why?
                    </span>
                    <p className="text-[11px] text-[var(--color-text-muted)]">
                      Lean, 100% client-owned SaaS stack: <strong>Jotform HIPAA / Typeform</strong> for secure encrypted intake with BAA; <strong>Make.com (Pro) or Inngest</strong> for webhook orchestration; <strong>OpenAI Enterprise API (with executed BAA)</strong> for zero-data-retention parameter extraction; <strong>Airtable Team / Enterprise</strong> for the visual triage board (READY/VERIFY/EXCEPTION); and <strong>Vercel Edge API</strong> for the deterministic payer rules engine. This keeps software overhead under ~$110/mo with zero vendor lock-in.
                    </p>
                  </div>

                  <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-panel)] p-3">
                    <span className="font-bold text-[var(--color-text-primary)] block mb-1">
                      2. Can you demonstrate a working end-to-end flow using synthetic data within 48–72 hours?
                    </span>
                    <p className="text-[11px] text-[var(--color-text-muted)]">
                      Yes. The working flow is already built and live right now at <a href="https://cozad-priorauth.vercel.app" className="text-[var(--color-stripe-purple)] underline">cozad-priorauth.vercel.app</a> with 3 synthetic test cases covering READY (Knee Arthroscopy), VERIFY (Lumbar MRI with 5 weeks PT), and EXCEPTION (Biologic Humira missing TB test).
                    </p>
                  </div>

                  <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-panel)] p-3">
                    <span className="font-bold text-[var(--color-text-primary)] block mb-1">
                      3. Describe your experience with HIPAA-aware healthcare workflows, FHIR, or healthcare API integrations.
                    </span>
                    <p className="text-[11px] text-[var(--color-text-muted)]">
                      Extensive experience designing HIPAA-compliant architectures including signed Business Associate Agreements (BAAs), zero-retention LLM inference, encrypted at-rest storage, role-based access control, FHIR ClaimRequest/Coverage resources, and X12 EDI 278 prior authorization transaction generation.
                    </p>
                  </div>

                  <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-panel)] p-3">
                    <span className="font-bold text-[var(--color-text-primary)] block mb-1">
                      4. What exact stack/tools would you use to connect the intake form to the LLM and the workspace board?
                    </span>
                    <p className="text-[11px] text-[var(--color-text-muted)]">
                      Secure intake webhook &rarr; Make.com / Inngest router &rarr; Edge API calling OpenAI with strict Zod JSON Schema &rarr; Deterministic Payer Rule Validator &rarr; Airtable API to update columns (READY / VERIFY / EXCEPTION) with pre-filled 278 payloads or physician query letters.
                    </p>
                  </div>

                  <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-panel)] p-3">
                    <span className="font-bold text-[var(--color-text-primary)] block mb-1">
                      5. How would you design this workflow to minimize manual employee steps while safely handling READY, VERIFY, and EXCEPTION cases?
                    </span>
                    <p className="text-[11px] text-[var(--color-text-muted)]">
                      Routine cases require 0 employee copying or stage advancement: incoming notes are parsed, evaluated against payer LCDs, and landed directly in READY with prepared 278 payloads. If 1 specific item needs human sign-off (e.g. 5 weeks PT + home exercise vs 6 weeks requirement), it lands in VERIFY with a 1-click confirmation button. Incomplete cases route to EXCEPTION with an automatically drafted Physician Query Letter citing the exact missing criteria.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Attribution */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-[var(--color-text-muted)] pt-6 border-t border-[var(--color-border)]">
          <p>© {new Date().getFullYear()} Cozad Medical Ops Workflow Implementation. Designed by Shakil Ahmed (BarakahSoft LLC).</p>
          <div className="mt-2 sm:mt-0 flex items-center space-x-4">
            <a href="https://github.com/exelentshakil/cozad-priorauth" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-text-primary)] transition-colors">
              GitHub Repo
            </a>
            <span>•</span>
            <a href="https://shakilhq.com" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-text-primary)] transition-colors">
              shakilhq.com
            </a>
            <span>•</span>
            <span>Upwork Expert Bid</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
