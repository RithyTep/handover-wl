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
import { trpc } from "@/components/trpc-provider";
import { useThemeStore } from "@/lib/stores/theme-store";
import type { Theme, ThemeInfo } from "@/lib/types";
import { toast } from "sonner";

interface ThemeSelectorProps {
  variant?: "christmas" | "default";
}

export function ThemeSelector({ variant }: ThemeSelectorProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Get selected theme from Zustand store
  const selectedTheme = useThemeStore((state) => state.selectedTheme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const initializeFromServer = useThemeStore((state) => state.initializeFromServer);
  const loadFromLocalStorage = useThemeStore((state) => state.loadFromLocalStorage);

  // Fetch themes from server ONCE (staleTime: Infinity, gcTime: Infinity)
  const { data: themes, isLoading: themesLoading } = trpc.theme.getAll.useQuery(
    undefined,
    {
      staleTime: Infinity,
      gcTime: Infinity,
    }
  );

  // Load from localStorage on mount
  useEffect(() => {
    loadFromLocalStorage();
  }, [loadFromLocalStorage]);

  // Initialize from server if no localStorage theme
  useEffect(() => {
    if (themes && themes.length > 0 && selectedTheme === null) {
      initializeFromServer(themes);
    }
  }, [themes, selectedTheme, initializeFromServer]);

  // Optional: Mutation for saving to server (only called when explicitly saving)
  const saveThemeMutation = trpc.theme.setSelected.useMutation({
    onSuccess: () => {
      toast.success("Theme preference saved");
    },
    onError: (error) => {
      console.error("[Theme] Error saving to server:", error);
      // Don't show error to user - theme is already in localStorage
    },
  });

  const handleThemeSelect = async (theme: Theme) => {
    if (theme === selectedTheme) return;

    // Update Zustand store immediately (UI updates instantly)
    setTheme(theme);
    toast.success(`Theme changed to ${themes?.find((t) => t.id === theme)?.name || theme}`);
    setOpen(false);

    // Optionally save to server in background (non-blocking)
    // Uncomment if you want auto-save:
    // saveThemeMutation.mutate({ theme });
  };

  const handleSavePreference = async () => {
    if (!selectedTheme) return;
    setLoading(true);
    try {
      await saveThemeMutation.mutateAsync({ theme: selectedTheme });
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

          {themesLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">Loading themes...</div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {themes?.map((theme: ThemeInfo) => (
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

              <div className="mt-4 flex justify-end">
                <Button
                  onClick={handleSavePreference}
                  disabled={loading || !selectedTheme}
                  variant="outline"
                >
                  {loading ? "Saving..." : "Save Preference to Server"}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
