"use client";

import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface SendSlackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSendSlack: () => Promise<void>;
}

export function SendSlackDialog({
  open,
  onOpenChange,
  onSendSlack,
}: SendSlackDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="w-14 h-14 sm:w-12 sm:h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center mx-auto mb-4">
            <Send className="w-7 h-7 sm:w-6 sm:h-6" />
          </div>
          <DialogTitle className="text-center text-lg">Send to Slack?</DialogTitle>
          <DialogDescription className="text-center text-sm">
            This will save your changes and post the handover report to Slack.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-row gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-11 sm:h-10 w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            variant="success"
            onClick={onSendSlack}
            className="h-11 sm:h-10 w-full sm:w-auto"
          >
            Send to Slack
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
