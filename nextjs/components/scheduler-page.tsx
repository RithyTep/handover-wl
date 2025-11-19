"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { Clock, Play, CheckCircle2, XCircle, Calendar, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function SchedulerPage() {
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [triggering, setTriggering] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSchedulerState();
  }, []);

  const fetchSchedulerState = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/scheduler-state");
      setScheduleEnabled(response.data.enabled);
    } catch (error: any) {
      console.error("Error fetching scheduler state:", error);
      toast.error("Failed to load scheduler state");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSchedule = async () => {
    const newValue = !scheduleEnabled;
    const loadingToast = toast.loading(newValue ? "Enabling scheduler..." : "Disabling scheduler...");

    try {
      await axios.post("/api/scheduler-state", { enabled: newValue });
      setScheduleEnabled(newValue);

      toast.dismiss(loadingToast);

      if (newValue) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
        toast.success("Scheduler enabled! Reports will be sent at 5:16 PM and 11:46 PM GMT+7");
      } else {
        toast.success("Scheduler disabled");
      }
    } catch (error: any) {
      toast.dismiss(loadingToast);
      toast.error("Failed to update scheduler: " + error.message);
      console.error("Error updating scheduler state:", error);
    }
  };

  const handleTestScheduler = async () => {
    setTriggering(true);
    const loadingToast = toast.loading("Triggering scheduler...");

    try {
      await axios.post("/api/trigger-schedule");

      toast.dismiss(loadingToast);
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.5 },
        colors: ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF"],
      });
      toast.success("Scheduler triggered successfully! Check your Slack channel.");
    } catch (error: any) {
      toast.dismiss(loadingToast);
      toast.error("Error triggering scheduler: " + error.message);
    } finally {
      setTriggering(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Clock className="w-8 h-8 animate-spin mx-auto mb-2 text-foreground" />
          <p className="text-sm text-muted-foreground">Loading scheduler...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col gap-6 max-w-2xl">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold tracking-tight mb-2">Scheduler</h2>
        <p className="text-sm text-muted-foreground">
          Automatically send handover reports to Slack at scheduled times.
        </p>
      </div>

      {/* Status Card */}
      <div className="border border-border rounded-lg p-6 bg-card">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-foreground" />
            </div>
            <div>
              <h3 className="text-base font-semibold mb-1">Auto-send Status</h3>
              <Badge variant={scheduleEnabled ? "default" : "secondary"} className="text-xs">
                {scheduleEnabled ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Enabled
                  </>
                ) : (
                  <>
                    <XCircle className="w-3 h-3 mr-1" />
                    Disabled
                  </>
                )}
              </Badge>
            </div>
          </div>
          <Button
            onClick={handleToggleSchedule}
            variant={scheduleEnabled ? "destructive" : "default"}
            size="sm"
            disabled={loading}
          >
            {scheduleEnabled ? "Disable" : "Enable"}
          </Button>
        </div>

        {scheduleEnabled && (
          <div className="p-3 bg-muted/50 rounded-md border border-border/50">
            <div className="flex items-start gap-2">
              <Bell className="w-4 h-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium mb-1">Active</p>
                <p className="text-xs text-muted-foreground">
                  Reports will be automatically sent to Slack at the scheduled times below.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Schedule Times */}
      <div className="border border-border rounded-lg p-6 bg-card">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <h3 className="text-base font-semibold">Schedule Times</h3>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/50">
            <div>
              <p className="text-sm font-medium mb-1">Evening Report</p>
              <p className="text-xs text-muted-foreground">Daily handover summary</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold">5:16 PM</p>
              <Badge variant="outline" className="text-xs mt-1">GMT+7</Badge>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/50">
            <div>
              <p className="text-sm font-medium mb-1">Night Report</p>
              <p className="text-xs text-muted-foreground">End of day summary</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold">11:46 PM</p>
              <Badge variant="outline" className="text-xs mt-1">GMT+7</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Test Scheduler */}
      <div className="border border-border rounded-lg p-6 bg-card">
        <h3 className="text-base font-semibold mb-2">Test Scheduler</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Send a test report to Slack immediately to verify your configuration.
        </p>
        <Button
          onClick={handleTestScheduler}
          disabled={triggering}
          variant="outline"
          className="w-full sm:w-auto"
        >
          <Play className="w-4 h-4 mr-2" />
          {triggering ? "Sending..." : "Trigger Now"}
        </Button>
      </div>
    </div>
  );
}
