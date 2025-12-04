"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { Clock, Play, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/components/trpc-provider";

interface SchedulerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SchedulerDialog({ open, onOpenChange }: SchedulerDialogProps) {
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [triggering, setTriggering] = useState(false);

  const { data: schedulerState, isLoading: loading } = trpc.scheduler.getState.useQuery(
    undefined,
    {
      enabled: open,
    }
  );

  const setSchedulerStateMutation = trpc.scheduler.setState.useMutation({
    onSuccess: (data) => {
      setScheduleEnabled(data.enabled);
      if (data.enabled) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
        toast.success("Scheduler enabled! Reports will be sent at 5:00 PM and 11:30 PM GMT+7");
      } else {
        toast.success("Scheduler disabled");
      }
    },
    onError: (error) => {
      toast.error("Failed to update scheduler: " + error.message);
    },
  });

  const triggerScheduleMutation = trpc.scheduler.triggerSchedule.useMutation({
    onSuccess: () => {
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.5 },
        colors: ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF"],
      });
      toast.success("Scheduler triggered successfully! Check your Slack channel.");
    },
    onError: (error) => {
      toast.error("Error triggering scheduler: " + error.message);
    },
  });

  useEffect(() => {
    if (schedulerState) {
      setScheduleEnabled(schedulerState.enabled);
    }
  }, [schedulerState]);

  const handleToggleSchedule = async () => {
    const newValue = !scheduleEnabled;
    const loadingToast = toast.loading(newValue ? "Enabling scheduler..." : "Disabling scheduler...");
    try {
      await setSchedulerStateMutation.mutateAsync({ enabled: newValue });
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  const handleTestScheduler = async () => {
    setTriggering(true);
    const loadingToast = toast.loading("Triggering scheduler...");
    try {
      await triggerScheduleMutation.mutateAsync();
    } finally {
      toast.dismiss(loadingToast);
      setTriggering(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center mx-auto mb-4">
            <Clock className="w-6 h-6" />
          </div>
          <DialogTitle className="text-center">Scheduler</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 mt-4">
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
            <div className="flex items-center gap-2">
              <Badge variant={scheduleEnabled ? "default" : "secondary"} className="text-xs">
                {loading ? (
                  <>Loading...</>
                ) : scheduleEnabled ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    On
                  </>
                ) : (
                  <>
                    <XCircle className="w-3 h-3 mr-1" />
                    Off
                  </>
                )}
              </Badge>
              <span className="text-sm">Auto-send</span>
            </div>
            <Button
              onClick={handleToggleSchedule}
              variant={scheduleEnabled ? "destructive" : "default"}
              size="sm"
              className="h-8"
              disabled={loading}
            >
              {scheduleEnabled ? "Disable" : "Enable"}
            </Button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
              <span className="text-sm">5:00 PM</span>
              <Badge variant="outline" className="text-xs">GMT+7</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
              <span className="text-sm">11:30 PM</span>
              <Badge variant="outline" className="text-xs">GMT+7</Badge>
            </div>
          </div>

          <Button
            onClick={handleTestScheduler}
            disabled={triggering}
            className="w-full"
            size="sm"
            variant="outline"
          >
            <Play className="w-3.5 h-3.5 mr-2" />
            {triggering ? "Sending..." : "Trigger Now"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
