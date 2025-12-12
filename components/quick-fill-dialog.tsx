"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface QuickFillDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onQuickFill: (status: string, action: string) => void;
}

export function QuickFillDialog({
  open,
  onOpenChange,
  onQuickFill,
}: QuickFillDialogProps) {
  const [status, setStatus] = useState("Pending");
  const [action, setAction] = useState("Will check tomorrow");

  const handleConfirm = () => {
    onQuickFill(status, action);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Quick Fill All Tickets</DialogTitle>
          <DialogDescription>
            Fill all tickets with the same status and action.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div>
            <label
              htmlFor="quick-fill-status"
              className="text-sm font-semibold mb-2 block text-muted-foreground uppercase tracking-wide"
            >
              Status
            </label>
            <Input
              id="quick-fill-status"
              type="text"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              placeholder="Enter status..."
              className="h-11 sm:h-10 text-base sm:text-sm"
              aria-describedby="quick-fill-description"
            />
          </div>
          <div>
            <label
              htmlFor="quick-fill-action"
              className="text-sm font-semibold mb-2 block text-muted-foreground uppercase tracking-wide"
            >
              Action
            </label>
            <Input
              id="quick-fill-action"
              type="text"
              value={action}
              onChange={(e) => setAction(e.target.value)}
              placeholder="Enter action..."
              className="h-11 sm:h-10 text-base sm:text-sm"
              aria-describedby="quick-fill-description"
            />
          </div>
        </div>
        <DialogFooter className="flex-col sm:flex-row gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-11 sm:h-10 w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            className="h-11 sm:h-10 w-full sm:w-auto"
          >
            Apply to all
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
