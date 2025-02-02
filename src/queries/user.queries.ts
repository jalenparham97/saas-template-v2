import { authClient, removePasskey } from "@/lib/auth-client";
import { APP_ROUTES } from "@/lib/contants";
import { api } from "@/trpc/react";
import { type QueryOptions } from "@/types/query.types";
import { useMutation } from "@tanstack/react-query";
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

  return useMutation({
    mutationFn: async () => await authClient.deleteUser(),
    onSuccess: () => {
      router.push(APP_ROUTES.SIGN_UP);
    },
    onError: (error) => {
      console.log(error);
      toast.error("Something went wrong!", {
        description: error.message,
        closeButton: true,
      });
    },
  });
  // return api.user.deleteAccount.useMutation({
  //   // onSuccess: () => {
  //   //   toast.success("Account deleted successfully");
  //   // },
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
