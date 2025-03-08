const FREE_PLAN = "Free";
const STARTER_PLAN = "Starter";
const PROFESSIONAL_PLAN = "Professional";
const BUSINESS_PLAN = "Business";

export type Plan = "Free" | "Starter" | "Professional" | "Business";

export type Feature =
  | "1 workspace"
  | "1 form endpoints"
  | "5 form endpoints"
  | "Unlimited workspaces"
  | "Unlimited form endpoints"
  | "Unlimited team members"
  | "Unlimited form submissions"
  | "Unlimited submission archive"
  | "30 days submission archive"
  | "90 days submission archive"
  | "365 days submission archive"
  | "AJAX support"
  | "Spam Protection"
  | "Data export"
  | "Email notifications"
  | "Custom Thank You Page"
  | "Auto responses"
  | "Domain restrictions"
  | "Webhooks"
  | "Integrations"
  | "Custom honeypot"
  | "Basic support"
  | "Priority support";

/**
 * This is a mapping from stripe product ids to the features they unlock.
 * The keys are in the order of increasingly powerful products.
 * ex: Hobby ($10) -> Business ($20) -> Enterprise ($30)
 * ex: All the features unlocked by Business are also automatically unlocked by Enterprise.
 */
const FEATURE_UNLOCKS_BY_PLAN: Record<string, Feature[]> = {
  [FREE_PLAN]: [
    "1 workspace",
    "1 form endpoints",
    "Unlimited team members",
    "Unlimited form submissions",
    "30 days submission archive",
    "AJAX support",
    "Spam Protection",
    "Data export",
    "Email notifications",
    "Basic support",
  ],
  [STARTER_PLAN]: [
    "1 workspace",
    "5 form endpoints",
    "Unlimited team members",
    "Unlimited form submissions",
    "90 days submission archive",
    "AJAX support",
    "Spam Protection",
    "Data export",
    "Email notifications",
    "Custom Thank You Page",
    "Auto responses",
    "Domain restrictions",
    "Integrations",
    "Basic support",
  ],
  [PROFESSIONAL_PLAN]: [
    "Unlimited workspaces",
    "Unlimited form endpoints",
    "Unlimited team members",
    "Unlimited form submissions",
    "365 days submission archive",
    "AJAX support",
    "Spam Protection",
    "Data export",
    "Email notifications",
    "Custom Thank You Page",
    "Auto responses",
    "Domain restrictions",
    "Integrations",
    "Webhooks",
    "Custom honeypot",
    "Basic support",
  ],
  [BUSINESS_PLAN]: [
    "Unlimited workspaces",
    "Unlimited form endpoints",
    "Unlimited team members",
    "Unlimited form submissions",
    "Unlimited submission archive",
    "AJAX support",
    "Spam Protection",
    "Data export",
    "Email notifications",
    "Custom Thank You Page",
    "Auto responses",
    "Domain restrictions",
    "Integrations",
    "Webhooks",
    "Custom honeypot",
    "Priority support",
  ],
};

const SORTED_PLANS = Object.keys(FEATURE_UNLOCKS_BY_PLAN);

export const ALL_FEATURES = Object.values(FEATURE_UNLOCKS_BY_PLAN).flat();

/**
 * Determines if a user has access to a specific feature based on their subscription plan.
 *
 * @param plan - The user's current subscription plan. Can be null, undefined, or a string matching a valid plan.
 * @param feature - The feature to check access for.
 *
 * @returns {boolean} True if the user's plan includes access to the specified feature, false otherwise.
 *
 * @example
 * ```typescript
 * hasFeatureAccess('pro', "1 workspace") // returns true
 * hasFeatureAccess('free', "1 workspace") // returns false
 * ```
 *
 * @remarks
 * The function checks the plan against a sorted list of plans (SORTED_PLANS) and aggregates features
 * from all plans up to and including the user's plan level. If the plan is invalid or null,
 * access is denied.
 */
export function hasFeatureAccess(
  plan: string | null | undefined,
  feature: Feature,
): boolean {
  if (plan === null) {
    return false;
  }

  const planINdex = SORTED_PLANS.indexOf(plan as Plan);
  if (planINdex === -1) {
    console.error(`Plan ${plan} is not in the list of plans`);
    return false;
  }

  const relevantFeatures = Object.values(FEATURE_UNLOCKS_BY_PLAN)
    .slice(0, planINdex + 1)
    .flatMap((x) => x);

  return relevantFeatures.includes(feature);
}
