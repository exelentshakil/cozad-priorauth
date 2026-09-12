"use client";

import React, { useState } from "react";
import { PriorAuthCase } from "@/lib/types";
import {
  X,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Send,
  FileText,
  User,
  Building2,
  Calendar,
  Clock,
  Copy,
  Check,
  ArrowRight,
  ShieldCheck,
  Download,
  Terminal,
  Activity,
  ExternalLink
} from "lucide-react";

interface CaseDetailModalProps {
  caseItem: PriorAuthCase | null;
  onClose: () => void;
  onVerify: (caseId: string) => void;
  onSubmit: (caseId: string) => void;
}

export function CaseDetailModal({
  caseItem,
  onClose,
  onVerify,
  onSubmit
}: CaseDetailModalProps) {
  const [activeTab, setActiveTab] = useState<"criteria" | "clinical" | "payload" | "audit">("criteria");
  const [copied, setCopied] = useState(false);

  if (!caseItem) return null;

  const {
    id,
    patient,
    provider,
    payer,
    request,
    rawClinicalNotes,
    criteriaEvaluation,
    status,
    stage,
    submissionPayload,
    auditTrail
  } = caseItem;

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-[var(--color-border)] p-6 bg-[var(--color-panel-subtle)]">
          <div>
            <div className="flex items-center space-x-3">
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-[var(--color-panel)] border border-[var(--color-border)] text-[var(--color-stripe-purple)]">
                {id}
              </span>
              <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
                {patient.name}
              </h2>
              {status === "READY" && (
                <span className="inline-flex items-center rounded-full bg-[var(--color-ready-bg)] px-2.5 py-0.5 text-xs font-semibold text-[var(--color-ready)] border border-[var(--color-ready-border)]">
                  <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                  READY FOR SUBMISSION
                </span>
              )}
              {status === "VERIFY" && (
                <span className="inline-flex items-center rounded-full bg-[var(--color-verify-bg)] px-2.5 py-0.5 text-xs font-semibold text-[var(--color-verify)] border border-[var(--color-verify-border)]">
                  <AlertTriangle className="mr-1 h-3.5 w-3.5" />
                  NEEDS STAFF CONFIRMATION
                </span>
              )}
              {status === "EXCEPTION" && (
                <span className="inline-flex items-center rounded-full bg-[var(--color-exception-bg)] px-2.5 py-0.5 text-xs font-semibold text-[var(--color-exception)] border border-[var(--color-exception-border)]">
                  <AlertCircle className="mr-1 h-3.5 w-3.5" />
                  CLINICAL EXCEPTION / QUERY
                </span>
              )}
              {stage === "SUBMITTED" && (
                <span className="inline-flex items-center rounded-full bg-indigo-50 dark:bg-indigo-950/50 px-2.5 py-0.5 text-xs font-semibold text-[var(--color-stripe-purple)] border border-indigo-200 dark:border-indigo-800">
                  <Send className="mr-1 h-3.5 w-3.5" />
                  SUBMITTED
                </span>
              )}
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--color-text-muted)]">
              <span><strong>Member ID:</strong> {patient.memberId}</span>
              <span>•</span>
              <span><strong>Payer:</strong> {payer.name} ({payer.policyGuidelineId})</span>
              <span>•</span>
              <span><strong>Provider:</strong> {provider.name} (NPI: {provider.npi})</span>
              <span>•</span>
              <span><strong>Requested:</strong> CPT {request.cptCode} — {request.cptDescription}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-[var(--color-text-muted)] hover:bg-[var(--color-panel-hover)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-[var(--color-border)] px-6 bg-[var(--color-panel)]">
          <button
            onClick={() => setActiveTab("criteria")}
            className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "criteria"
                ? "border-[var(--color-stripe-purple)] text-[var(--color-stripe-purple)] font-semibold"
                : "border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
            }`}
          >
            Payer Criteria Audit ({criteriaEvaluation.rulesMet}/{criteriaEvaluation.totalRules} Met)
          </button>
          <button
            onClick={() => setActiveTab("clinical")}
            className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "clinical"
                ? "border-[var(--color-stripe-purple)] text-[var(--color-stripe-purple)] font-semibold"
                : "border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
            }`}
          >
            Clinical EHR Progress Note
          </button>
          <button
            onClick={() => setActiveTab("payload")}
            className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "payload"
                ? "border-[var(--color-stripe-purple)] text-[var(--color-stripe-purple)] font-semibold"
                : "border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
            }`}
          >
            EDI 278 & Draft Letters
          </button>
          <button
            onClick={() => setActiveTab("audit")}
            className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "audit"
                ? "border-[var(--color-stripe-purple)] text-[var(--color-stripe-purple)] font-semibold"
                : "border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
            }`}
          >
            Audit Trail ({auditTrail.length})
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: CRITERIA AUDIT */}
          {activeTab === "criteria" && (
            <div className="space-y-4">
              {/* Verdict Banner */}
              <div className={`rounded-xl p-4 border ${
                status === "READY"
                  ? "bg-[var(--color-ready-bg)] border-[var(--color-ready-border)] text-emerald-900 dark:text-emerald-200"
                  : status === "VERIFY"
                  ? "bg-[var(--color-verify-bg)] border-[var(--color-verify-border)] text-amber-900 dark:text-amber-200"
                  : "bg-[var(--color-exception-bg)] border-[var(--color-exception-border)] text-red-900 dark:text-red-200"
              }`}>
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-sm flex items-center space-x-1.5">
                      <ShieldCheck className="h-4 w-4" />
                      <span>{criteriaEvaluation.policyTitle} ({criteriaEvaluation.policyId})</span>
                    </h4>
                    <p className="mt-1 text-xs opacity-90">{criteriaEvaluation.verdictSummary}</p>
                  </div>

                  {/* Contextual Action Button */}
                  {status === "VERIFY" && (
                    <button
                      onClick={() => onVerify(id)}
                      className="ml-4 inline-flex items-center rounded-lg bg-[var(--color-verify)] px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-amber-600 transition-colors shrink-0"
                    >
                      <Check className="mr-1.5 h-3.5 w-3.5" />
                      Confirm & Promote to READY
                    </button>
                  )}

                  {status === "READY" && stage !== "SUBMITTED" && (
                    <button
                      onClick={() => onSubmit(id)}
                      className="ml-4 inline-flex items-center rounded-lg bg-[var(--color-ready)] px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 transition-colors shrink-0"
                    >
                      <Send className="mr-1.5 h-3.5 w-3.5" />
                      Submit Electronic 278 EDI
                    </button>
                  )}
                </div>
              </div>

              {/* Individual Rules Checklist */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Deterministic Rule Evaluation Checklist
                </h4>

                {criteriaEvaluation.rules.map((rule, idx) => (
                  <div
                    key={rule.id}
                    className={`rounded-xl border p-4 transition-all ${
                      rule.status === "MET"
                        ? "border-[var(--color-ready-border)] bg-[var(--color-ready-bg)]/20"
                        : rule.status === "NEEDS_CONFIRMATION"
                        ? "border-[var(--color-verify-border)] bg-[var(--color-verify-bg)]/25"
                        : "border-[var(--color-exception-border)] bg-[var(--color-exception-bg)]/25"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <span className="mt-0.5">
                          {rule.status === "MET" && <CheckCircle2 className="h-4 w-4 text-[var(--color-ready)]" />}
                          {rule.status === "NEEDS_CONFIRMATION" && <AlertTriangle className="h-4 w-4 text-[var(--color-verify)]" />}
                          {rule.status === "UNMET" && <AlertCircle className="h-4 w-4 text-[var(--color-exception)]" />}
                        </span>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-sm text-[var(--color-text-primary)]">
                              {rule.title}
                            </span>
                            <span className="font-mono text-[10px] text-[var(--color-text-muted)]">
                              [{rule.id}]
                            </span>
                            {rule.isRequired && (
                              <span className="rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[10px] font-medium text-[var(--color-text-muted)]">
                                Mandatory
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                            {rule.requirementDescription}
                          </p>
                        </div>
                      </div>

                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        rule.status === "MET"
                          ? "bg-[var(--color-ready-bg)] text-[var(--color-ready)] border border-[var(--color-ready-border)]"
                          : rule.status === "NEEDS_CONFIRMATION"
                          ? "bg-[var(--color-verify-bg)] text-[var(--color-verify)] border border-[var(--color-verify-border)]"
                          : "bg-[var(--color-exception-bg)] text-[var(--color-exception)] border border-[var(--color-exception-border)]"
                      }`}>
                        {rule.status === "MET" ? "MET" : rule.status === "NEEDS_CONFIRMATION" ? "CONFIRMATION NEEDED" : "UNMET"}
                      </span>
                    </div>

                    {/* Cited Verbatim Evidence Quote */}
                    {rule.citedEvidence && (
                      <div className="mt-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel)] p-3 text-xs">
                        <span className="font-semibold text-[var(--color-text-muted)] block mb-1">
                          Cited Clinical Evidence from EHR:
                        </span>
                        <p className="italic text-[var(--color-text-primary)]">
                          "{rule.citedEvidence}"
                        </p>
                      </div>
                    )}

                    {/* Verification Prompt for Staff */}
                    {rule.verificationPrompt && (
                      <div className="mt-3 rounded-lg border border-[var(--color-verify-border)] bg-[var(--color-verify-bg)] p-3 text-xs text-[var(--color-verify)]">
                        <span className="font-bold block mb-1">Staff Verification Item:</span>
                        <p>{rule.verificationPrompt}</p>
                      </div>
                    )}

                    {/* Deficiency Note for Exceptions */}
                    {rule.deficiencyNote && (
                      <div className="mt-3 rounded-lg border border-[var(--color-exception-border)] bg-[var(--color-exception-bg)] p-3 text-xs text-[var(--color-exception)]">
                        <span className="font-bold block mb-1">Deficiency Finding:</span>
                        <p>{rule.deficiencyNote}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: CLINICAL NOTES */}
          {activeTab === "clinical" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[var(--color-text-muted)]">
                  Synthetic EHR Ingested Document (Encrypted at Rest)
                </span>
                <button
                  onClick={() => handleCopyText(rawClinicalNotes)}
                  className="inline-flex items-center text-xs text-[var(--color-stripe-purple)] hover:underline"
                >
                  {copied ? <Check className="mr-1 h-3.5 w-3.5" /> : <Copy className="mr-1 h-3.5 w-3.5" />}
                  {copied ? "Copied Note" : "Copy Note Text"}
                </button>
              </div>

              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-subtle)] p-4 font-mono text-xs text-[var(--color-text-primary)] whitespace-pre-wrap leading-relaxed max-h-[500px] overflow-y-auto">
                {rawClinicalNotes}
              </div>
            </div>
          )}

          {/* TAB 3: EDI 278 & DRAFT LETTERS */}
          {activeTab === "payload" && (
            <div className="space-y-4">
              {submissionPayload?.draftAppealOrNecessityLetter && (
                <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)] p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-bold text-[var(--color-text-primary)]">
                      Generated Letter of Medical Necessity Draft
                    </h4>
                    <button
                      onClick={() => handleCopyText(submissionPayload.draftAppealOrNecessityLetter || "")}
                      className="inline-flex items-center text-xs text-[var(--color-stripe-purple)] hover:underline"
                    >
                      <Copy className="mr-1 h-3.5 w-3.5" />
                      Copy Letter
                    </button>
                  </div>
                  <pre className="rounded-lg bg-[var(--color-bg)] p-3 text-xs text-[var(--color-text-secondary)] whitespace-pre-wrap font-mono">
                    {submissionPayload.draftAppealOrNecessityLetter}
                  </pre>
                </div>
              )}

              {submissionPayload?.draftPhysicianQuery && (
                <div className="rounded-xl border border-[var(--color-exception-border)] bg-[var(--color-exception-bg)]/20 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-bold text-[var(--color-exception)]">
                      Automated Physician Clinical Query (For Missing Criteria)
                    </h4>
                    <button
                      onClick={() => handleCopyText(submissionPayload.draftPhysicianQuery || "")}
                      className="inline-flex items-center text-xs text-[var(--color-exception)] hover:underline font-semibold"
                    >
                      <Copy className="mr-1 h-3.5 w-3.5" />
                      Copy Query
                    </button>
                  </div>
                  <pre className="rounded-lg bg-[var(--color-panel)] p-3 text-xs text-[var(--color-text-secondary)] whitespace-pre-wrap font-mono border border-[var(--color-exception-border)]">
                    {submissionPayload.draftPhysicianQuery}
                  </pre>
                </div>
              )}

              {submissionPayload?.electronicPayloadJson && (
                <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)] p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-bold text-[var(--color-text-primary)] flex items-center space-x-1.5">
                      <Terminal className="h-4 w-4 text-[var(--color-stripe-purple)]" />
                      <span>Electronic Transaction Payload ({submissionPayload.transactionFormat})</span>
                    </h4>
                    <span className="font-mono text-xs text-[var(--color-text-muted)]">
                      Ref: {submissionPayload.trackingReference}
                    </span>
                  </div>
                  <pre className="rounded-lg bg-[var(--color-bg)] p-3 text-xs text-[var(--color-stripe-purple)] font-mono overflow-x-auto">
                    {JSON.stringify(submissionPayload.electronicPayloadJson, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: AUDIT TRAIL */}
          {activeTab === "audit" && (
            <div className="space-y-4">
              <p className="text-xs text-[var(--color-text-muted)]">
                Immutable chronological event record for HIPAA compliance audit and payer accountability.
              </p>

              <div className="relative border-l border-[var(--color-border)] pl-4 ml-2 space-y-6">
                {auditTrail.map((log) => (
                  <div key={log.id} className="relative">
                    <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-[var(--color-stripe-purple)] ring-4 ring-[var(--color-panel)]" />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-xs text-[var(--color-text-primary)]">
                          {log.action}
                        </span>
                        <span className="text-[11px] text-[var(--color-text-muted)]">
                          • {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                        {log.details}
                      </p>
                      <span className="text-[10px] text-[var(--color-text-muted)] font-mono">
                        Performer: {log.performedBy}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Bar */}
        <div className="flex items-center justify-between border-t border-[var(--color-border)] bg-[var(--color-panel-subtle)] p-4">
          <div className="text-xs text-[var(--color-text-muted)]">
            Cozad Medical Ops AI Pipeline • Zero Data Retention Mode
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="rounded-lg border border-[var(--color-border)] bg-[var(--color-panel)] px-4 py-2 text-xs font-semibold text-[var(--color-text-secondary)] hover:bg-[var(--color-panel-hover)] transition-colors"
            >
              Close
            </button>

            {status === "VERIFY" && (
              <button
                onClick={() => {
                  onVerify(id);
                  onClose();
                }}
                className="rounded-lg bg-[var(--color-verify)] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-amber-600 transition-colors"
              >
                Approve Verification & Promote
              </button>
            )}

            {status === "READY" && stage !== "SUBMITTED" && (
              <button
                onClick={() => {
                  onSubmit(id);
                  onClose();
                }}
                className="rounded-lg bg-[var(--color-ready)] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 transition-colors"
              >
                Submit Electronic 278 EDI
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
