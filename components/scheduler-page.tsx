"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { Clock, Play, CheckCircle2, XCircle, Bell, Save, Zap, Hash, AtSign, Key, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SchedulerPage() {
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [triggeringComments, setTriggeringComments] = useState(false);
  const [customChannelId, setCustomChannelId] = useState("");

  const [eveningToken, setEveningToken] = useState("");
  const [nightToken, setNightToken] = useState("");
  const [eveningMentions, setEveningMentions] = useState("");
  const [nightMentions, setNightMentions] = useState("");

  useEffect(() => {
    fetchSchedulerState();
    fetchCustomChannelId();
    fetchShiftSettings();
  }, []);

  const fetchShiftSettings = async () => {
    try {
      const response = await axios.get("/api/shift-tokens");
      if (response.data.success) {
        const { eveningToken, nightToken, eveningMentions, nightMentions } = response.data.data;
        setEveningToken(eveningToken);
        setNightToken(nightToken);
        setEveningMentions(eveningMentions);
        setNightMentions(nightMentions);
      }
    } catch (error: unknown) {
      console.error("Error fetching shift settings:", error);
    }
  };

  const fetchSchedulerState = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/scheduler-state");
      setScheduleEnabled(response.data.enabled);
    } catch (error: unknown) {
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
        toast.success("Scheduler enabled! Reports will be sent at configured times.");
      } else {
        toast.success("Scheduler disabled");
      }
    } catch (error: unknown) {
      toast.dismiss(loadingToast);
      const message = error instanceof Error ? error.message : "Unknown error";
      toast.error("Failed to update scheduler: " + message);
      console.error("Error updating scheduler state:", error);
    }
  };

  const fetchCustomChannelId = async () => {
    try {
      const response = await axios.get("/api/custom-channel");
      if (response.data.success && response.data.channelId) {
        setCustomChannelId(response.data.channelId);
      }
    } catch (error: unknown) {
      console.error("Error fetching custom channel ID:", error);
    }
  };

  const handleSaveCustomChannelId = async () => {
    const loadingToast = toast.loading("Saving custom channel ID...");

    try {
      await axios.post("/api/custom-channel", { channelId: customChannelId });

      toast.dismiss(loadingToast);
      toast.success("Custom channel ID saved successfully!");
    } catch (error: unknown) {
      toast.dismiss(loadingToast);
      const message = error instanceof Error ? error.message : "Unknown error";
      toast.error("Error saving channel ID: " + message);
    }
  };

  const handleSaveShiftSettings = async () => {
    const loadingToast = toast.loading("Saving shift settings...");

    try {
      await axios.post("/api/shift-tokens", {
        eveningToken,
        nightToken,
        eveningMentions,
        nightMentions
      });

      toast.dismiss(loadingToast);
      toast.success("Shift settings saved successfully!");
    } catch (error: unknown) {
      toast.dismiss(loadingToast);
      const message = error instanceof Error ? error.message : "Unknown error";
      toast.error("Error saving shift settings: " + message);
    }
  };

  const handleTriggerScheduledComments = async () => {
    setTriggeringComments(true);
    const loadingToast = toast.loading("Scanning for handover messages and posting replies...");

    try {
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
    } catch (error: unknown) {
      toast.dismiss(loadingToast);
      const message = error instanceof Error ? error.message : "Unknown error";
      toast.error("Error scanning messages: " + message);
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
      <div>
        <h2 className="text-2xl font-semibold tracking-tight mb-2">Scheduler</h2>
        <p className="text-sm text-muted-foreground">
          Configure shift-based handover reports with custom user tokens.
        </p>
      </div>

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
                  Reports will be sent based on shift configuration. Only shifts with valid user tokens will trigger.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

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

      <div className="border border-border rounded-lg p-6 bg-card">
        <div className="flex items-center gap-2 mb-4">
          <Sun className="w-4 h-4 text-orange-500" />
          <h3 className="text-base font-semibold">Evening Shift</h3>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="eveningToken" className="text-sm font-medium mb-2 block">
              <Key className="w-3 h-3 inline mr-1" />
              Evening User Token
            </Label>
            <Input
              id="eveningToken"
              type="password"
              value={eveningToken}
              onChange={(e) => setEveningToken(e.target.value)}
              placeholder="xoxp-..."
              className="w-full font-mono"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Slack user token for evening report. Leave empty to disable evening report.
            </p>
          </div>

          <div>
            <Label htmlFor="eveningMentions" className="text-sm font-medium mb-2 block">
              <AtSign className="w-3 h-3 inline mr-1" />
              Evening Mentions
            </Label>
            <Input
              id="eveningMentions"
              type="text"
              value={eveningMentions}
              onChange={(e) => setEveningMentions(e.target.value)}
              placeholder="<@U123456> <@U789012> or @channel"
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Member mentions for evening shift handover
            </p>
          </div>
        </div>
      </div>

      <div className="border border-border rounded-lg p-6 bg-card">
        <div className="flex items-center gap-2 mb-4">
          <Moon className="w-4 h-4 text-blue-500" />
          <h3 className="text-base font-semibold">Night Shift</h3>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="nightToken" className="text-sm font-medium mb-2 block">
              <Key className="w-3 h-3 inline mr-1" />
              Night User Token
            </Label>
            <Input
              id="nightToken"
              type="password"
              value={nightToken}
              onChange={(e) => setNightToken(e.target.value)}
              placeholder="xoxp-..."
              className="w-full font-mono"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Slack user token for night report. Leave empty to disable night report.
            </p>
          </div>

          <div>
            <Label htmlFor="nightMentions" className="text-sm font-medium mb-2 block">
              <AtSign className="w-3 h-3 inline mr-1" />
              Night Mentions
            </Label>
            <Input
              id="nightMentions"
              type="text"
              value={nightMentions}
              onChange={(e) => setNightMentions(e.target.value)}
              placeholder="<@U123456> <@U789012> or @channel"
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Member mentions for night shift handover
            </p>
          </div>
        </div>
      </div>

      <div className="border border-border rounded-lg p-6 bg-card">
        <Button
          onClick={handleSaveShiftSettings}
          variant="default"
          size="lg"
          className="w-full"
        >
          <Save className="w-4 h-4 mr-2" />
          Save All Shift Settings
        </Button>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Save tokens and mentions for both evening and night shifts
        </p>
      </div>

      <div className="border border-border rounded-lg p-6 bg-card">
        <h3 className="text-base font-semibold mb-2">Manual Trigger</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Manually scan and reply to handover messages.
        </p>
        <Button
          onClick={handleTriggerScheduledComments}
          disabled={triggeringComments}
          variant="outline"
          className="w-full"
        >
          <Zap className="w-4 h-4 mr-2" />
          {triggeringComments ? "Posting..." : "Trigger Scheduled Comments"}
        </Button>
      </div>
    </div>
  );
}
