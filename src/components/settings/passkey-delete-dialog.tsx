import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  type DialogProps,
  DialogTitle,
} from "@/components/ui/dialog";

interface Props extends DialogProps {
  onDelete: () => Promise<void>;
  onClose: () => void;
  passkeyName?: string;
  loading?: boolean;
}

export function PasskeyDeleteDialog({
  onClose,
  open,
  passkeyName,
  onDelete,
  loading,
}: Props) {
  function closeModal() {
    onClose();
  }

  async function handleDelete() {
    try {
      await onDelete();
      closeModal();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Delete passkey</DialogTitle>
        </DialogHeader>

        <div className="prose">
          <p>
            Are you sure you want to delete your `
            <span className="font-medium">{passkeyName}</span>` passkey?
          </p>
          <p>
            By removing this passkey you will no longer be able to use it to
            sign-in to your account from any of the devices on which it has been
            synced.
          </p>
          <p>
            Note: You may continue to see this passkey as an option during
            sign-in until you also delete it from your browser, device or
            associated account&apos;s password management settings.
          </p>
        </div>

        <DialogFooter className="mt-3">
          <Button
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              closeModal();
            }}
            className="w-full"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            className="w-full"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            loading={loading}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
