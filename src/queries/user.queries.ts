import { removePasskey } from "@/lib/auth-client";
import { APP_ROUTES } from "@/lib/contants";
import { api } from "@/trpc/react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useUser() {
  return api.user.getUser.useQuery();
}

export function useUserCurrentSession() {
  return api.user.getActiveSession.useQuery();
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
