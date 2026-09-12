"use client";

import React, { useState } from "react";
import { PriorAuthCase } from "@/lib/types";
import {
  Sparkles,
  Send,
  FileText,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Loader2,
  Play,
  HelpCircle,
  Database,
  ShieldCheck,
  Zap,
  ArrowRight
} from "lucide-react";

interface IntakeFormProps {
  onCaseCreated: (newCase: PriorAuthCase) => void;
  onSelectCase: (c: PriorAuthCase) => void;
}

export function IntakeForm({ onCaseCreated, onSelectCase }: IntakeFormProps) {
  const [patientName, setPatientName] = useState("Synthetic Test Patient");
  const [memberId, setMemberId] = useState("UHC-99210492");
  const [payerId, setPayerId] = useState("uhc");
  const [cptCode, setCptCode] = useState("29881");
  const [cptDescription, setCptDescription] = useState("Knee Arthroscopy w/ Meniscectomy");
  const [clinicalNotes, setClinicalNotes] = useState(
    `PATIENT PROGRESS NOTE
Chief Complaint: Right knee catching and locking for 10 weeks.
History: 45 y/o male with persistent medial knee pain following tennis injury.
Conservative Care: Completed 8 weeks of outpatient physical therapy (Apex Rehab) with no resolution of mechanical symptoms. Oral Meloxicam 15mg daily trialed for 6 weeks.
Physical Exam: Positive McMurray test with audible click and medial joint line tenderness.
Imaging: AP and lateral weight-bearing X-rays show preserved joint space (Grade 1 OA only). 3.0T MRI reveals complex tear of posterior horn of medial meniscus.`
  );

  const [isProcessing, setIsProcessing] = useState(false);
  const [processStep, setProcessStep] = useState<number>(0);

  // Preset loaders for the 3 key scenarios
  const loadPreset = (preset: "ready" | "verify" | "exception") => {
    if (preset === "ready") {
      setPatientName("Robert Martinez");
      setMemberId("UHC-98241088");
      setPayerId("uhc");
      setCptCode("29881");
      setCptDescription("Arthroscopy, knee, surgical; with meniscectomy");
      setClinicalNotes(
        `ORTHOPEDIC PROGRESS NOTE
Patient: Robert Martinez | Age: 45
Chief Complaint: Right medial knee pain with reproducible catching and locking for 12 weeks.
Conservative Therapy: Completed 8 consecutive weeks of formal outpatient physical therapy (Apex PT). Meloxicam 15mg daily trialed for 6 weeks.
Physical Exam: McMurray's test unequivocally positive for click and medial joint line tenderness.
Imaging: Weight-bearing radiographs confirm absence of advanced osteoarthritis (Grade 1 only). High-resolution 3.0T MRI shows complex tear of posterior horn medial meniscus.`
      );
    } else if (preset === "verify") {
      setPatientName("Eleanor Vance");
      setMemberId("MED-88491023");
      setPayerId("medicare");
      setCptCode("72148");
      setCptDescription("MRI Lumbar Spine Without Contrast");
      setClinicalNotes(
        `NEUROLOGY & SPINE CONSULTATION NOTE
Patient: Eleanor Vance | Age: 68 | Medicare Beneficiary
Chief Complaint: Chronic lower back pain radiating down left leg for 7 weeks.
Conservative Treatment: Patient completed 5 weeks of clinic physical therapy at St. Jude Rehab + 2 weeks prescribed daily home core exercise regimen. Ibuprofen 600mg TID taken for 4 weeks.
Physical Exam: Left straight leg raise produces radiating pain at 45 degrees.
Imaging: Lumbar Spine 4-view X-rays show multilevel degenerative disc disease L4-S1, no fracture or spondylolisthesis.`
      );
    } else {
      setPatientName("Marcus Brody");
      setMemberId("AET-44910283");
      setPayerId("aetna");
      setCptCode("J0135");
      setCptDescription("Injection, adalimumab, 20 mg (Humira 40mg auto-injector)");
      setClinicalNotes(
        `RHEUMATOLOGY PROGRESS NOTE
Patient: Marcus Brody | Age: 38
Chief Complaint: Severe active Psoriatic Arthritis with peripheral polyarthritis.
Medication History: Clobetasol cream and Naproxen 500mg BID trialed with inadequate control. Patient has NEVER trialed oral methotrexate or conventional DMARD.
Laboratories: QuantiFERON-TB Gold last performed on March 14, 2025 (Negative, 17 months old — EXPIRED). Baseline Hepatitis panel pending.`
      );
    }
  };

  const handleRunPipeline = async () => {
    setIsProcessing(true);
    setProcessStep(1);

    try {
      // Step 1: Secure Ingestion
      await new Promise(r => setTimeout(r, 450));
      setProcessStep(2);

      // Step 2: Extraction
      await new Promise(r => setTimeout(r, 650));
      setProcessStep(3);

      // Step 3: API Request to rules engine
      const res = await fetch("/api/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient: {
            id: `PT-${Math.floor(1000 + Math.random() * 9000)}`,
            name: patientName,
            dob: "1980-05-15",
            gender: "M",
            memberId: memberId,
            groupNumber: "GRP-TEST"
          },
          provider: {
            name: "Dr. Referring Clinician, MD",
            npi: "1829104928",
            facility: "Regional Specialty Center",
            specialty: "Attending Specialist",
            phone: "(555) 234-5678",
            fax: "(555) 234-5679"
          },
          payer: {
            id: payerId === "uhc" ? "PAYER-UHC" : payerId === "medicare" ? "PAYER-CMS" : "PAYER-AETNA",
            name: payerId === "uhc" ? "UnitedHealthcare Commercial" : payerId === "medicare" ? "Medicare Part B" : "Aetna Commercial",
            payerIdCode: payerId === "uhc" ? "87726" : payerId === "medicare" ? "00400" : "60054",
            planType: "Managed Care PPO",
            policyGuidelineId: payerId === "uhc" ? "UHC-CDG-052.8" : payerId === "medicare" ? "CMS-LCD-L38924" : "AETNA-CPB-0236",
            policyTitle: payerId === "uhc" ? "Knee Meniscectomy Coverage" : payerId === "medicare" ? "Lumbar MRI LCD" : "Biologic DMARD Policy"
          },
          request: {
            serviceCategory: "Specialty Healthcare Service",
            cptCode: cptCode,
            cptDescription: cptDescription,
            icd10Codes: [{ code: "M25.561", description: "Symptomatic Pain" }],
            urgency: "ROUTINE",
            requestedUnits: 1,
            placeOfService: "Specialty Clinic"
          },
          rawClinicalNotes: clinicalNotes
        })
      });

      const data = await res.json();
      setProcessStep(4);
      await new Promise(r => setTimeout(r, 400));

      if (data.case) {
        onCaseCreated(data.case);
        onSelectCase(data.case);
      }
    } catch (err) {
      console.error("Intake processing failed:", err);
    } finally {
      setIsProcessing(false);
      setProcessStep(0);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] p-6 shadow-xs">
        <div className="flex items-center space-x-2">
          <span className="rounded-md bg-[var(--color-stripe-purple)]/10 p-2 text-[var(--color-stripe-purple)]">
            <Zap className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
              Automated Intake & Pipeline Simulator
            </h2>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
              Simulate end-to-end ingestion: raw clinical notes &rarr; AI parameter extraction &rarr; deterministic payer criteria evaluation &rarr; triage routing.
            </p>
          </div>
        </div>

        {/* 1-Click Synthetic Case Pre-Fill Buttons */}
        <div className="mt-6 pt-6 border-t border-[var(--color-border)]">
          <span className="text-xs font-semibold text-[var(--color-text-muted)] block mb-2.5">
            Load Pre-Engineered Synthetic Test Cases (1-Click):
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => loadPreset("ready")}
              className="flex items-center justify-between rounded-xl border border-[var(--color-ready-border)] bg-[var(--color-ready-bg)]/40 p-3 text-left hover:border-[var(--color-ready)] transition-all"
            >
              <div>
                <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200 block">
                  Scenario 1: READY
                </span>
                <span className="text-[11px] text-[var(--color-ready)]">
                  Knee Arthroscopy (CPT 29881)
                </span>
              </div>
              <CheckCircle2 className="h-4 w-4 text-[var(--color-ready)] shrink-0" />
            </button>

            <button
              onClick={() => loadPreset("verify")}
              className="flex items-center justify-between rounded-xl border border-[var(--color-verify-border)] bg-[var(--color-verify-bg)]/40 p-3 text-left hover:border-[var(--color-verify)] transition-all"
            >
              <div>
                <span className="text-xs font-bold text-amber-900 dark:text-amber-200 block">
                  Scenario 2: VERIFY
                </span>
                <span className="text-[11px] text-[var(--color-verify)]">
                  Lumbar MRI (CPT 72148)
                </span>
              </div>
              <AlertTriangle className="h-4 w-4 text-[var(--color-verify)] shrink-0" />
            </button>

            <button
              onClick={() => loadPreset("exception")}
              className="flex items-center justify-between rounded-xl border border-[var(--color-exception-border)] bg-[var(--color-exception-bg)]/40 p-3 text-left hover:border-[var(--color-exception)] transition-all"
            >
              <div>
                <span className="text-xs font-bold text-red-900 dark:text-red-200 block">
                  Scenario 3: EXCEPTION
                </span>
                <span className="text-[11px] text-[var(--color-exception)]">
                  Biologic Humira (HCPCS J0135)
                </span>
              </div>
              <AlertCircle className="h-4 w-4 text-[var(--color-exception)] shrink-0" />
            </button>
          </div>
        </div>
      </div>

      {/* Intake Data Inputs */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-[var(--color-text-primary)]">
          Case Parameters & Demographics (Synthetic Data)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-[var(--color-text-secondary)] block mb-1">
              Patient Name
            </label>
            <input
              type="text"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-xs text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-stripe-purple)]"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-[var(--color-text-secondary)] block mb-1">
              Insurance Member ID
            </label>
            <input
              type="text"
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-xs text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-stripe-purple)] font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-[var(--color-text-secondary)] block mb-1">
              Target Payer Rulebook
            </label>
            <select
              value={payerId}
              onChange={(e) => setPayerId(e.target.value)}
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-xs text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-stripe-purple)]"
            >
              <option value="uhc">UnitedHealthcare Commercial (Orthopedic / CPT 29881)</option>
              <option value="medicare">Medicare Part B / CMS LCD L38924 (Spine MRI / CPT 72148)</option>
              <option value="aetna">Aetna Commercial CPB 0236 (Biologic Humira / J0135)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-[var(--color-text-secondary)] block mb-1">
              Procedure / Service Requested (CPT Code)
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={cptCode}
                onChange={(e) => setCptCode(e.target.value)}
                className="w-24 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-xs text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-stripe-purple)] font-mono font-bold"
              />
              <input
                type="text"
                value={cptDescription}
                onChange={(e) => setCptDescription(e.target.value)}
                className="flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-xs text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-stripe-purple)]"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-[var(--color-text-secondary)] block mb-1 flex items-center justify-between">
            <span>Unstructured Clinical Notes / EHR Progress Note</span>
            <span className="text-[10px] text-[var(--color-text-muted)]">
              AI extracts parameters without prompt writing
            </span>
          </label>
          <textarea
            rows={7}
            value={clinicalNotes}
            onChange={(e) => setClinicalNotes(e.target.value)}
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-3 text-xs text-[var(--color-text-primary)] font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-[var(--color-stripe-purple)]"
          />
        </div>

        {/* Processing Stepper if running */}
        {isProcessing && (
          <div className="rounded-xl border border-[var(--color-stripe-purple)]/30 bg-[var(--color-stripe-purple)]/5 p-4 space-y-3">
            <div className="flex items-center space-x-2 text-xs font-semibold text-[var(--color-stripe-purple)]">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Executing Automated Pipeline...</span>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
              <div className={`p-2 rounded border ${processStep >= 1 ? "bg-[var(--color-ready-bg)] border-[var(--color-ready-border)] text-[var(--color-ready)] font-bold" : "border-[var(--color-border)] text-[var(--color-text-muted)]"}`}>
                1. Ingestion & Validation
              </div>
              <div className={`p-2 rounded border ${processStep >= 2 ? "bg-[var(--color-ready-bg)] border-[var(--color-ready-border)] text-[var(--color-ready)] font-bold" : "border-[var(--color-border)] text-[var(--color-text-muted)]"}`}>
                2. AI Extraction
              </div>
              <div className={`p-2 rounded border ${processStep >= 3 ? "bg-[var(--color-ready-bg)] border-[var(--color-ready-border)] text-[var(--color-ready)] font-bold" : "border-[var(--color-border)] text-[var(--color-text-muted)]"}`}>
                3. Deterministic Payer Check
              </div>
              <div className={`p-2 rounded border ${processStep >= 4 ? "bg-[var(--color-ready-bg)] border-[var(--color-ready-border)] text-[var(--color-ready)] font-bold" : "border-[var(--color-border)] text-[var(--color-text-muted)]"}`}>
                4. Triaged Routing
              </div>
            </div>
          </div>
        )}

        {/* Submit / Trigger Button */}
        <div className="pt-2">
          <button
            onClick={handleRunPipeline}
            disabled={isProcessing}
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-[var(--color-stripe-purple)] px-6 py-3 text-sm font-semibold text-white shadow-xs hover:bg-[var(--color-stripe-purple-hover)] disabled:opacity-50 transition-colors"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing Ingestion & Payer Rules...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4 fill-white" />
                Run Ingestion & Payer Compliance Check
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
