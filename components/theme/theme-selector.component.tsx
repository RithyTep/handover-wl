"use client";

import { useState } from "react";
import { Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useTheme } from "@/hooks/theme/use-theme.hook";
import { ThemeButton } from "./theme-button.component";
import { ThemeList } from "./theme-list.component";
import { cn } from "@/lib/utils";
import { Theme } from "@/enums/theme.enum";

interface ThemeSelectorProps {
  variant?: Theme;
}

export function ThemeSelector({ variant }: ThemeSelectorProps) {
  const [open, setOpen] = useState(false);
  const { themes, selectedTheme, isLoading, handleThemeSelect, handleSaveToServer, isSaving } = useTheme();

  const handleSave = async () => {
    await handleSaveToServer(selectedTheme);
    setOpen(false);
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(true)}
        className={cn(
          variant === Theme.CHRISTMAS
            ? "text-white/70 hover:text-white hover:bg-white/10"
            : variant === Theme.PIXEL
            ? "text-slate-300 hover:text-indigo-400 transition-colors"
            : variant === Theme.LUNAR
            ? "text-stone-400 hover:text-amber-400 hover:bg-stone-800/50 transition-colors"
            : variant === Theme.CODING
            ? "text-zinc-500 hover:text-indigo-400 transition-colors"
            : "text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition-colors"
        )}
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

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">Loading themes...</div>
            </div>
          ) : (
            <>
              <ThemeList
                themes={themes}
                selectedTheme={selectedTheme}
                onSelect={handleThemeSelect}
                disabled={isSaving}
              />

              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">About Themes</h4>
                <p className="text-sm text-muted-foreground">
                  Themes control the overall look and feel of your portfolio. Each theme has a unique
                  layout, typography, and color scheme. You can switch themes at any time without losing
                  your content. Changes are applied immediately to your public portfolio.
                </p>
              </div>

              <div className="mt-4 flex justify-end">
                <Button onClick={handleSave} disabled={isSaving} variant="outline">
                  {isSaving ? "Saving..." : "Save Preference to Server"}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
