"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Save,
  Send,
  RefreshCw,
  Trash2,
  Trophy,
  Target,
  Users,
  Code,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ThemeToggle } from "@/components/theme-toggle";
import { AchievementsTable } from "@/components/achievements-table";
import { Achievement } from "./types";

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [achievementData, setAchievementData] = useState<
    Record<string, string>
  >({});

  // Dialog states
  const [saveDialog, setSaveDialog] = useState(false);
  const [clearDialog, setClearDialog] = useState(false);

  useEffect(() => {
    fetchAchievements();
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [achievementData]);

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/achievements");
      const data = await response.json();

      if (data.success) {
        setAchievements(data.achievements);

        // Initialize achievement data from saved values
        const initialData: Record<string, string> = {};
        data.achievements.forEach((achievement: Achievement) => {
          initialData[`category-${achievement.id}`] =
            achievement.savedCategory || "";
          initialData[`description-${achievement.id}`] =
            achievement.savedDescription || "";
          initialData[`impact-${achievement.id}`] =
            achievement.savedImpact || "";
        });
        setAchievementData(initialData);
      } else {
        toast.error(data.message || "Failed to load achievements");
      }
    } catch (error: any) {
      toast.error("Error loading achievements: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateAchievementData = (key: string, value: string) => {
    setAchievementData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      const achievementsToSave = achievements.map((achievement) => ({
        id: achievement.id,
        title: achievement.title,
        savedCategory:
          achievementData[`category-${achievement.id}`] ||
          achievement.savedCategory,
        savedDescription:
          achievementData[`description-${achievement.id}`] ||
          achievement.savedDescription,
        savedImpact:
          achievementData[`impact-${achievement.id}`] ||
          achievement.savedImpact,
      }));

      const response = await fetch("/api/achievements/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ achievements: achievementsToSave }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("✓ Achievements saved successfully");
        setSaveDialog(false);
      } else {
        toast.error(data.message || "Failed to save achievements");
      }
    } catch (error: any) {
      toast.error("Error saving: " + error.message);
    }
  };

  const handleClear = async () => {
    try {
      const response = await fetch("/api/achievements/clear", {
        method: "POST",
      });
      const data = await response.json();

      if (data.success) {
        toast.success("✓ All achievements cleared");
        setAchievementData({});
        await fetchAchievements();
        setClearDialog(false);
      } else {
        toast.error(data.message || "Failed to clear achievements");
      }
    } catch (error: any) {
      toast.error("Error clearing: " + error.message);
    }
  };

  const handleRefresh = () => {
    toast.promise(fetchAchievements(), {
      loading: "Refreshing achievements...",
      success: "✓ Achievements refreshed",
      error: "Failed to refresh achievements",
    });
  };

  const stats = {
    total: achievements.length,
    featureWork: achievements.filter(
      (a) =>
        achievementData[`category-${a.id}`]?.toLowerCase().includes("feature") ||
        a.savedCategory?.toLowerCase().includes("feature")
    ).length,
    support: achievements.filter(
      (a) =>
        achievementData[`category-${a.id}`]?.toLowerCase().includes("support") ||
        a.savedCategory?.toLowerCase().includes("support")
    ).length,
    cooperation: achievements.filter(
      (a) =>
        achievementData[`category-${a.id}`]
          ?.toLowerCase()
          .includes("cooperation") ||
        a.savedCategory?.toLowerCase().includes("cooperation")
    ).length,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 h-[52px] border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-full items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Trophy className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-semibold">Performance Achievements</h1>
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
              H2 2025
            </span>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={loading}
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setClearDialog(true)}>
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button variant="default" size="sm" onClick={() => setSaveDialog(true)}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="px-6 py-4 grid grid-cols-4 gap-4">
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Trophy className="h-4 w-4" />
            <span>Total Achievements</span>
          </div>
          <p className="text-2xl font-semibold">{stats.total}</p>
        </div>

        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Code className="h-4 w-4" />
            <span>Feature Work</span>
          </div>
          <p className="text-2xl font-semibold">{stats.featureWork}</p>
        </div>

        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Target className="h-4 w-4" />
            <span>Support Tickets</span>
          </div>
          <p className="text-2xl font-semibold">{stats.support}</p>
        </div>

        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Users className="h-4 w-4" />
            <span>Cooperation</span>
          </div>
          <p className="text-2xl font-semibold">{stats.cooperation}</p>
        </div>
      </div>

      {/* Table */}
      <div className="px-6 pb-6">
        <AchievementsTable
          achievements={achievements}
          achievementData={achievementData}
          updateAchievementData={updateAchievementData}
          loading={loading}
        />
      </div>

      {/* Save Confirmation Dialog */}
      <Dialog open={saveDialog} onOpenChange={setSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Achievements</DialogTitle>
            <DialogDescription>
              Save your current achievement tracking progress. This will store all
              categories, descriptions, and impact notes.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setSaveDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Clear Confirmation Dialog */}
      <Dialog open={clearDialog} onOpenChange={setClearDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clear All Achievements</DialogTitle>
            <DialogDescription className="text-destructive">
              This will permanently delete all saved achievement data. This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setClearDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleClear}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
