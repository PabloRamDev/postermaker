import { type ReactNode } from "react";
import { useMediaQuery } from "react-responsive";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useFileStore } from "@/store/file-store";

interface formWrapperProps {
  children: ReactNode;
}

export default function FormWrapper({ children }: formWrapperProps) {
  const isTabletOrMobile = useMediaQuery({ maxWidth: 1224 });
  const { open, setClose } = useFileStore();

  if (isTabletOrMobile) {
    return (
      <Dialog open={open} onOpenChange={setClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>POSTERMAKER</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          {children}
        </DialogContent>
      </Dialog>
    );
  } else {
    return (
      <aside className="flex grow flex-col items-center p-8 gap-4 dark:bg-muted border-l-2 botder-mutted w-1/2 h-auto">
        {children}
      </aside>
    );
  }
}
