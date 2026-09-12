import { NextRequest, NextResponse } from "next/server";
import { extractClinicalParameters } from "@/lib/extractor";
import { evaluatePayerCriteria, generateSubmissionPayload } from "@/lib/rules-engine";
import { PriorAuthCase } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      patient,
      provider,
      payer,
      request,
      rawClinicalNotes
    } = body;

    if (!rawClinicalNotes || !request?.cptCode) {
      return NextResponse.json(
        { error: "Missing required fields: rawClinicalNotes and request.cptCode are mandatory." },
        { status: 400 }
      );
    }

    const cptCode = request.cptCode;
    const payerId = payer?.id || payer?.name || "uhc";

    // 1. Automated Extraction
    const extracted = await extractClinicalParameters(rawClinicalNotes, cptCode);

    // 2. Deterministic Payer Rule Evaluation
    const evaluation = evaluatePayerCriteria(cptCode, payerId, extracted);

    // 3. Electronic Submission Payload Generation
    const submission = generateSubmissionPayload(
      `PA-${Math.floor(1000 + Math.random() * 9000)}`,
      patient?.name || "Synthetic Patient",
      patient?.memberId || "MBR-000000",
      cptCode,
      request?.cptDescription || "Requested Procedure",
      evaluation.overallStatus,
      evaluation
    );

    const fullCase: PriorAuthCase = {
      id: `PA-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      patient: patient || {
        id: `PT-${Math.floor(1000 + Math.random() * 9000)}`,
        name: "Synthetic Patient",
        dob: "1980-01-01",
        gender: "Other",
        memberId: "MBR-999999",
        groupNumber: "GRP-0001"
      },
      provider: provider || {
        name: "Dr. Referring Provider, MD",
        npi: "1999999999",
        facility: "Regional Medical Center",
        specialty: "Specialist",
        phone: "(555) 000-0000",
        fax: "(555) 000-0001"
      },
      payer: payer || {
        id: "PAYER-AUTO",
        name: "Selected Health Plan",
        payerIdCode: "99999",
        planType: "Commercial PPO",
        policyGuidelineId: evaluation.policyId,
        policyTitle: evaluation.policyTitle
      },
      request: request,
      rawClinicalNotes,
      extractedEvidence: extracted,
      criteriaEvaluation: evaluation,
      status: evaluation.overallStatus,
      stage: evaluation.overallStatus,
      submissionPayload: submission,
      auditTrail: [
        {
          id: `AUD-${Date.now()}-1`,
          timestamp: new Date().toISOString(),
          action: "API_INGESTION",
          performedBy: "Automated Intake API",
          details: "Clinical note ingested and validated."
        },
        {
          id: `AUD-${Date.now()}-2`,
          timestamp: new Date().toISOString(),
          action: "AI_EXTRACTION",
          performedBy: "Clinical Extraction Engine",
          details: `Extracted ${extracted.objectiveFindings.length} findings, ${extracted.conservativeTherapy.length} conservative trials.`
        },
        {
          id: `AUD-${Date.now()}-3`,
          timestamp: new Date().toISOString(),
          action: "CRITERIA_VERIFIED",
          performedBy: `Deterministic Rules (${evaluation.policyId})`,
          details: `Evaluation completed: ${evaluation.rulesMet}/${evaluation.totalRules} rules met. Assigned status: ${evaluation.overallStatus}.`
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      case: fullCase
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to process prior auth case." },
      { status: 500 }
    );
  }
}
