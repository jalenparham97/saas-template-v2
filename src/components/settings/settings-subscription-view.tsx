"use client";

import { SettingsSection } from "@/components/settings/settings-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader } from "@/components/ui/loader";
import { authClient } from "@/lib/auth-client";
import { APP_ROUTES } from "@/lib/contants";
import { useSubscriptions } from "@/queries/user.queries";
import { api } from "@/trpc/react";
import { capitalizeFirstLetter } from "@/utils/capitalize-first-letter";
import { formatDate } from "@/utils/format-date";
import { type Subscription } from "@better-auth/stripe";
import { IconExternalLink } from "@tabler/icons-react";
import { isEmpty } from "radash";

export function SettingsSubscriptionView() {
  const subscription = useSubscriptions();

  const portalMutation = api.payments.getBillingPortalSession.useMutation();

  const openBillingPortal = async () => {
    const returnUrl = `${window.location.origin}/settings/subscription`;
    const { url } = await portalMutation.mutateAsync({
      stripeCustomerId: subscription?.data?.stripeCustomerId ?? "",
      returnUrl,
    });
    window?.location.assign(url);
  };

  async function upgradeSubscription() {
    const { error } = await authClient.subscription.upgrade({
      plan: "pro",
      successUrl: `${APP_ROUTES.SETTINGS}/subscription`,
      cancelUrl: `${APP_ROUTES.SETTINGS}/subscription`,
    });
    if (error) {
      alert(error.message);
    }
  }

  if (subscription.isLoading) {
    return (
      <div className="flex items-center justify-center py-[300px]">
        <Loader />
      </div>
    );
  }

  return (
    <div>
      <SettingsSection>
        <div>
          <h2 className="text-base font-semibold leading-7">Subscription</h2>
          <p className="mt-1 text-sm leading-6 text-gray-500">
            View and edit your billing details, as well as cancel your
            subscription.
          </p>
        </div>

        {subscription?.data && (
          <Card className="divide-y divide-gray-200 md:col-span-2">
            <div className="flex items-center justify-between bg-sidebar px-6 py-4">
              <p className="text-base font-medium leading-6">
                Your subscription
              </p>
            </div>
            <div className="flex items-center gap-2 p-6">
              <p className="max-w-2xl leading-6 text-gray-500">
                Current plan - {capitalizeFirstLetter(subscription.data.plan)}
              </p>
              <RenewBadge subscription={subscription.data} />
            </div>
            <div className="flex items-center gap-x-2 border-t border-gray-200 p-6">
              <Button
                leftIcon={<IconExternalLink size={16} />}
                onClick={openBillingPortal}
                disabled={isEmpty(subscription.data)}
              >
                Manage subscription
              </Button>
              <Button variant="outline">View plans</Button>
            </div>
          </Card>
        )}

        {!subscription?.data && (
          <Card className="divide-y divide-gray-200 md:col-span-2">
            <div className="flex items-center justify-between bg-sidebar px-6 py-4">
              <p className="text-base font-medium leading-6">
                Your subscription
              </p>
            </div>
            <div className="flex items-center gap-2 p-6">
              <p className="max-w-2xl leading-6 text-gray-500">
                You are currently on the Free plan. Upgrade to the Pro plan to
                access all features.
              </p>
            </div>
            <div className="flex items-center gap-x-2 border-t border-gray-200 p-6">
              <Button
                leftIcon={<IconExternalLink size={16} />}
                onClick={upgradeSubscription}
              >
                Upgrade to Pro
              </Button>
              <Button variant="outline">View plans</Button>
            </div>
          </Card>
        )}
      </SettingsSection>
    </div>
  );
}

function RenewBadge({
  subscription,
}: {
  subscription: Subscription | null | undefined;
}) {
  const periodEnd = formatDate(subscription?.periodEnd, "MMM Do, YYYY");

  if (!subscription) return null;

  if (subscription.status === "active" && !subscription.cancelAtPeriodEnd) {
    return <Badge variant="green">Renews on {periodEnd}</Badge>;
  }

  if (subscription.status === "trialing") {
    return <Badge variant="blue">Trial ends on {periodEnd}</Badge>;
  }

  if (subscription.status === "active" && subscription.cancelAtPeriodEnd) {
    return <Badge variant="red">Ends on {periodEnd}</Badge>;
  }

  return null;
}
