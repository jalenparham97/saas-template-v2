import {
  authClient,
  removePasskey,
  sendChangeEmailVerificationEmail,
  sendEmailVerificationEmail,
  sendPasswordResetEmail,
} from "@/lib/auth-client";
import { APP_ROUTES } from "@/lib/contants";
import { api } from "@/trpc/react";
import { type QueryOptions } from "@/types/query.types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useUser() {
  return api.user.getUser.useQuery();
}

export function useUserCurrentSession() {
  return api.user.getActiveSession.useQuery();
}

export const useUserUpdateMutation = (options?: QueryOptions) => {
  const apiUtils = api.useUtils();

  return api.user.updateUser.useMutation({
    onMutate: async () => {
      await apiUtils.user.getUser.cancel();
      const previousQueryData = apiUtils.user.getUser.getData();
      return { previousQueryData };
    },
    onSuccess: () => {
      if (options?.showToast) {
        toast.success("Account updated", {
          description: "Your account has been successfully updated!",
          closeButton: true,
        });
      }
    },
    onError: (error, _, ctx) => {
      console.log(error);
      apiUtils.user.getUser.setData(void {}, ctx?.previousQueryData);
      toast.error("Something went wrong!", {
        description: "An error occured while trying to update your profile.",
        closeButton: true,
      });
    },
    onSettled: async () => {
      await apiUtils.user.getUser.invalidate();
    },
  });
};

export function useUserDeleteAccountMutation() {
  const router = useRouter();

  return api.user.deleteAccount.useMutation({
    onSuccess: async () => {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push(APP_ROUTES.LOGIN);
          },
        },
      });
    },
    onError: (error) => {
      console.log(error);
      toast.error("Something went wrong!", {
        description: error.message,
        closeButton: true,
      });
    },
  });

  // return useMutation({
  //   mutationFn: async () => await authClient.deleteUser(),
  //   onSuccess: () => {
  //     router.push(APP_ROUTES.SIGN_UP);
  //   },
  //   onError: (error) => {
  //     console.log(error);
  //     toast.error("Something went wrong!", {
  //       description: error.message,
  //       closeButton: true,
  //     });
  //   },
  // });
}

export function useRevokeAllUserSessionsMutation() {
  const apiUtils = api.useUtils();
  const router = useRouter();

  return api.user.revokeAllSessions.useMutation({
    onSuccess: () => {
      router.push(APP_ROUTES.LOGIN);
    },
    onError: (error) => {
      console.log(error);
      toast.error(error.message);
      toast.error("Something went wrong!", {
        description: error.message,
        closeButton: true,
      });
    },
    onSettled: async () => {
      await apiUtils.user.getUser.invalidate();
    },
  });
}

export function useRevokeUserSessionMutation() {
  const apiUtils = api.useUtils();

  return api.user.revokeSession.useMutation({
    onSuccess: () => {
      toast.success("Session revoked successfully");
    },
    onError: (error) => {
      console.log(error);
      toast.error(error.message);
      toast.error("Something went wrong!", {
        description: error.message,
        closeButton: true,
      });
    },
    onSettled: async () => {
      await apiUtils.user.getUser.invalidate();
    },
  });
}

export function useDeleteUserPasskeyMutation() {
  const apiUtils = api.useUtils();

  return useMutation({
    mutationFn: removePasskey,
    onSuccess: () => {
      toast.success("Passkey deleted successfully");
    },
    onError: (error) => {
      console.log(error);
      toast.error(error.message);
      toast.error("Something went wrong!", {
        description: error.message,
        closeButton: true,
      });
    },
    onSettled: async () => {
      await apiUtils.user.getUser.invalidate();
    },
  });
}

export function useUserPasswordResetMutation({
  onSuccess: customOnSuccess,
  onError: customOnError,
}: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
} = {}) {
  return useMutation({
    mutationFn: async (params: { email: string }) => {
      return await sendPasswordResetEmail(params.email);
    },
    onSuccess: () => {
      const defaultOnSuccess = () => {
        toast.success("Password reset email sent", {
          description: "Please check your inbox for the email.",
          closeButton: true,
          duration: 10000,
        });
      };
      if (customOnSuccess) {
        return customOnSuccess();
      }
      return defaultOnSuccess();
    },
    onError: (error) => {
      const defaultOnError = () => {
        console.log(error);
        toast.error(error.message);
        toast.error("Something went wrong!", {
          description: error.message,
          closeButton: true,
        });
      };
      if (customOnError) {
        return customOnError(error);
      }
      return defaultOnError();
    },
  });
}

export function useChangeEmailMutation({
  onSuccess: customOnSuccess,
  onError: customOnError,
}: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
} = {}) {
  return useMutation({
    mutationFn: async (params: { newEmail: string }) => {
      return await sendChangeEmailVerificationEmail(params.newEmail);
    },
    onSuccess: (response) => {
      if (response.error) {
        toast.error("Something went wrong!", {
          description: response.error.message,
          closeButton: true,
        });
        return;
      }

      const defaultOnSuccess = () => {
        toast.success("Email sent", {
          description: "Please check your inbox for the email.",
          closeButton: true,
          duration: 10000,
        });
      };
      if (customOnSuccess) {
        return customOnSuccess();
      }
      return defaultOnSuccess();
    },
    onError: (error) => {
      const defaultOnError = () => {
        console.log(error);
        toast.error("Something went wrong!", {
          description: error.message,
          closeButton: true,
        });
      };
      if (customOnError) {
        return customOnError(error);
      }
      return defaultOnError();
    },
  });
}

export function useSubscriptions() {
  return useQuery({
    queryKey: ["subscriptions"],
    queryFn: async () => {
      const { data: subscriptions } = await authClient.subscription.list();
      // get the active subscription
      const activeSubscription = subscriptions?.find(
        (sub) => sub.status === "active" || sub.status === "trialing",
      );
      return activeSubscription ?? null;
    },
  });
}

export function useUserEmailVerificationMutation() {
  return useMutation({
    mutationFn: async (params: { email: string }) => {
      return await sendEmailVerificationEmail(params.email);
    },
    onSuccess: () => {
      toast.success("Verification email sent", {
        description: "Please check your inbox for the verification email.",
        closeButton: true,
      });
    },
    onError: (error) => {
      console.log(error);
      toast.error("Something went wrong!", {
        description: error.message,
        closeButton: true,
      });
    },
  });
}
