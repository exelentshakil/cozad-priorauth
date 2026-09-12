export type RoutingStatus = "READY" | "VERIFY" | "EXCEPTION";

export type SubmissionStage = 
  | "DRAFT"
  | "EVALUATING"
  | "READY"
  | "VERIFY"
  | "EXCEPTION"
  | "SUBMITTED"
  | "AUTHORIZED";

export interface PatientInfo {
  id: string;
  name: string;
  dob: string;
  gender: "M" | "F" | "Other";
  memberId: string;
  groupNumber: string;
}

export interface ProviderInfo {
  name: string;
  npi: string;
  facility: string;
  specialty: string;
  phone: string;
  fax: string;
}

export interface PayerInfo {
  id: string;
  name: string;
  payerIdCode: string;
  planType: string;
  policyGuidelineId: string;
  policyTitle: string;
}

export interface ServiceRequest {
  serviceCategory: string;
  cptCode: string;
  cptDescription: string;
  icd10Codes: Array<{ code: string; description: string }>;
  urgency: "ROUTINE" | "EXPEDITED";
  requestedUnits?: number;
  placeOfService: string;
}

export interface ConservativeTherapyItem {
  modality: string;
  durationWeeks: number;
  completed: boolean;
  notes: string;
  citedQuote: string;
}

export interface ObjectiveFindingItem {
  category: "IMAGING" | "PHYSICAL_EXAM" | "LAB" | "PATHOLOGY";
  name: string;
  date: string;
  result: string;
  isConforming: boolean;
  citedQuote: string;
}

export interface MedicationTrialItem {
  medication: string;
  dose: string;
  durationMonths: number;
  outcome: "FAILED" | "INTOLERANT" | "CONTRAINDICATED";
  citedQuote: string;
}

export interface ExtractedClinicalEvidence {
  symptomDurationWeeks: number;
  clinicalSummary: string;
  conservativeTherapy: ConservativeTherapyItem[];
  objectiveFindings: ObjectiveFindingItem[];
  medicationTrials: MedicationTrialItem[];
  contraindications: string[];
  extractionConfidence: number;
  extractedAt: string;
}

export type RuleStatus = "MET" | "UNMET" | "NEEDS_CONFIRMATION";

export interface PayerRule {
  id: string;
  category: string;
  title: string;
  requirementDescription: string;
  isRequired: boolean;
  status: RuleStatus;
  citedEvidence?: string;
  deficiencyNote?: string;
  verificationPrompt?: string;
}

export interface CriteriaEvaluation {
  policyId: string;
  policyTitle: string;
  totalRules: number;
  rulesMet: number;
  rulesUnmet: number;
  rulesNeedingConfirmation: number;
  rules: PayerRule[];
  overallStatus: RoutingStatus;
  verdictSummary: string;
  evaluatedAt: string;
}

export interface ElectronicSubmissionPayload {
  transactionFormat: "EDI_278_HEALTH_CARE_SERVICES_REVIEW" | "COVERMYMEDS_JSON" | "FHIR_CLAIM_REQUEST";
  trackingReference: string;
  payerControlNumber: string;
  submissionTimestamp: string;
  certStatus: "A1_CERTIFIED" | "A2_PENDING_PAYER_AUDIT" | "A3_DEFICIENT";
  payerPortalActionRequired?: string;
  electronicPayloadJson: Record<string, any>;
  draftPhysicianQuery?: string;
  draftAppealOrNecessityLetter?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  performedBy: string;
  details: string;
  metadata?: Record<string, any>;
}

export interface PriorAuthCase {
  id: string;
  patient: PatientInfo;
  provider: ProviderInfo;
  payer: PayerInfo;
  request: ServiceRequest;
  rawClinicalNotes: string;
  extractedEvidence: ExtractedClinicalEvidence;
  criteriaEvaluation: CriteriaEvaluation;
  status: RoutingStatus;
  stage: SubmissionStage;
  submissionPayload?: ElectronicSubmissionPayload;
  auditTrail: AuditLogEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface SaaSSubscriptionItem {
  category: "Intake" | "Workflow Automation" | "AI Engine" | "Workspace / Triage" | "Hosting & API";
  productName: string;
  provider: string;
  estimatedMonthlyCost: string;
  pricingModel: string;
  hipaaCapable: boolean;
  baaAvailable: boolean;
  whyNeeded: string;
  avoidsFreelancerLockin: boolean;
}
