"use client";

import React, { useState } from "react";
import { PriorAuthCase } from "@/lib/types";
import { INITIAL_SYNTHETIC_CASES } from "@/lib/synthetic-cases";
import { Navbar } from "@/components/Navbar";
import { KanbanBoard } from "@/components/KanbanBoard";
import { CaseDetailModal } from "@/components/CaseDetailModal";
import { RulebookViewer } from "@/components/RulebookViewer";
import { SubscriptionBlueprint } from "@/components/SubscriptionBlueprint";
import { IntakeForm } from "@/components/IntakeForm";
import { Footer } from "@/components/Footer";
import { generateSubmissionPayload } from "@/lib/rules-engine";

export default function Home() {
  const [cases, setCases] = useState<PriorAuthCase[]>(INITIAL_SYNTHETIC_CASES);
  const [activeTab, setActiveTab] = useState<"board" | "rulebook" | "intake" | "subscriptions">("board");
  const [selectedCase, setSelectedCase] = useState<PriorAuthCase | null>(null);

  // Case counts for badge
  const caseCount = {
    ready: cases.filter(c => c.status === "READY" && c.stage !== "SUBMITTED").length,
    verify: cases.filter(c => c.status === "VERIFY").length,
    exception: cases.filter(c => c.status === "EXCEPTION").length,
  };

  // 1-Click Verification
  const handleVerifyCase = (caseId: string) => {
    setCases(prev => prev.map(c => {
      if (c.id === caseId) {
        const updatedRules = c.criteriaEvaluation.rules.map(r => {
          if (r.status === "NEEDS_CONFIRMATION") {
            return {
              ...r,
              status: "MET" as const,
              citedEvidence: (r.citedEvidence || "") + " [Staff Verified: Documented home exercises validated by clinical coordinator]"
            };
          }
          return r;
        });

        const updatedEval = {
          ...c.criteriaEvaluation,
          rules: updatedRules,
          rulesMet: updatedRules.filter(r => r.status === "MET").length,
          rulesNeedingConfirmation: 0,
          overallStatus: "READY" as const,
          verdictSummary: "All criteria verified and confirmed by clinical staff. Ready for electronic submission."
        };

        const updatedPayload = generateSubmissionPayload(
          c.id,
          c.patient.name,
          c.patient.memberId,
          c.request.cptCode,
          c.request.cptDescription,
          "READY",
          updatedEval
        );

        const updatedCase: PriorAuthCase = {
          ...c,
          status: "READY",
          stage: "READY",
          criteriaEvaluation: updatedEval,
          submissionPayload: updatedPayload,
          auditTrail: [
            ...c.auditTrail,
            {
              id: `AUD-VERIFY-${Date.now()}`,
              timestamp: new Date().toISOString(),
              action: "STAFF_VERIFICATION_CONFIRMED",
              performedBy: "Clinical Coordinator (Staff)",
              details: "Confirmed home therapy completion. Promoted case from VERIFY to READY queue."
            }
          ]
        };

        if (selectedCase?.id === caseId) {
          setSelectedCase(updatedCase);
        }

        return updatedCase;
      }
      return c;
    }));
  };

  // Submit EDI 278
  const handleSubmitCase = (caseId: string) => {
    setCases(prev => prev.map(c => {
      if (c.id === caseId) {
        const updatedCase: PriorAuthCase = {
          ...c,
          stage: "SUBMITTED",
          auditTrail: [
            ...c.auditTrail,
            {
              id: `AUD-SUBMIT-${Date.now()}`,
              timestamp: new Date().toISOString(),
              action: "EDI_278_DISPATCHED",
              performedBy: "Automated Clearinghouse Dispatcher",
              details: `Electronic 278 Health Care Services Review transaction dispatched to payer. Assigned PCN: ${c.submissionPayload?.payerControlNumber || "PCN-COZAD-9912"}.`
            }
          ]
        };

        if (selectedCase?.id === caseId) {
          setSelectedCase(updatedCase);
        }

        return updatedCase;
      }
      return c;
    }));
  };

  // Handle new synthetic intake created
  const handleCaseCreated = (newCase: PriorAuthCase) => {
    setCases(prev => [newCase, ...prev]);
    setActiveTab("board");
  };

  // Reset to initial 3 cases
  const handleResetCases = () => {
    setCases(INITIAL_SYNTHETIC_CASES);
    setSelectedCase(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)]">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onResetCases={handleResetCases}
        caseCount={caseCount}
      />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "board" && (
          <KanbanBoard
            cases={cases}
            onSelectCase={(c) => setSelectedCase(c)}
            onVerifyCase={handleVerifyCase}
            onSubmitCase={handleSubmitCase}
            onOpenIntake={() => setActiveTab("intake")}
          />
        )}

        {activeTab === "intake" && (
          <IntakeForm
            onCaseCreated={handleCaseCreated}
            onSelectCase={(c) => setSelectedCase(c)}
          />
        )}

        {activeTab === "rulebook" && <RulebookViewer />}

        {activeTab === "subscriptions" && <SubscriptionBlueprint />}
      </main>

      {/* Case Detail Modal */}
      {selectedCase && (
        <CaseDetailModal
          caseItem={selectedCase}
          onClose={() => setSelectedCase(null)}
          onVerify={handleVerifyCase}
          onSubmit={handleSubmitCase}
        />
      )}

      <Footer />
    </div>
  );
}
