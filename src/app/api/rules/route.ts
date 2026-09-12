import { NextResponse } from "next/server";
import { PAYER_POLICIES } from "@/lib/rules-engine";

export async function GET() {
  const policies = Object.values(PAYER_POLICIES).map(p => ({
    policyId: p.policyId,
    policyTitle: p.policyTitle,
    payerName: p.payerName,
    applicableCptCodes: p.applicableCptCodes,
    rules: p.rules.map(r => ({
      id: r.id,
      category: r.category,
      title: r.title,
      requirementDescription: r.requirementDescription,
      isRequired: r.isRequired
    }))
  }));

  return NextResponse.json({
    policies,
    totalPolicies: policies.length,
    deterministicVerification: true
  });
}
