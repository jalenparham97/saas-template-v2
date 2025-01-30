import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  type DialogProps,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { generatePasskey } from "@/lib/auth-client";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  name: z.string({ required_error: "Passkey name is a required field." }),
});

interface Props extends DialogProps {
  onClose: () => void;
}

export function PasskeyCreateDialog({ onClose, open }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<{ name: string }>({
    resolver: zodResolver(schema),
  });

  const apiUtils = api.useUtils();

  const generatePasskeyMutation = useMutation({
    mutationFn: generatePasskey,
    onSuccess: async () => {
      await apiUtils.user.getUser.invalidate();
    },
  });

  const onSubmit = async (data: { name: string }) => {
    await generatePasskeyMutation.mutateAsync(data.name);
    closeModal();
  };

  const closeModal = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-[465px]">
        <DialogHeader>
          <DialogTitle>Create a new passkey</DialogTitle>
        </DialogHeader>

        <DialogDescription>
          Login faster and more securely with passkeys.
        </DialogDescription>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Input
              label="Passkey name"
              {...register("name")}
              error={errors.name !== undefined}
              errorMessage={errors?.name?.message}
              allowAutoComplete={false}
            />
          </div>

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={closeModal} type="button">
              Close
            </Button>
            <Button loading={isSubmitting} type="submit">
              Create passkey
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
