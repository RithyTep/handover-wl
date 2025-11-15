"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Save,
  Send,
  Zap,
  Trash2,
  RefreshCw,
  Copy,
  Clock,
  Moon,
  Sun,
  Search,
  Sparkles,
} from "lucide-react";
import { useTheme } from "next-themes";

interface CommandPaletteProps {
  onQuickFill?: () => void;
  onAIFillAll?: () => void;
  onClear?: () => void;
  onSave?: () => void;
  onSendSlack?: () => void;
  onCopy?: () => void;
  onRefresh?: () => void;
  onScheduler?: () => void;
}

export function CommandPalette({
  onQuickFill,
  onAIFillAll,
  onClear,
  onSave,
  onSendSlack,
  onCopy,
  onRefresh,
  onScheduler,
}: CommandPaletteProps) {
  const [open, setOpen] = useState(false);
  const { setTheme, theme } = useTheme();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = useCallback((command: () => void) => {
    setOpen(false);
    command();
  }, []);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Actions">
          {onSave && (
            <CommandItem onSelect={() => runCommand(onSave)}>
              <Save className="mr-2 h-4 w-4" />
              <span>Save Changes</span>
              <span className="ml-auto text-xs text-muted-foreground">⌘S</span>
            </CommandItem>
          )}
          {onSendSlack && (
            <CommandItem onSelect={() => runCommand(onSendSlack)}>
              <Send className="mr-2 h-4 w-4" />
              <span>Send to Slack</span>
            </CommandItem>
          )}
          {onCopy && (
            <CommandItem onSelect={() => runCommand(onCopy)}>
              <Copy className="mr-2 h-4 w-4" />
              <span>Copy for Slack</span>
            </CommandItem>
          )}
          {onScheduler && (
            <CommandItem onSelect={() => runCommand(onScheduler)}>
              <Clock className="mr-2 h-4 w-4" />
              <span>Open Scheduler</span>
            </CommandItem>
          )}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Quick Actions">
          {onAIFillAll && (
            <CommandItem onSelect={() => runCommand(onAIFillAll)}>
              <Sparkles className="mr-2 h-4 w-4" />
              <span>AI Fill All Missing</span>
            </CommandItem>
          )}
          {onQuickFill && (
            <CommandItem onSelect={() => runCommand(onQuickFill)}>
              <Zap className="mr-2 h-4 w-4" />
              <span>Quick Fill All</span>
            </CommandItem>
          )}
          {onClear && (
            <CommandItem onSelect={() => runCommand(onClear)}>
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Clear All Fields</span>
            </CommandItem>
          )}
          {onRefresh && (
            <CommandItem onSelect={() => runCommand(onRefresh)}>
              <RefreshCw className="mr-2 h-4 w-4" />
              <span>Refresh Tickets</span>
            </CommandItem>
          )}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Preferences">
          <CommandItem onSelect={() => runCommand(() => setTheme(theme === "dark" ? "light" : "dark"))}>
            {theme === "dark" ? (
              <Sun className="mr-2 h-4 w-4" />
            ) : (
              <Moon className="mr-2 h-4 w-4" />
            )}
            <span>Toggle Theme</span>
            <span className="ml-auto text-xs text-muted-foreground">⌘⇧L</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
