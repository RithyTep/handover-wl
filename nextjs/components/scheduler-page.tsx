"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { Clock, Play, CheckCircle2, XCircle, Calendar, Bell, Save, Zap, Hash, AtSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SchedulerPage() {
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [triggering, setTriggering] = useState(false);
  const [loading, setLoading] = useState(true);
  const [time1, setTime1] = useState("17:10");
  const [time2, setTime2] = useState("22:40");
  const [triggeringComments, setTriggeringComments] = useState(false);
  const [customChannelId, setCustomChannelId] = useState("");
  const [memberMentions, setMemberMentions] = useState("");

  useEffect(() => {
    fetchSchedulerState();
    fetchTriggerTimes();
    fetchCustomChannelId();
    fetchMemberMentions();
  }, []);

  const fetchTriggerTimes = async () => {
    try {
      const response = await axios.get("/api/trigger-times");
      if (response.data.success) {
        setTime1(response.data.times.time1);
        setTime2(response.data.times.time2);
      }
    } catch (error: any) {
      console.error("Error fetching trigger times:", error);
    }
  };

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
        toast.success("Scheduler enabled! Reports will be sent at 5:10 PM and 10:40 PM GMT+7");
      } else {
        toast.success("Scheduler disabled");
      }
    } catch (error: any) {
      toast.dismiss(loadingToast);
      toast.error("Failed to update scheduler: " + error.message);
      console.error("Error updating scheduler state:", error);
    }
  };

  const handleSaveTriggerTimes = async () => {
    const loadingToast = toast.loading("Saving trigger times...");

    try {
      await axios.post("/api/trigger-times", { time1, time2 });

      toast.dismiss(loadingToast);
      toast.success(`Trigger times updated to ${time1} and ${time2}. Restart the server to apply changes.`);
    } catch (error: any) {
      toast.dismiss(loadingToast);
      toast.error("Error saving trigger times: " + error.message);
    }
  };

  const fetchCustomChannelId = async () => {
    try {
      const response = await axios.get("/api/custom-channel");
      if (response.data.success && response.data.channelId) {
        setCustomChannelId(response.data.channelId);
      }
    } catch (error: any) {
      console.error("Error fetching custom channel ID:", error);
    }
  };

  const handleSaveCustomChannelId = async () => {
    const loadingToast = toast.loading("Saving custom channel ID...");

    try {
      await axios.post("/api/custom-channel", { channelId: customChannelId });

      toast.dismiss(loadingToast);
      toast.success("Custom channel ID saved successfully!");
    } catch (error: any) {
      toast.dismiss(loadingToast);
      toast.error("Error saving channel ID: " + error.message);
    }
  };

  const fetchMemberMentions = async () => {
    try {
      const response = await axios.get("/api/member-mentions");
      if (response.data.success && response.data.mentions) {
        setMemberMentions(response.data.mentions);
      }
    } catch (error: any) {
      console.error("Error fetching member mentions:", error);
    }
  };

  const handleSaveMemberMentions = async () => {
    const loadingToast = toast.loading("Saving member mentions...");

    try {
      await axios.post("/api/member-mentions", { mentions: memberMentions });

      toast.dismiss(loadingToast);
      toast.success("Member mentions saved successfully!");
    } catch (error: any) {
      toast.dismiss(loadingToast);
      toast.error("Error saving mentions: " + error.message);
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

  const handleTriggerScheduledComments = async () => {
    setTriggeringComments(true);
    const loadingToast = toast.loading("Scanning for handover messages and posting replies...");

    try {
      // Directly call scan-and-reply endpoint (no new handover message)
      const response = await axios.post("/api/scan-and-reply-handover");

      toast.dismiss(loadingToast);

      if (response.data.replied) {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.5 },
        });
        toast.success(`Reply posted successfully! (${response.data.ticketsCount} tickets)`);
      } else {
        toast.info(response.data.message || "No handover messages found that need replies");
      }
    } catch (error: any) {
      toast.dismiss(loadingToast);
      toast.error("Error scanning messages: " + error.message);
    } finally {
      setTriggeringComments(false);
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

        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="time1" className="text-sm font-medium mb-2 block">
                Evening Report
              </Label>
              <Input
                id="time1"
                type="time"
                value={time1}
                onChange={(e) => setTime1(e.target.value)}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground mt-1">Daily handover summary</p>
            </div>

            <div>
              <Label htmlFor="time2" className="text-sm font-medium mb-2 block">
                Night Report
              </Label>
              <Input
                id="time2"
                type="time"
                value={time2}
                onChange={(e) => setTime2(e.target.value)}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground mt-1">End of day summary</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">GMT+7</Badge>
            <p className="text-xs text-muted-foreground">
              Server restart required for changes to take effect
            </p>
          </div>

          <Button
            onClick={handleSaveTriggerTimes}
            variant="default"
            size="sm"
            className="w-full sm:w-auto"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Trigger Times
          </Button>
        </div>
      </div>

      {/* Custom Channel ID */}
      <div className="border border-border rounded-lg p-6 bg-card">
        <div className="flex items-center gap-2 mb-4">
          <Hash className="w-4 h-4 text-muted-foreground" />
          <h3 className="text-base font-semibold">Slack Channel</h3>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="channelId" className="text-sm font-medium mb-2 block">
              Custom Channel ID
            </Label>
            <Input
              id="channelId"
              type="text"
              value={customChannelId}
              onChange={(e) => setCustomChannelId(e.target.value)}
              placeholder="C08TWKP6ZK7"
              className="w-full font-mono"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Leave empty to use default channel from environment variables
            </p>
          </div>

          <Button
            onClick={handleSaveCustomChannelId}
            variant="default"
            size="sm"
            className="w-full sm:w-auto"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Channel ID
          </Button>
        </div>
      </div>

      {/* Test Scheduler */}
      <div className="border border-border rounded-lg p-6 bg-card">
        <h3 className="text-base font-semibold mb-2">Manual Triggers</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Manually trigger scheduled tasks to test your configuration.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleTestScheduler}
            disabled={triggering}
            variant="outline"
            className="w-full sm:w-auto"
          >
            <Play className="w-4 h-4 mr-2" />
            {triggering ? "Sending..." : "Trigger Handover Report"}
          </Button>
          <Button
            onClick={handleTriggerScheduledComments}
            disabled={triggeringComments}
            variant="outline"
            className="w-full sm:w-auto"
          >
            <Zap className="w-4 h-4 mr-2" />
            {triggeringComments ? "Posting..." : "Trigger Scheduled Comments"}
          </Button>
        </div>
      </div>

      {/* Member Mentions */}
      <div className="border border-border rounded-lg p-6 bg-card">
        <div className="flex items-center gap-2 mb-4">
          <AtSign className="w-4 h-4 text-muted-foreground" />
          <h3 className="text-base font-semibold">Member Mentions</h3>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="mentions" className="text-sm font-medium mb-2 block">
              Slack Member IDs or Mentions
            </Label>
            <Input
              id="mentions"
              type="text"
              value={memberMentions}
              onChange={(e) => setMemberMentions(e.target.value)}
              placeholder="<@U123456> <@U789012> or @channel"
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-1">
              These mentions will appear below "Please refer to this ticket information" in handover messages
            </p>
          </div>

          <Button
            onClick={handleSaveMemberMentions}
            variant="default"
            size="sm"
            className="w-full sm:w-auto"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Member Mentions
          </Button>
        </div>
      </div>
    </div>
  );
}
