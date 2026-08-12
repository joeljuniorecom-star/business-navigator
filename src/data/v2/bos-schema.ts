import type { UserProfileV2, BusinessMatchV2 } from "./profile-schema";
import type { BusinessV2 } from "./business-schema";

export interface BOSRequest {
  profile: UserProfileV2;
  businessId: string;
}

export interface BOSConstraint {
  id: string;
  label: string;
  severity: "low" | "medium" | "high";
  explanation: string;
}

export interface BOSPositioning {
  statement: string;
  differentiation: string[];
}

export interface BOSIdealCustomer {
  description: string;
  problems: string[];
  characteristics: string[];
}

export interface BOSOffer {
  coreOffer: string;
  deliverables: string[];
  priceRange?: {
    min: number;
    max: number;
    currency: string;
  };
}

export interface BOSAcquisitionChannel {
  channel: string;
  priority: number;
  rationale: string;
  firstAction: string;
}

export interface BOSTask {
  id: string;
  title: string;
  description: string;
  priority: "critical" | "high" | "medium" | "low";
  estimatedHours?: number;
}

export interface BOSPhase {
  id: string;
  name: string;
  objective: string;
  estimatedDurationDays: number;
  estimatedBudget: number;
  tasks: BOSTask[];
  validationCriteria: string[];
}

export interface BOSMilestone {
  id: string;
  name: string;
  target: string;
}

export interface BOSRisk {
  id: string;
  risk: string;
  severity: "low" | "medium" | "high";
  mitigation: string;
}

export interface BOSMetric {
  id: string;
  name: string;
  target: string;
  reason: string;
}

export interface BOSAction {
  id: string;
  title: string;
  description: string;
  priority: number;
}

export interface BOSResult {
  businessId: string;
  businessName: string;
  summary: string;
  whyThisFits: string[];
  mainConstraints: BOSConstraint[];
  positioning: BOSPositioning;
  idealCustomer: BOSIdealCustomer;
  offer: BOSOffer;
  acquisitionChannels: BOSAcquisitionChannel[];
  monetization: {
    model: string;
    strategy: string;
  };
  launchStrategy: string;
  executionPlan: BOSPhase[];
  milestones: BOSMilestone[];
  risks: BOSRisk[];
  metrics: BOSMetric[];
  nextActions: BOSAction[];
}

export interface BOSGeneratorInput {
  profile: UserProfileV2;
  business: BusinessV2;
  match: BusinessMatchV2;
}

/**
 * Provider boundary for BOS generation. V1 is deterministic; a future LLM
 * provider can implement the same contract without changing the endpoint.
 */
export interface BOSGenerator {
  generate(input: BOSGeneratorInput): BOSResult;
}
