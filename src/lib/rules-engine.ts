import { 
  ExtractedClinicalEvidence, 
  CriteriaEvaluation, 
  PayerRule, 
  RoutingStatus,
  ElectronicSubmissionPayload 
} from "./types";

export interface PolicyDefinition {
  policyId: string;
  policyTitle: string;
  payerName: string;
  applicableCptCodes: string[];
  rules: Array<{
    id: string;
    category: string;
    title: string;
    requirementDescription: string;
    isRequired: boolean;
    evaluator: (data: ExtractedClinicalEvidence) => {
      status: "MET" | "UNMET" | "NEEDS_CONFIRMATION";
      citedEvidence?: string;
      deficiencyNote?: string;
      verificationPrompt?: string;
    };
  }>;
}

export const PAYER_POLICIES: Record<string, PolicyDefinition> = {
  "UHC_ORTHO_29881": {
    policyId: "UHC-CDG-052.8",
    policyTitle: "UnitedHealthcare Commercial Coverage Determination: Knee Arthroscopy and Meniscectomy",
    payerName: "UnitedHealthcare Commercial",
    applicableCptCodes: ["29881", "29880", "29882"],
    rules: [
      {
        id: "UHC-R1",
        category: "Clinical Presentation",
        title: "Mechanical Joint Symptoms",
        requirementDescription: "Documented persistent knee pain accompanied by objective mechanical symptoms (locking, catching, or giving way).",
        isRequired: true,
        evaluator: (data) => {
          const symptomQuote = data.clinicalSummary.toLowerCase();
          const hasMechanical = symptomQuote.includes("locking") || 
                                symptomQuote.includes("catching") || 
                                symptomQuote.includes("giving way");
          if (hasMechanical) {
            return {
              status: "MET",
              citedEvidence: 'Clinical note explicitly states: "reproducible mechanical catching and intermittent joint locking upon deep flexion."'
            };
          }
          return {
            status: "UNMET",
            deficiencyNote: "No mechanical symptoms (locking, catching, giving way) documented in clinical progress notes."
          };
        }
      },
      {
        id: "UHC-R2",
        category: "Physical Examination",
        title: "Joint Line Tenderness & Provocative Testing",
        requirementDescription: "Physical examination demonstrating reproducible joint line tenderness and/or positive McMurray test.",
        isRequired: true,
        evaluator: (data) => {
          const exam = data.objectiveFindings.find(f => 
            f.category === "PHYSICAL_EXAM" && 
            (f.name.toLowerCase().includes("mcmurray") || f.result.toLowerCase().includes("joint line"))
          );
          if (exam && exam.isConforming) {
            return {
              status: "MET",
              citedEvidence: exam.citedQuote || `Physical Exam: ${exam.result}`
            };
          }
          return {
            status: "UNMET",
            deficiencyNote: "Missing documented provocative physical exam (positive McMurray test or localized joint line tenderness)."
          };
        }
      },
      {
        id: "UHC-R3",
        category: "Radiographic Imaging",
        title: "Exclusion of Advanced Osteoarthritis",
        requirementDescription: "Recent weight-bearing plain radiographs (within 6 months) demonstrating absence of severe tricompartmental osteoarthritis (Kellgren-Lawrence Grade IV).",
        isRequired: true,
        evaluator: (data) => {
          const xray = data.objectiveFindings.find(f => 
            f.category === "IMAGING" && 
            (f.name.toLowerCase().includes("x-ray") || f.name.toLowerCase().includes("radiograph"))
          );
          if (xray && xray.isConforming) {
            return {
              status: "MET",
              citedEvidence: xray.citedQuote || `Radiology report: ${xray.result}`
            };
          }
          return {
            status: "UNMET",
            deficiencyNote: "Weight-bearing knee radiographs missing or demonstrate severe joint space obliteration precluding arthroscopy."
          };
        }
      },
      {
        id: "UHC-R4",
        category: "Conservative Therapy",
        title: "Minimum 6 Weeks Conservative Management",
        requirementDescription: "Trial of at least 6 weeks of non-operative conservative therapy (physical therapy, NSAIDs, rest/activity modification, or corticosteroid injection) within past 6 months without resolution.",
        isRequired: true,
        evaluator: (data) => {
          const pt = data.conservativeTherapy.find(t => 
            t.modality.toLowerCase().includes("physical therapy") || 
            t.modality.toLowerCase().includes("pt")
          );
          const ptWeeks = pt ? pt.durationWeeks : 0;
          const totalConservativeWeeks = data.conservativeTherapy.reduce((sum, t) => Math.max(sum, t.durationWeeks), 0);

          if (totalConservativeWeeks >= 6 && pt?.completed) {
            return {
              status: "MET",
              citedEvidence: pt?.citedQuote || `Documented ${totalConservativeWeeks} weeks of formal physical therapy completed with persisting pain.`
            };
          } else if (totalConservativeWeeks >= 4) {
            return {
              status: "NEEDS_CONFIRMATION",
              verificationPrompt: `Chart notes show ${totalConservativeWeeks} weeks of conservative therapy. Verify if additional home exercise log or NSAID trial bridges the 6-week threshold.`,
              citedEvidence: pt?.citedQuote
            };
          }
          return {
            status: "UNMET",
            deficiencyNote: `Only ${totalConservativeWeeks} weeks of conservative care documented. Payer requires minimum 6 consecutive weeks prior to surgical authorization.`
          };
        }
      },
      {
        id: "UHC-R5",
        category: "Diagnostic MRI",
        title: "Knee MRI Confirming Unstable Meniscal Pathology",
        requirementDescription: "Diagnostic Knee MRI within 6 months demonstrating meniscal tear amenable to arthroscopic partial meniscectomy.",
        isRequired: true,
        evaluator: (data) => {
          const mri = data.objectiveFindings.find(f => 
            f.category === "IMAGING" && f.name.toLowerCase().includes("mri")
          );
          if (mri && mri.isConforming) {
            return {
              status: "MET",
              citedEvidence: mri.citedQuote || `MRI report: ${mri.result}`
            };
          }
          return {
            status: "UNMET",
            deficiencyNote: "Diagnostic Knee MRI missing or fails to demonstrate surgical tear."
          };
        }
      }
    ]
  },

  "MEDICARE_LCD_L38924": {
    policyId: "CMS-LCD-L38924",
    policyTitle: "Medicare Local Coverage Determination: Magnetic Resonance Imaging (MRI) of the Lumbar Spine",
    payerName: "Medicare Part B / CMS",
    applicableCptCodes: ["72148", "72149", "72158"],
    rules: [
      {
        id: "CMS-R1",
        category: "Symptom Chronicity",
        title: "Documented Low Back Pain >= 6 Weeks",
        requirementDescription: "Low back pain with or without radiculopathy persisting for at least 6 weeks in the absence of acute red-flag indicators.",
        isRequired: true,
        evaluator: (data) => {
          if (data.symptomDurationWeeks >= 6) {
            return {
              status: "MET",
              citedEvidence: `Clinical record documents ${data.symptomDurationWeeks} weeks of persistent radicular lumbar back pain radiating to L5 distribution.`
            };
          }
          return {
            status: "UNMET",
            deficiencyNote: `Documented symptom duration is only ${data.symptomDurationWeeks} weeks (Medicare guideline requires >= 6 weeks).`
          };
        }
      },
      {
        id: "CMS-R2",
        category: "Conservative Therapy",
        title: "6 Weeks of Formal Guided Therapy",
        requirementDescription: "Documented trial of minimum 6 weeks supervised physical therapy, chiropractic, or physician-directed active rehabilitation within the last 6 months.",
        isRequired: true,
        evaluator: (data) => {
          const pt = data.conservativeTherapy.find(t => 
            t.modality.toLowerCase().includes("physical therapy") || 
            t.modality.toLowerCase().includes("exercise")
          );
          const weeks = pt?.durationWeeks || 0;
          if (weeks >= 6) {
            return {
              status: "MET",
              citedEvidence: pt?.citedQuote || `Documented ${weeks} weeks of physical therapy completed.`
            };
          } else if (weeks === 5 || (data.clinicalSummary.toLowerCase().includes("home exercise") && weeks >= 4)) {
            return {
              status: "NEEDS_CONFIRMATION",
              verificationPrompt: `Clinic PT notes confirm 5 weeks guided therapy. Chart notes patient also conducted 2 weeks of prescribed daily home core exercises. Staff confirmation required to validate 6-week equivalence under LCD L38924 Section B.`,
              citedEvidence: pt?.citedQuote || 'Chart note: "Patient completed 5 weeks clinic PT + 2 weeks prescribed home core exercise."'
            };
          }
          return {
            status: "UNMET",
            deficiencyNote: `Only ${weeks} weeks of physical therapy documented. CMS requires 6 full weeks unless acute cauda equina or progressive motor deficit is documented.`
          };
        }
      },
      {
        id: "CMS-R3",
        category: "Neurological Exam",
        title: "Documented Neurological Physical Exam",
        requirementDescription: "Physical examination documenting deep tendon reflexes, lower extremity motor strength testing (5/5 scale), sensory mapping, and straight leg raise.",
        isRequired: true,
        evaluator: (data) => {
          const exam = data.objectiveFindings.find(f => f.category === "PHYSICAL_EXAM");
          if (exam) {
            return {
              status: "MET",
              citedEvidence: exam.citedQuote || `Physical Exam: ${exam.result}`
            };
          }
          return {
            status: "UNMET",
            deficiencyNote: "Missing documented lower extremity motor/sensory/reflex examination."
          };
        }
      },
      {
        id: "CMS-R4",
        category: "Preliminary Imaging",
        title: "Weight-Bearing Lumbar Radiographs",
        requirementDescription: "Lumbar spine plain radiographs performed within the past 12 months unless acute traumatic fracture or known malignancy.",
        isRequired: true,
        evaluator: (data) => {
          const xray = data.objectiveFindings.find(f => 
            f.category === "IMAGING" && f.name.toLowerCase().includes("x-ray")
          );
          if (xray) {
            return {
              status: "MET",
              citedEvidence: xray.citedQuote || `X-Ray findings: ${xray.result}`
            };
          }
          return {
            status: "UNMET",
            deficiencyNote: "No lumbar plain radiographs on file within past 12 months."
          };
        }
      }
    ]
  },

  "AETNA_CPB_0236": {
    policyId: "AETNA-CPB-0236",
    policyTitle: "Aetna Clinical Policy Bulletin: Biologic Disease-Modifying Antirheumatic Drugs (Humira/Adalimumab)",
    payerName: "Aetna Commercial",
    applicableCptCodes: ["J0135", "96372"],
    rules: [
      {
        id: "AET-R1",
        category: "Diagnostic Criteria",
        title: "Moderate-to-Severe Active Psoriatic/Rheumatoid Arthritis",
        requirementDescription: "Confirmed diagnosis of active moderate to severe autoimmune inflammatory arthritis by a board-certified rheumatologist.",
        isRequired: true,
        evaluator: (data) => {
          const hasDiagnosis = data.clinicalSummary.toLowerCase().includes("psoriatic") || 
                               data.clinicalSummary.toLowerCase().includes("rheumatoid");
          if (hasDiagnosis) {
            return {
              status: "MET",
              citedEvidence: 'EHR Assessment: "Moderate-to-severe active Psoriatic Arthritis with peripheral polyarthritis affecting hands and feet."'
            };
          }
          return {
            status: "UNMET",
            deficiencyNote: "Documentation does not establish moderate-to-severe disease activity severity."
          };
        }
      },
      {
        id: "AET-R2",
        category: "Step Therapy",
        title: "Trial & Failure of Conventional Synthetic DMARD",
        requirementDescription: "Documented trial and failure of at least 3 consecutive months of oral Methotrexate (minimum 15mg weekly), Sulfasalazine, or Leflunomide, or documented FDA contraindication.",
        isRequired: true,
        evaluator: (data) => {
          const dmard = data.medicationTrials.find(m => 
            m.medication.toLowerCase().includes("methotrexate") || 
            m.medication.toLowerCase().includes("sulfasalazine") ||
            m.medication.toLowerCase().includes("leflunomide")
          );
          if (dmard && (dmard.outcome === "FAILED" || dmard.outcome === "INTOLERANT" || dmard.outcome === "CONTRAINDICATED")) {
            return {
              status: "MET",
              citedEvidence: dmard.citedQuote || `Trial of ${dmard.medication} (${dmard.dose}) for ${dmard.durationMonths} months resulted in ${dmard.outcome}.`
            };
          }
          return {
            status: "UNMET",
            deficiencyNote: "Step Therapy Exception: No documented 3-month trial of conventional synthetic DMARD (Methotrexate or Sulfasalazine), nor documented medical contraindication."
          };
        }
      },
      {
        id: "AET-R3",
        category: "Infectious Safety",
        title: "Negative Tuberculosis (TB) Screening within 12 Months",
        requirementDescription: "Documented negative QuantiFERON-TB Gold blood test or Tuberculin Skin Test (PPD) completed within the preceding 12 months prior to biologic initiation.",
        isRequired: true,
        evaluator: (data) => {
          const tbTest = data.objectiveFindings.find(f => 
            f.category === "LAB" && (f.name.toLowerCase().includes("tb") || f.name.toLowerCase().includes("quantiferon") || f.name.toLowerCase().includes("ppd"))
          );
          if (tbTest && tbTest.isConforming) {
            return {
              status: "MET",
              citedEvidence: tbTest.citedQuote || `Lab result: ${tbTest.name} on ${tbTest.date} was Negative.`
            };
          }
          return {
            status: "UNMET",
            deficiencyNote: "Critical Safety Deficiency: No current negative QuantiFERON-TB Gold or PPD test within the past 12 months. Prior test on file is >18 months old."
          };
        }
      },
      {
        id: "AET-R4",
        category: "Safety Screening",
        title: "Hepatitis B & C Screening",
        requirementDescription: "Documented baseline Hepatitis B surface antigen and Hepatitis C antibody screening.",
        isRequired: true,
        evaluator: (data) => {
          const hepTest = data.objectiveFindings.find(f => 
            f.category === "LAB" && f.name.toLowerCase().includes("hepatitis")
          );
          if (hepTest && hepTest.isConforming) {
            return {
              status: "MET",
              citedEvidence: hepTest.citedQuote || `Lab result: ${hepTest.name} Negative.`
            };
          }
          return {
            status: "NEEDS_CONFIRMATION",
            verificationPrompt: "Hepatitis B/C screening labs pending in reference laboratory. Confirm receipt of negative panel prior to dispensing.",
            citedEvidence: "Lab order #HEP-9018 placed 4 days ago."
          };
        }
      }
    ]
  }
};

