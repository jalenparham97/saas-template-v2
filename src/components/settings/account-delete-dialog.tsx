import { Button } from "@/components/ui/button";
import {
  type DialogProps,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUserDeleteAccountMutation } from "@/queries/user.queries";

interface Props extends DialogProps {
  onClose: () => void;
}

export function AccountDeleteDialog({ onClose, open }: Props) {
  function closeModal() {
    onClose();
  }

  const deleteAccountMutation = useUserDeleteAccountMutation();

  async function handleDelete() {
    await deleteAccountMutation.mutateAsync();
    closeModal();
  }

  return (
    <Dialog open={open} onOpenChange={closeModal}>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Delete account</DialogTitle>
        </DialogHeader>

        <p className="leading-6 text-gray-500">
          Are you sure you want to delete your account? All of your data will be
          permanently deleted. This action cannot be undone.
        </p>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={closeModal}
            className="mt-2 w-full sm:mt-0"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            className="w-full"
            onClick={handleDelete}
            loading={deleteAccountMutation.isPending}
          >
            Delete account
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
