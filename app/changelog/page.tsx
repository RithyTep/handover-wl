import { ArrowLeft, Tag, Calendar, Sparkles, Bug, Wrench, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ChangelogEntry {
  version: string;
  date: string;
  title: string;
  changes: {
    type: "feature" | "fix" | "improvement" | "breaking";
    description: string;
  }[];
}

const changelog: ChangelogEntry[] = [
  {
    version: "3.6.0",
    date: "2024-12-05",
    title: "Custom SVG Icons, tRPC & Theme Enhancement",
    changes: [
      { type: "feature", description: "Added 64+ custom SVG icons across all 4 themes (Christmas, Pixel, Lunar, Coding)" },
      { type: "feature", description: "New themed loading screens with animated decorations" },
      { type: "feature", description: "Floating animated icons in scene backgrounds" },
      { type: "feature", description: "Migrated to tRPC for type-safe API calls" },
      { type: "improvement", description: "Enhanced dashboard header with theme-specific icons" },
      { type: "improvement", description: "Updated action buttons with custom themed icons" },
      { type: "improvement", description: "Added custom themed cursors for Pixel, Lunar, and Coding themes" },
      { type: "improvement", description: "New CSS animations: christmas-fall, coding-float, lunar-float, pixel-float" },
    ],
  },
  {
    version: "3.5.0",
    date: "2024-11-30",
    title: "Feedback & Changelog",
    changes: [
      { type: "feature", description: "Added anonymous feedback page - submit bugs, suggestions, and feature requests" },
      { type: "feature", description: "Added changelog page to track version history" },
      { type: "improvement", description: "Updated navigation with Feedback and Changelog links" },
      { type: "improvement", description: "Backup system with SSR and Next.js 16 support" },
    ],
  },
  {
    version: "3.4.1",
    date: "2024-11-25",
    title: "Bug Fixes",
    changes: [
      { type: "fix", description: "Fixed input bug in forms" },
      { type: "improvement", description: "Enhanced mobile UI responsiveness" },
    ],
  },
  {
    version: "3.4.0",
    date: "2024-11-20",
    title: "AI Integration",
    changes: [
      { type: "feature", description: "Added AI-powered features (v2)" },
      { type: "improvement", description: "Enhanced AI autofill capabilities" },
    ],
  },
  {
    version: "3.3.0",
    date: "2024-11-15",
    title: "UI Enhancement",
    changes: [
      { type: "improvement", description: "Major UI enhancements and polish" },
      { type: "improvement", description: "Better visual design and user experience" },
    ],
  },
  {
    version: "3.2.0",
    date: "2024-11-10",
    title: "Scheduler & Fixes",
    changes: [
      { type: "feature", description: "Added scheduler functionality" },
      { type: "fix", description: "Fixed copy error with invalid URL" },
      { type: "feature", description: "Shift-based scheduler with separate user tokens" },
    ],
  },
  {
    version: "3.1.2",
    date: "2024-11-05",
    title: "URL Copy Fix",
    changes: [
      { type: "fix", description: "Fixed URL copy functionality" },
    ],
  },
  {
    version: "3.1.1",
    date: "2024-11-03",
    title: "Input Bug Fix",
    changes: [
      { type: "fix", description: "Fixed bug in input fields" },
    ],
  },
  {
    version: "3.1.0",
    date: "2024-11-01",
    title: "Feature Update",
    changes: [
      { type: "feature", description: "Comment feature for tickets" },
      { type: "feature", description: "Member mentions and secret scheduler route" },
    ],
  },
  {
    version: "3.0.0",
    date: "2024-10-25",
    title: "Major Release",
    changes: [
      { type: "feature", description: "Complete UI overhaul" },
      { type: "feature", description: "Detailed ticket information display" },
      { type: "breaking", description: "New architecture and design system" },
    ],
  },
  {
    version: "2.1.0",
    date: "2024-10-15",
    title: "Copy Feature",
    changes: [
      { type: "feature", description: "Added copy feature for ticket data" },
    ],
  },
  {
    version: "2.0.0",
    date: "2024-10-01",
    title: "Next.js Migration",
    changes: [
      { type: "feature", description: "Migrated to Next.js with new UI" },
      { type: "feature", description: "Slack alert integration" },
      { type: "feature", description: "PostgreSQL database support" },
      { type: "improvement", description: "Railway deployment support" },
    ],
  },
  {
    version: "1.0.0",
    date: "2024-09-01",
    title: "Initial Release",
    changes: [
      { type: "feature", description: "Python GUI application for Jira handover management" },
      { type: "feature", description: "Basic Slack notification integration" },
      { type: "feature", description: "Local data storage" },
    ],
  },
];

const typeConfig = {
  feature: { icon: Sparkles, label: "Feature", color: "bg-green-500/10 text-green-500 border-green-500/20" },
  fix: { icon: Bug, label: "Fix", color: "bg-red-500/10 text-red-500 border-red-500/20" },
  improvement: { icon: Zap, label: "Improvement", color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  breaking: { icon: Wrench, label: "Breaking", color: "bg-orange-500/10 text-orange-500 border-orange-500/20" },
};

export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="mb-4 -ml-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold tracking-tight">Changelog</h1>
            <Badge variant="outline" className="text-xs">
              v{changelog[0].version}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Track all updates, improvements, and fixes to the Jira Handover Dashboard.
          </p>
        </div>

        <div className="space-y-6">
          {changelog.map((entry, index) => (
            <Card key={entry.version} className={index === 0 ? "border-primary/30 bg-primary/5" : ""}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-primary" />
                      <CardTitle className="text-lg">v{entry.version}</CardTitle>
                    </div>
                    {index === 0 && (
                      <Badge className="bg-primary/10 text-primary border-primary/20">Latest</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5" />
                    {entry.date}
                  </div>
                </div>
                <CardDescription className="font-medium">{entry.title}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {entry.changes.map((change, changeIndex) => {
                    const config = typeConfig[change.type];
                    const Icon = config.icon;
                    return (
                      <li key={changeIndex} className="flex items-start gap-3">
                        <Badge variant="outline" className={`${config.color} text-xs shrink-0 mt-0.5`}>
                          <Icon className="w-3 h-3 mr-1" />
                          {config.label}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{change.description}</span>
                      </li>
                    );
                  })}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            Have feedback or suggestions?{" "}
            <Link href="/feedback" className="text-primary hover:underline">
              Let us know
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: "Changelog - Jira Handover",
  description: "Version history and updates for Jira Handover Dashboard",
};