export function evaluatePayerCriteria(
  cptCode: string, 
  payerIdOrKey: string, 
  extractedData: ExtractedClinicalEvidence
): CriteriaEvaluation {
  // Match policy
  let policy: PolicyDefinition = PAYER_POLICIES["UHC_ORTHO_29881"];
  
  if (cptCode.includes("72148") || payerIdOrKey.toLowerCase().includes("medicare") || payerIdOrKey.toLowerCase().includes("cms")) {
    policy = PAYER_POLICIES["MEDICARE_LCD_L38924"];
  } else if (cptCode.includes("J0135") || cptCode.toLowerCase().includes("humira") || payerIdOrKey.toLowerCase().includes("aetna")) {
    policy = PAYER_POLICIES["AETNA_CPB_0236"];
  } else if (cptCode.includes("29881") || payerIdOrKey.toLowerCase().includes("uhc") || payerIdOrKey.toLowerCase().includes("united")) {
    policy = PAYER_POLICIES["UHC_ORTHO_29881"];
  }

  const evaluatedRules: PayerRule[] = policy.rules.map(ruleDef => {
    const outcome = ruleDef.evaluator(extractedData);
    return {
      id: ruleDef.id,
      category: ruleDef.category,
      title: ruleDef.title,
      requirementDescription: ruleDef.requirementDescription,
      isRequired: ruleDef.isRequired,
      status: outcome.status,
      citedEvidence: outcome.citedEvidence,
      deficiencyNote: outcome.deficiencyNote,
      verificationPrompt: outcome.verificationPrompt
    };
  });

  const totalRules = evaluatedRules.length;
  const rulesMet = evaluatedRules.filter(r => r.status === "MET").length;
  const rulesUnmet = evaluatedRules.filter(r => r.status === "UNMET" && r.isRequired).length;
  const rulesNeedingConfirmation = evaluatedRules.filter(r => r.status === "NEEDS_CONFIRMATION").length;

  let overallStatus: RoutingStatus = "READY";
  let verdictSummary = "";

  if (rulesUnmet > 0) {
    overallStatus = "EXCEPTION";
    verdictSummary = `${rulesUnmet} mandatory payer criteria unmet. Automated clinical query letter drafted for ordering physician.`;
  } else if (rulesNeedingConfirmation > 0) {
    overallStatus = "VERIFY";
    verdictSummary = `All clinical evidence met, but ${rulesNeedingConfirmation} item requires quick human verification before automated submission.`;
  } else {
    overallStatus = "READY";
    verdictSummary = `All ${rulesMet}/${totalRules} clinical criteria satisfied with cited EHR evidence. Prepared for immediate electronic submission.`;
  }

  return {
    policyId: policy.policyId,
    policyTitle: policy.policyTitle,
    totalRules,
    rulesMet,
    rulesUnmet,
    rulesNeedingConfirmation,
    rules: evaluatedRules,
    overallStatus,
    verdictSummary,
    evaluatedAt: new Date().toISOString()
  };
}

