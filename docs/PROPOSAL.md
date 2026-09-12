# Upwork Proposal & Screening Questions

**Job:** AI-First Healthcare Prior Authorization Workflow Implementation  
**Client:** Cozad Medical Ops  
**Lead:** Shakil Ahmed (BarakahSoft LLC)  
**Standard Rate:** $150/hr  
**Pilot Milestone:** $250 Fixed (48–72h)  
**Turnkey Implementation:** $5,850 Fixed (39h, 2 weeks)  
**Attached File:** `docs/ESTIMATE.pdf`

---

## 1. Upwork Cover Letter (Ready to Paste)

you are worried about ungrounded ai inventing facts or making unauthorized coverage determinations, and employees wasting hours manually running prompts and moving cards around.

live: https://cozad-priorauth.vercel.app
code: https://github.com/exelentshakil/cozad-priorauth
portfolio: https://shakilhq.com

i already built your end-to-end workflow on the link above. it ingests clinical notes, extracts parameters with zero manual staff prompts, checks them deterministically against medicare lcd l38924, uhc, and aetna criteria, and routes cases into ready, verify, and exception queues with cited quotes.

the live clearinghouse sftp connection is simulated with real edi 278 payloads.

4 years leading engineering at legiit, ai dashboards on a 2m+ user platform.

are you planning to use airtable or clickup for your employee board, and would you like to jump on a quick 10-minute walkthrough today?

---

## 2. Upwork Screening Questions & Technical Answers

### Question 1: What exact stack/tools would you use to implement the attached workflow, and why?
**Answer:**
A lean, 100% client-owned SaaS stack to avoid custom software bloat and zero freelancer lock-in:
- **Intake:** Jotform HIPAA or Typeform ($39-$99/mo) for secure, encrypted patient document uploads with signed BAA.
- **Workflow Automation:** Make.com Pro or Inngest ($16-$29/mo) for webhook routing, retries, and board sync.
- **AI Extraction:** OpenAI Enterprise API ($15-$35/mo) with executed BAA and zero data retention (`store: false`) to parse clinical notes into strict Zod JSON schemas without manual staff prompting.
- **Deterministic Rules Engine:** Vercel Edge API ($20/mo) executing deterministic code to validate extracted clinical parameters against payer LCD/NCD rules (ensuring AI never makes coverage decisions).
- **Workspace Board:** Airtable Team ($40/mo for 2 seats) for visual triage across READY, VERIFY, and EXCEPTION with 1-click verification triggers.
Total monthly software overhead: ~$110–$190/mo, billed directly to Cozad Medical Ops.

### Question 2: Can you demonstrate a working end-to-end flow using synthetic data within 48–72 hours?
**Answer:**
Yes. The working end-to-end flow is already built and deployed right now at https://cozad-priorauth.vercel.app. It features 3 pre-engineered synthetic patient scenarios:
1. **READY:** Robert Martinez (CPT 29881 Knee Meniscectomy) meeting 100% of UHC criteria, generating an electronic EDI 278 payload.
2. **VERIFY:** Eleanor Vance (CPT 72148 Lumbar MRI) with 5 weeks clinic PT + home exercises, presenting a 1-click staff confirmation action.
3. **EXCEPTION:** Marcus Brody (HCPCS J0135 Humira) with an expired TB test and no DMARD trial, generating an auto-drafted Physician Clinical Query.

### Question 3: Describe your experience with HIPAA-aware healthcare workflows, FHIR, or healthcare API integrations.
**Answer:**
Extensive experience engineering HIPAA-compliant healthcare architectures:
- Enforcing signed Business Associate Agreements (BAAs) across all AI/SaaS vendors (OpenAI, AWS Bedrock, Jotform, Airtable).
- Configuring Zero Data Retention and PHI scrubbing before inference.
- Generating standard X12 EDI 278 (Health Care Services Review) electronic transactions and FHIR ClaimRequest/Coverage JSON resources.
- Building deterministic rule validation so non-deterministic LLMs never generate medical advice or ungrounded coverage determinations.

### Question 4: What exact stack/tools would you use to connect the intake form to the LLM and the workspace board?
**Answer:**
1. Jotform HIPAA fires a secure webhook with an HMAC signature upon document submission.
2. Make.com or an Inngest serverless worker ingests the webhook, sanitizes the payload, and calls the LLM extraction endpoint.
3. The LLM extracts clinical evidence parameters against a strict Zod JSON schema with zero staff prompt-writing.
4. Extracted parameters pass through the deterministic Payer Rules Engine, which tags the case as READY, VERIFY, or EXCEPTION with cited EHR evidence quotes.
5. Make.com creates/updates the record in Airtable via the REST API, attaching pre-filled EDI 278 payloads for READY cases or physician query drafts for EXCEPTION cases.

### Question 5: How would you design this workflow to minimize manual employee steps while safely handling READY, VERIFY, and EXCEPTION cases?
**Answer:**
- **Zero-Touch Routine Flow (READY):** When 100% of payer criteria are met with documented EHR evidence, the system automatically marks the record READY, builds the EDI 278 submission package, and moves the card to the submission queue without requiring staff to touch a prompt or copy text.
- **1-Click Human-in-the-Loop (VERIFY):** When documentation is borderline (e.g., 5 weeks clinic therapy + home exercises vs. a 6-week conservative care rule), the card highlights the single ambiguous field with verbatim EHR citations. The clinical coordinator clicks "Confirm & Promote to Ready" in 1 second.
- **Automated Deficit Resolution (EXCEPTION):** When mandatory criteria are missing (e.g., expired TB test), the system automatically drafts a pre-filled Physician Clinical Query citing the exact payer policy and missing laboratory test.
