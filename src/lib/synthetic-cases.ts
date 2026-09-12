import { PriorAuthCase } from "./types";
import { evaluatePayerCriteria, generateSubmissionPayload } from "./rules-engine";

export const INITIAL_SYNTHETIC_CASES: PriorAuthCase[] = [
  // ==========================================
  // CASE 1: READY (Robert Martinez - Knee Arthroscopy)
  // ==========================================
  (() => {
    const rawNotes = `PATIENT CLINICAL PROGRESS NOTE - ORTHOPEDIC CLINIC
Patient: Robert Martinez | DOB: 04/12/1981 (Age 45, Male) | Member ID: UHC-98241088
Date of Service: September 10, 2026
Chief Complaint: Severe right medial knee pain with recurrent mechanical catching and locking for the past 12 weeks.

History of Present Illness:
Patient is a 45-year-old active male who experienced an acute twisting injury while playing recreational tennis approximately 3 months ago. He reports persistent sharp medial joint line pain exacerbated by squatting, pivoting, and descending stairs. Crucially, patient endorses reproducible mechanical catching and intermittent joint locking upon deep flexion that disrupts daily activities.

Conservative Therapy & Prior Management:
1. Physical Therapy: Completed 8 consecutive weeks of formal outpatient physical therapy at Apex Physical Therapy (2x/week from July 1 to August 28, 2026). PT notes document diligent compliance with quadriceps strengthening and hamstring flexibility, but no resolution of mechanical symptoms.
2. Pharmacotherapy: Trial of oral Meloxicam 15mg daily for 6 weeks with minimal pain relief; discontinued due to mild dyspepsia. Switched to topical Voltaren gel with temporary partial relief only.
3. Activity modification: Patient has ceased all high-impact activities.

Objective Physical Examination:
- Gait: Antalgic right-sided gait with slight avoidance of terminal stance.
- Right Knee: Mild joint effusion (1+). Significant localized tenderness over the medial joint line.
- Provocative Tests: McMurray's test is unequivocally positive for a palpable and audible click with medial joint pain upon external rotation and extension. Lachman and anterior drawer tests negative. Pivot shift negative. Collateral ligaments stable.

Radiology & Diagnostic Imaging:
1. Bilateral Standing Weight-Bearing Knee Radiographs (07/15/2026): AP and lateral weight-bearing views show preservation of the joint space. Minimal subchondral sclerosis. Absence of advanced osteoarthritis (Kellgren-Lawrence Grade 1 only, no tricompartmental narrowing).
2. Right Knee High-Resolution 3.0T MRI (08/20/2026): Complex tear of the posterior horn of the medial meniscus extending to the inferior articular surface. Subluxed meniscus fragment. Intact ACL, PCL, and collateral ligaments. Articular cartilage preserved.

Assessment & Plan:
Primary Diagnosis: M23.22 - Derangement of meniscus due to old tear or injury, right medial meniscus.
Secondary: M25.561 - Pain in right knee.
Recommended Procedure: CPT 29881 - Arthroscopy, knee, surgical; with meniscectomy (medial).
Plan: Request prior authorization from UnitedHealthcare Commercial. Documentation satisfies all clinical indications.`;

    const extracted = {
      symptomDurationWeeks: 12,
      clinicalSummary: "Patient endorses reproducible mechanical catching and intermittent joint locking upon deep flexion for 12 weeks. 8 weeks outpatient PT failed.",
      conservativeTherapy: [
        {
          modality: "Physical Therapy",
          durationWeeks: 8,
          completed: true,
          notes: "8 weeks outpatient physical therapy at Apex PT completed with persistent mechanical symptoms.",
          citedQuote: 'Completed 8 consecutive weeks of formal outpatient physical therapy at Apex Physical Therapy (2x/week from July 1 to August 28, 2026).'
        },
        {
          modality: "Oral NSAIDs",
          durationWeeks: 6,
          completed: true,
          notes: "Meloxicam 15mg daily for 6 weeks with minimal relief.",
          citedQuote: 'Trial of oral Meloxicam 15mg daily for 6 weeks with minimal pain relief.'
        }
      ],
      objectiveFindings: [
        {
          category: "PHYSICAL_EXAM" as const,
          name: "McMurray's Test & Joint Line Palpation",
          date: "2026-09-10",
          result: "Unequivocally positive for palpable click and sharp medial joint line tenderness",
          isConforming: true,
          citedQuote: "McMurray's test is unequivocally positive for a palpable and audible click with medial joint pain upon external rotation."
        },
        {
          category: "IMAGING" as const,
          name: "Weight-Bearing Knee Radiographs",
          date: "2026-07-15",
          result: "Absence of advanced osteoarthritis (Kellgren-Lawrence Grade 1 only)",
          isConforming: true,
          citedQuote: "AP and lateral weight-bearing views show preservation of the joint space... Kellgren-Lawrence Grade 1 only, no tricompartmental narrowing."
        },
        {
          category: "IMAGING" as const,
          name: "High-Resolution 3.0T Knee MRI",
          date: "2026-08-20",
          result: "Complex tear of posterior horn of medial meniscus extending to inferior articular surface",
          isConforming: true,
          citedQuote: "Complex tear of the posterior horn of the medial meniscus extending to the inferior articular surface. Subluxed meniscus fragment."
        }
      ],
      medicationTrials: [],
      contraindications: [],
      extractionConfidence: 0.99,
      extractedAt: "2026-09-12T14:32:00Z"
    };

    const criteria = evaluatePayerCriteria("29881", "uhc", extracted);
    const submission = generateSubmissionPayload(
      "PA-2026-0101",
      "Robert Martinez",
      "UHC-98241088",
      "29881",
      "Knee Arthroscopy w/ Medial Meniscectomy",
      "READY",
      criteria
    );

    return {
      id: "PA-2026-0101",
      patient: {
        id: "PT-8812",
        name: "Robert Martinez",
        dob: "1981-04-12",
        gender: "M",
        memberId: "UHC-98241088",
        groupNumber: "GRP-44120"
      },
      provider: {
        name: "Dr. David Vance, MD",
        npi: "1841295821",
        facility: "Metro Orthopedic & Sports Institute",
        specialty: "Orthopedic Surgery",
        phone: "(555) 234-8901",
        fax: "(555) 234-8902"
      },
      payer: {
        id: "PAYER-UHC",
        name: "UnitedHealthcare Commercial",
        payerIdCode: "87726",
        planType: "Choice Plus PPO",
        policyGuidelineId: "UHC-CDG-052.8",
        policyTitle: "Knee Arthroscopy & Meniscectomy Coverage Determination"
      },
      request: {
        serviceCategory: "Outpatient Surgical Procedure",
        cptCode: "29881",
        cptDescription: "Arthroscopy, knee, surgical; with meniscectomy (medial or lateral)",
        icd10Codes: [
          { code: "M23.22", description: "Derangement of meniscus due to old tear, right medial" },
          { code: "M25.561", description: "Pain in right knee" }
        ],
        urgency: "ROUTINE",
        requestedUnits: 1,
        placeOfService: "Ambulatory Surgical Center (POS 24)"
      },
      rawClinicalNotes: rawNotes,
      extractedEvidence: extracted,
      criteriaEvaluation: criteria,
      status: "READY",
      stage: "READY",
      submissionPayload: submission,
      auditTrail: [
        {
          id: "AUD-01",
          timestamp: "2026-09-12T14:30:10Z",
          action: "INTAKE_INGESTION",
          performedBy: "System (Webhook / Intake API)",
          details: "Secure clinical intake received with attached progress notes and radiology PDF."
        },
        {
          id: "AUD-02",
          timestamp: "2026-09-12T14:30:25Z",
          action: "AUTOMATED_EXTRACTION",
          performedBy: "AI Clinical Extractor Engine",
          details: "Clinical parameters extracted into typed schema with verbatim evidence offsets. Zero prompt engineering required."
        },
        {
          id: "AUD-03",
          timestamp: "2026-09-12T14:30:30Z",
          action: "PAYER_CRITERIA_CHECK",
          performedBy: "Deterministic Rule Engine (UHC-CDG-052.8)",
          details: "Evaluated 5/5 criteria: all 5 MET with cited quotes. Automated status set to READY."
        }
      ],
      createdAt: "2026-09-12T14:30:00Z",
      updatedAt: "2026-09-12T14:31:00Z"
    };
  })(),

  // ==========================================
  // CASE 2: VERIFY (Eleanor Vance - Lumbar MRI)
  // ==========================================
  (() => {
    const rawNotes = `CLINICAL CONSULTATION NOTE - NEUROLOGY & SPINE
Patient: Eleanor Vance | DOB: 11/23/1957 (Age 68, Female) | Member ID: MED-88491023
Date of Evaluation: September 11, 2026
Ordering Physician: Dr. Sarah Jenkins, MD | Specialty: Physical Medicine & Rehabilitation
Chief Complaint: Chronic lower back pain radiating down left posterolateral thigh to the great toe for 7 weeks.

History of Present Illness:
Mrs. Vance is a 68-year-old Medicare beneficiary presenting with 7 weeks of persistent axial lumbar pain accompanied by left L5 dermatomal paresthesias. Symptoms began insidiously while gardening. Denies bowel or bladder incontinence, saddle anesthesia, fevers, or unexpected weight loss (no acute cauda equina syndrome).

Rehabilitation & Conservative Treatment:
1. Physical Therapy: Patient was referred for formal physical therapy at St. Jude Rehab. Clinic records show attendance and completion of 5 weeks of structured, supervised physical therapy (2 sessions per week, August 3 to September 8, 2026). PT discharge summary notes active trunk stabilization and hip mobilization.
2. Prescribed Home Exercises: Attending notes state: "Patient completed 5 weeks clinic PT + 2 weeks prescribed home core exercise regimen daily with therapist guidance prior to clinic discharge."
3. Medication: Ibuprofen 600mg TID taken for 4 weeks with modest analgesia; Cyclobenzaprine 5mg at bedtime.

Physical & Neurological Exam:
- Gait: Slightly antalgic left leg stance, able to heel-and-toe walk with mild left extensor hallucis longus weakness (4+/5).
- Reflexes: Patellar 2+ bilaterally, Achilles 1+ on left, 2+ on right.
- Provocative: Left straight leg raise produces radiating pain at 45 degrees. Cross SLR negative.
- Radiographs: Lumbar Spine 4-view X-Rays (08/05/2026): Multilevel degenerative disc disease L4-L5 and L5-S1, preserved vertebral body heights, no spondylolisthesis.

Impression & Request:
Diagnosis: M54.5 - Low back pain; M54.16 - Radiculopathy, lumbar region (left L5).
Plan: Request Lumbar Spine MRI without contrast (CPT 72148) to assess for L4-L5 disc herniation vs foraminal stenosis prior to epidural steroid injection.`;

    const extracted = {
      symptomDurationWeeks: 7,
      clinicalSummary: "68 y/o female with 7 weeks of lumbar radicular pain. 5 weeks clinic PT documented + 2 weeks prescribed daily home core exercise.",
      conservativeTherapy: [
        {
          modality: "Physical Therapy & Home Rehab",
          durationWeeks: 5,
          completed: true,
          notes: "5 weeks supervised PT at St. Jude Rehab. 2 additional weeks prescribed daily home exercise recorded.",
          citedQuote: 'Patient completed 5 weeks clinic PT + 2 weeks prescribed home core exercise regimen daily with therapist guidance prior to clinic discharge.'
        }
      ],
      objectiveFindings: [
        {
          category: "PHYSICAL_EXAM" as const,
          name: "Neurological & Straight Leg Raise Exam",
          date: "2026-09-11",
          result: "Left SLR positive at 45 degrees; mild left EHL weakness (4+/5)",
          isConforming: true,
          citedQuote: "Left straight leg raise produces radiating pain at 45 degrees... mild left extensor hallucis longus weakness (4+/5)."
        },
        {
          category: "IMAGING" as const,
          name: "Lumbar Spine 4-View Radiographs",
          date: "2026-08-05",
          result: "Multilevel degenerative disc disease L4-S1, no fracture or spondylolisthesis",
          isConforming: true,
          citedQuote: "Lumbar Spine 4-view X-Rays (08/05/2026): Multilevel degenerative disc disease L4-L5 and L5-S1, preserved vertebral body heights."
        }
      ],
      medicationTrials: [
        {
          medication: "Ibuprofen",
          dose: "600mg TID",
          durationMonths: 1,
          outcome: "FAILED" as const,
          citedQuote: "Ibuprofen 600mg TID taken for 4 weeks with modest analgesia."
        }
      ],
      contraindications: [],
      extractionConfidence: 0.96,
      extractedAt: "2026-09-12T15:10:00Z"
    };

    const criteria = evaluatePayerCriteria("72148", "medicare", extracted);
    const submission = generateSubmissionPayload(
      "PA-2026-0202",
      "Eleanor Vance",
      "MED-88491023",
      "72148",
      "MRI Lumbar Spine Without Contrast",
      "VERIFY",
      criteria
    );

    return {
      id: "PA-2026-0202",
      patient: {
        id: "PT-9043",
        name: "Eleanor Vance",
        dob: "1957-11-23",
        gender: "F",
        memberId: "MED-88491023",
        groupNumber: "CMS-PAR-B"
      },
      provider: {
        name: "Dr. Sarah Jenkins, MD",
        npi: "1492019482",
        facility: "University Spine & Neuroscience Center",
        specialty: "Physical Medicine & Rehabilitation",
        phone: "(555) 349-1120",
        fax: "(555) 349-1121"
      },
      payer: {
        id: "PAYER-CMS",
        name: "Medicare Part B / CMS",
        payerIdCode: "00400",
        planType: "Traditional Medicare Fee-For-Service",
        policyGuidelineId: "CMS-LCD-L38924",
        policyTitle: "Magnetic Resonance Imaging (MRI) of the Lumbar Spine"
      },
      request: {
        serviceCategory: "Advanced Diagnostic Imaging",
        cptCode: "72148",
        cptDescription: "Magnetic resonance (eg, proton) imaging, spinal canal and contents, lumbar spine; without contrast material",
        icd10Codes: [
          { code: "M54.5", description: "Low back pain, unspecified" },
          { code: "M54.16", description: "Radiculopathy, lumbar region" }
        ],
        urgency: "ROUTINE",
        requestedUnits: 1,
        placeOfService: "Independent Diagnostic Testing Facility (POS 81)"
      },
      rawClinicalNotes: rawNotes,
      extractedEvidence: extracted,
      criteriaEvaluation: criteria,
      status: "VERIFY",
      stage: "VERIFY",
      submissionPayload: submission,
      auditTrail: [
        {
          id: "AUD-21",
          timestamp: "2026-09-12T15:08:12Z",
          action: "INTAKE_INGESTION",
          performedBy: "System (Webhook / Intake API)",
          details: "Intake received for Medicare Lumbar MRI request."
        },
        {
          id: "AUD-22",
          timestamp: "2026-09-12T15:08:24Z",
          action: "AUTOMATED_EXTRACTION",
          performedBy: "AI Clinical Extractor Engine",
          details: "Clinical parameters extracted: 7 weeks duration, 5 weeks formal PT + 2 weeks home exercise."
        },
        {
          id: "AUD-23",
          timestamp: "2026-09-12T15:08:31Z",
          action: "PAYER_CRITERIA_CHECK",
          performedBy: "Deterministic Rule Engine (CMS-LCD-L38924)",
          details: "Rule CMS-R2 flagged for human confirmation: 5 weeks clinic PT documented; staff must confirm whether documented home exercise bridges 6-week threshold. Case routed to VERIFY queue."
        }
      ],
      createdAt: "2026-09-12T15:08:00Z",
      updatedAt: "2026-09-12T15:09:00Z"
    };
  })(),

  // ==========================================
  // CASE 3: EXCEPTION (Marcus Brody - Biologic Humira)
  // ==========================================
  (() => {
    const rawNotes = `CLINICAL RHEUMATOLOGY PROGRESS NOTE
Patient: Marcus Brody | DOB: 09/04/1988 (Age 38, Male) | Member ID: AET-44910283
Date of Visit: September 9, 2026
Attending: Dr. Samantha Reed, MD | Division of Rheumatology
Chief Complaint: Worsening peripheral joint pain and dactylitis in bilateral hands and feet.

History of Illness:
38-year-old male with established active Psoriatic Arthritis with peripheral polyarthritis and moderate cutaneous plaque psoriasis involving elbows and scalp. Patient presents with severe morning stiffness lasting >90 minutes and tender swollen PIP/DIP joints.

Medication History & Treatments:
1. Topical Therapies: Clobetasol propionate 0.05% topical cream used intermittently for skin plaques with modest cutaneous response, no articular benefit.
2. NSAIDs: Naproxen 500mg BID taken for 8 weeks with inadequate joint pain control.
3. Conventional Synthetic DMARDs: Patient has NEVER been prescribed or trialed oral Methotrexate, Sulfasalazine, or Leflunomide. Note mentions: "Patient expressed preference to skip oral pills and begin biologic injection directly." No documented medical contraindications to methotrexate (normal renal and hepatic function).

Laboratory & Screening History:
- QuantiFERON-TB Gold: Last test performed on March 14, 2025 (Negative). Note: this test is over 17 months old and exceeds the mandatory 12-month pre-biologic threshold. No repeat TB test ordered or documented.
- Hepatitis B Surface Antigen / Hep C Antibody: Lab orders sent today, results pending at Quest Diagnostics.
- CBC & CMP: Within normal limits. AST 22, ALT 24, eGFR >90.

Plan & Prior Authorization Request:
Prescription: Adalimumab (Humira) 40mg/0.8mL subcutaneous auto-injector every other week.
Diagnosis: L40.52 - Psoriatic arthritis with polyneuropathy; M07.8 - Other psoriatic arthropathies.
Payer: Aetna Commercial (Policy CPB 0236).`;

    const extracted = {
      symptomDurationWeeks: 26,
      clinicalSummary: "38 y/o male with active psoriatic arthritis. Never trialed oral methotrexate or conventional DMARD. TB test on file is 17 months old (expired).",
      conservativeTherapy: [],
      objectiveFindings: [
        {
          category: "LAB" as const,
          name: "QuantiFERON-TB Gold Test",
          date: "2025-03-14",
          result: "Negative (Test performed 17 months ago - EXPIRED)",
          isConforming: false,
          citedQuote: "QuantiFERON-TB Gold: Last test performed on March 14, 2025 (Negative). Note: this test is over 17 months old."
        }
      ],
      medicationTrials: [
        {
          medication: "Naproxen",
          dose: "500mg BID",
          durationMonths: 2,
          outcome: "FAILED" as const,
          citedQuote: "Naproxen 500mg BID taken for 8 weeks with inadequate joint pain control."
        }
      ],
      contraindications: [],
      extractionConfidence: 0.98,
      extractedAt: "2026-09-12T16:00:00Z"
    };

    const criteria = evaluatePayerCriteria("J0135", "aetna", extracted);
    const submission = generateSubmissionPayload(
      "PA-2026-0303",
      "Marcus Brody",
      "AET-44910283",
      "J0135",
      "Adalimumab (Humira) 40mg Subcutaneous",
      "EXCEPTION",
      criteria
    );

    return {
      id: "PA-2026-0303",
      patient: {
        id: "PT-7719",
        name: "Marcus Brody",
        dob: "1988-09-04",
        gender: "M",
        memberId: "AET-44910283",
        groupNumber: "AET-CORP-90"
      },
      provider: {
        name: "Dr. Samantha Reed, MD",
        npi: "1982014920",
        facility: "Valley Rheumatology & Immunology Associates",
        specialty: "Rheumatology",
        phone: "(555) 482-9011",
        fax: "(555) 482-9012"
      },
      payer: {
        id: "PAYER-AETNA",
        name: "Aetna Commercial",
        payerIdCode: "60054",
        planType: "Open Access Managed Care",
        policyGuidelineId: "AETNA-CPB-0236",
        policyTitle: "Biologic Disease-Modifying Antirheumatic Drugs (Humira/Adalimumab)"
      },
      request: {
        serviceCategory: "Specialty Pharmacy Biologic",
        cptCode: "J0135",
        cptDescription: "Injection, adalimumab, 20 mg (Humira 40mg subcutaneous auto-injector)",
        icd10Codes: [
          { code: "L40.52", description: "Psoriatic arthritis mutilans" },
          { code: "M07.8", description: "Other psoriatic arthropathies" }
        ],
        urgency: "ROUTINE",
        requestedUnits: 2,
        placeOfService: "Home Delivery Specialty Pharmacy (POS 12)"
      },
      rawClinicalNotes: rawNotes,
      extractedEvidence: extracted,
      criteriaEvaluation: criteria,
      status: "EXCEPTION",
      stage: "EXCEPTION",
      submissionPayload: submission,
      auditTrail: [
        {
          id: "AUD-31",
          timestamp: "2026-09-12T15:58:05Z",
          action: "INTAKE_INGESTION",
          performedBy: "System (Webhook / Intake API)",
          details: "Specialty pharmacy biologic prior authorization request ingested."
        },
        {
          id: "AUD-32",
          timestamp: "2026-09-12T15:58:18Z",
          action: "AUTOMATED_EXTRACTION",
          performedBy: "AI Clinical Extractor Engine",
          details: "Extraction identified no trial of conventional DMARD and TB test older than 12 months."
        },
        {
          id: "AUD-33",
          timestamp: "2026-09-12T15:58:25Z",
          action: "PAYER_CRITERIA_CHECK",
          performedBy: "Deterministic Rule Engine (AETNA-CPB-0236)",
          details: "Critical Payer Deficiencies identified: (1) Step therapy requires trial/failure of Methotrexate; (2) QuantiFERON-TB Gold test is >17 months old (exceeds 12-month requirement). Automated status set to EXCEPTION. Draft Physician Query Letter generated."
        }
      ],
      createdAt: "2026-09-12T15:58:00Z",
      updatedAt: "2026-09-12T15:59:00Z"
    };
  })()
];