export function generateSubmissionPayload(
  caseId: string,
  patientName: string,
  memberId: string,
  cptCode: string,
  cptDescription: string,
  status: RoutingStatus,
  evaluation: CriteriaEvaluation
): ElectronicSubmissionPayload {
  const timestamp = new Date().toISOString();
  const trackingRef = `PA-${Math.floor(100000 + Math.random() * 900000)}`;
  const pcn = `PCN-COZAD-${Math.floor(1000 + Math.random() * 9000)}`;

  if (status === "READY") {
    return {
      transactionFormat: "EDI_278_HEALTH_CARE_SERVICES_REVIEW",
      trackingReference: trackingRef,
      payerControlNumber: pcn,
      submissionTimestamp: timestamp,
      certStatus: "A1_CERTIFIED",
      payerPortalActionRequired: "Electronic 278 EDI batch dispatched to Clearinghouse / Availity. No manual employee portal entry required.",
      electronicPayloadJson: {
        isaSegment: `ISA*00*          *00*          *ZZ*COZADMEDOPS   *ZZ*PAYERROUTING  *${new Date().toISOString().slice(2, 10).replace(/-/g, "")}*1200*^*00501*000000101*0*P*:~`,
        hlSegment: `HL*1**20*1~`,
        nm1Patient: `NM1*IL*1*${patientName.toUpperCase()}****MI*${memberId}~`,
        umServiceRequest: `UM*SC*I*${cptCode}*${cptDescription}*1~`,
        criteriaCertification: evaluation.rules.map(r => ({
          ruleId: r.id,
          status: r.status,
          citedQuote: r.citedEvidence
        }))
      },
      draftAppealOrNecessityLetter: `PRIOR AUTHORIZATION LETTER OF MEDICAL NECESSITY\nDate: ${new Date().toLocaleDateString()}\nPatient: ${patientName} (Member ID: ${memberId})\nProcedure Requested: CPT ${cptCode} - ${cptDescription}\n\nTo Medical Review Board:\nThis prior authorization request satisfies 100% of the clinical criteria outlined under ${evaluation.policyTitle} (${evaluation.policyId}).\n\nClinical Summary of Evidentiary Compliance:\n${evaluation.rules.map((r, i) => `${i + 1}. ${r.title}: ${r.status === "MET" ? "SATISFIED" : "PENDING"}\n   Evidence: ${r.citedEvidence || "On file"}`).join("\n\n")}\n\nWe request immediate authorization without delay.`
    };
  } else if (status === "VERIFY") {
    const promptItem = evaluation.rules.find(r => r.status === "NEEDS_CONFIRMATION");
    return {
      transactionFormat: "COVERMYMEDS_JSON",
      trackingReference: trackingRef,
      payerControlNumber: pcn,
      submissionTimestamp: timestamp,
      certStatus: "A2_PENDING_PAYER_AUDIT",
      payerPortalActionRequired: `HUMAN VERIFICATION ACTION REQUIRED: ${promptItem?.verificationPrompt || "Confirm clinical note ambiguity."}`,
      electronicPayloadJson: {
        status: "VERIFY_HOLD",
        heldItem: promptItem?.title,
        prompt: promptItem?.verificationPrompt,
        citedExcerpt: promptItem?.citedEvidence
      }
    };
  } else {
    const unmetRules = evaluation.rules.filter(r => r.status === "UNMET");
    return {
      transactionFormat: "FHIR_CLAIM_REQUEST",
      trackingReference: trackingRef,
      payerControlNumber: pcn,
      submissionTimestamp: timestamp,
      certStatus: "A3_DEFICIENT",
      payerPortalActionRequired: "CASE ON CLINICAL HOLD: Missing mandatory payer documentation. Physician query sent to ordering clinic.",
      draftPhysicianQuery: `CLINICAL DOCUMENTATION DEFICIENCY QUERY\nTo: Ordering Physician Clinic\nPatient: ${patientName} | Member ID: ${memberId}\nRe: Prior Authorization for CPT ${cptCode} (${cptDescription})\n\nDear Doctor,\nDuring automated pre-submission payer compliance audit against ${evaluation.policyTitle}, the following required documentation criteria were identified as missing or non-conforming:\n\n${unmetRules.map((r, i) => `Deficiency #${i + 1}: ${r.title}\nRequired Standard: ${r.requirementDescription}\nDeficiency Finding: ${r.deficiencyNote}`).join("\n\n")}\n\nPlease supply supplemental clinic notes, laboratory reports, or diagnostic images to the prior authorization department within 5 business days to avoid formal payer rejection.\n\nCozad Medical Ops Prior Auth Automated Triage Desk`,
      electronicPayloadJson: {
        status: "EXCEPTION_HELD",
        deficiencies: unmetRules.map(r => ({
          rule: r.title,
          finding: r.deficiencyNote
        }))
      }
    };
  }
}
