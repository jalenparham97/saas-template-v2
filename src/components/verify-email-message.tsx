import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  useUser,
  useUserEmailVerificationMutation,
} from "@/queries/user.queries";

export function VerifyEmailMessage() {
  const user = useUser();

  const verifyEmailMutation = useUserEmailVerificationMutation();

  async function sendVerificationEmail() {
    await verifyEmailMutation.mutateAsync({
      email: user.data?.email ?? "",
    });
  }

  if (user.isLoading) {
    return null;
  }

  if (user.data?.emailVerified) {
    return null;
  }

  return (
    <Alert className="relative">
      <AlertTitle className="text-base">Verify your email address</AlertTitle>
      <AlertDescription>
        <p className="text-gray-500">
          Check your inbox to verify your email address
        </p>
      </AlertDescription>
      <div className="mt-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={sendVerificationEmail}
          loading={verifyEmailMutation.isPending}
        >
          Resend verification email
        </Button>
      </div>
    </Alert>
  );
}