export const SAAS_STACK_ITEMS = [
  {
    category: "Intake",
    productName: "Jotform HIPAA or Typeform",
    provider: "Jotform / Typeform Inc",
    estimatedMonthlyCost: "$39 - $99/mo",
    pricingModel: "Per workspace tier",
    hipaaCapable: true,
    baaAvailable: true,
    whyNeeded: "Provides turnkey, encrypted patient & clinic intake forms with file upload (radiology reports, progress notes) and executed BAA on day 1.",
    avoidsFreelancerLockin: true
  },
  {
    category: "Workflow Automation",
    productName: "Make.com (Pro) or Inngest",
    provider: "Make / Inngest Inc",
    estimatedMonthlyCost: "$16 - $29/mo",
    pricingModel: "Usage-based operations",
    hipaaCapable: true,
    baaAvailable: true,
    whyNeeded: "Coordinates webhook ingestion, schedules retries, manages async execution, and updates board statuses without writing server infrastructure.",
    avoidsFreelancerLockin: true
  },
  {
    category: "AI Engine",
    productName: "OpenAI Enterprise / AWS Bedrock (Claude)",
    provider: "OpenAI / Anthropic via AWS",
    estimatedMonthlyCost: "$15 - $35/mo",
    pricingModel: "Token-based (approx. $0.01 per prior auth extraction)",
    hipaaCapable: true,
    baaAvailable: true,
    whyNeeded: "Zero Data Retention API with executed BAA extracts structured clinical variables directly into strict JSON schemas.",
    avoidsFreelancerLockin: true
  },
  {
    category: "Workspace / Triage",
    productName: "Airtable Team or ClickUp HIPAA",
    provider: "Airtable / ClickUp",
    estimatedMonthlyCost: "$20 - $45/user/mo",
    pricingModel: "Per active employee seat",
    hipaaCapable: true,
    baaAvailable: true,
    whyNeeded: "Provides staff with the live visual board (READY / VERIFY / EXCEPTION columns), one-click action buttons, and automated notification triggers.",
    avoidsFreelancerLockin: true
  },
  {
    category: "Hosting & API",
    productName: "Vercel Pro (Micro-service & Edge)",
    provider: "Vercel Inc",
    estimatedMonthlyCost: "$20/mo",
    pricingModel: "Flat team seat",
    hipaaCapable: true,
    baaAvailable: true,
    whyNeeded: "Hosts deterministic payer rules engine, EDI 278 generator, and webhook verification endpoints with 99.99% uptime.",
    avoidsFreelancerLockin: true
  }
];
