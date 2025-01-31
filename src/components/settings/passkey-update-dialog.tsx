import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  type DialogProps,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react";
import { type Passkey } from "@/types/auth.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  name: z.string({ required_error: "Passkey name is a required field." }),
});

interface Props extends DialogProps {
  passkey: Passkey;
  onClose: () => void;
}

export function PasskeyUpdateDialog({ onClose, open, passkey }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<{ name: string }>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: passkey.name ?? "",
    },
  });

  const apiUtils = api.useUtils();

  const updatePasskeyMutation = api.user.updatePasskeyName.useMutation({
    onSuccess: async () => {
      await apiUtils.user.getUser.invalidate();
    },
  });

  const onSubmit = async (data: { name: string }) => {
    await updatePasskeyMutation.mutateAsync({
      id: passkey.id,
      name: data.name,
    });
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
          <DialogTitle>Update passkey</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Input
              label="Passkey name"
              {...register("name")}
              defaultValue={passkey.name ?? ""}
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
              Update passkey
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
