"use client";

import { useState, useEffect } from "react";
import { Check, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { THEMES, DEFAULT_THEME } from "@/lib/constants";
import type { Theme, ThemeInfo } from "@/lib/types";
import axios from "axios";
import { toast } from "sonner";

interface ThemeSelectorProps {
  currentTheme: Theme;
  onThemeChange?: (theme: Theme) => void;
  variant?: "christmas" | "default";
}

export function ThemeSelector({ currentTheme, onThemeChange, variant }: ThemeSelectorProps) {
  const [open, setOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<Theme>(currentTheme);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSelectedTheme(currentTheme);
  }, [currentTheme]);

  const handleThemeSelect = async (theme: Theme) => {
    if (theme === selectedTheme) return;

    setLoading(true);
    try {
      // Update localStorage immediately for instant reactivity
      localStorage.setItem("theme_preference", theme);
      setSelectedTheme(theme);
      onThemeChange?.(theme);

      // Save to database in background (non-blocking)
      axios.post("/api/theme", { theme }).catch((error) => {
        console.error("[Theme] Error saving to DB:", error);
        // Theme is already in localStorage, so user experience is not affected
      });

      toast.success(`Theme changed to ${THEMES.find(t => t.id === theme)?.name}`);
      setOpen(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      toast.error(`Failed to change theme: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(true)}
        className={variant === "christmas" ? "text-white/70 hover:text-white hover:bg-white/10" : "text-foreground hover:bg-muted"}
        title="Change Theme"
      >
        <Palette className="w-4 h-4 mr-1.5" />
        <span className="hidden sm:inline">Theme</span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Theme</DialogTitle>
            <DialogDescription>
              Choose the theme that best represents your style and brand.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {THEMES.map((theme: ThemeInfo) => (
              <button
                key={theme.id}
                onClick={() => handleThemeSelect(theme.id)}
                disabled={loading}
                className={`
                  relative p-4 rounded-lg border-2 transition-all
                  ${
                    selectedTheme === theme.id
                      ? "border-green-500 bg-green-500/10"
                      : "border-border hover:border-primary/50"
                  }
                  ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                `}
              >
                {selectedTheme === theme.id && (
                  <div className="absolute top-2 right-2">
                    <div className="bg-green-500 text-white rounded-full p-1">
                      <Check className="w-3 h-3" />
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <div className="text-3xl">{theme.icon}</div>
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-lg mb-1">{theme.name}</h3>
                    {selectedTheme === theme.id && (
                      <span className="text-xs text-green-600 dark:text-green-400 mb-2 block">
                        Currently active
                      </span>
                    )}
                    <p className="text-sm text-muted-foreground">{theme.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h4 className="font-semibold mb-2">About Themes</h4>
            <p className="text-sm text-muted-foreground">
              Themes control the overall look and feel of your portfolio. Each theme has a unique
              layout, typography, and color scheme. You can switch themes at any time without losing
              your content. Changes are applied immediately to your public portfolio.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
