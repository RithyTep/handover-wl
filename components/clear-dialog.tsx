"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface ClearDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClearAll: () => void;
}

export function ClearDialog({ open, onOpenChange, onClearAll }: ClearDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="w-14 h-14 sm:w-12 sm:h-12 rounded-full bg-yellow-500/20 text-yellow-500 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-7 h-7 sm:w-6 sm:h-6" />
          </div>
          <DialogTitle className="text-center text-lg">Clear all fields?</DialogTitle>
          <DialogDescription className="text-center text-sm">
            This will clear all status and action fields. This action cannot be undone.
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
            variant="destructive"
            onClick={onClearAll}
            className="h-11 sm:h-10 w-full sm:w-auto"
          >
            Clear all
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
