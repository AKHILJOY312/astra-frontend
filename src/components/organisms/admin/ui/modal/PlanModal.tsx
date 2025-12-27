import {
  Dialog as RadixDialog,
  DialogContent as RadixDialogContent,
  DialogTitle as RadixDialogTitle,
  DialogDescription,
} from "@radix-ui/react-dialog";
import { X } from "lucide-react";

export const Dialog = RadixDialog;

type DialogContentProps = React.ComponentProps<typeof RadixDialogContent> & {
  onOpenChange?: (open: boolean) => void;
};

export const DialogContent = ({
  children,
  className = "",
  onOpenChange,
  ...props
}: DialogContentProps) => (
  <RadixDialogContent
    className={`fixed left-1/2 top-1/2 max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-2xl dark:bg-gray-900 ${className}`}
    {...props}
  >
    <button
      className="absolute right-4 top-4 rounded-full p-1 opacity-70 transition hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-800"
      onClick={() => onOpenChange?.(false)}
    >
      <X className="h-5 w-5" />
    </button>

    {children}
  </RadixDialogContent>
);

export const DialogHeader = ({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`text-left ${className}`} {...props} />
);

export const DialogTitle = ({
  className = "",
  ...props
}: React.ComponentProps<typeof RadixDialogTitle>) => (
  <RadixDialogTitle
    className={`text-2xl font-semibold text-gray-900 dark:text-white ${className}`}
    {...props}
  />
);

export { DialogDescription };
