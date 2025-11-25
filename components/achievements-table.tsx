"use client";

import { Achievement } from "@/app/achievements/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface AchievementsTableProps {
  achievements: Achievement[];
  achievementData: Record<string, string>;
  updateAchievementData: (key: string, value: string) => void;
  loading: boolean;
}

export function AchievementsTable({
  achievements,
  achievementData,
  updateAchievementData,
  loading,
}: AchievementsTableProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  if (achievements.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center">
        <p className="text-sm text-muted-foreground">
          No achievements found. They will be auto-populated from your Jira tickets.
        </p>
      </div>
    );
  }

  const getTypeBadge = (type: Achievement["type"]) => {
    const variants: Record<Achievement["type"], { label: string; variant: any }> = {
      feature: { label: "Feature", variant: "default" },
      support: { label: "Support", variant: "secondary" },
      cooperation: { label: "Cooperation", variant: "outline" },
      other: { label: "Other", variant: "outline" },
    };

    const config = variants[type];
    return (
      <Badge variant={config.variant} className="text-xs">
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[50px]">#</TableHead>
            <TableHead className="w-[120px]">Type</TableHead>
            <TableHead className="w-[300px]">Achievement</TableHead>
            <TableHead className="w-[150px]">Category</TableHead>
            <TableHead className="w-[250px]">Description</TableHead>
            <TableHead>Impact / Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {achievements.map((achievement, index) => (
            <TableRow key={achievement.id} className="group">
              <TableCell className="font-medium text-muted-foreground">
                {index + 1}
              </TableCell>

              <TableCell>{getTypeBadge(achievement.type)}</TableCell>

              <TableCell>
                <div>
                  <p className="text-sm font-medium">{achievement.title}</p>
                  {achievement.ticketKeys && achievement.ticketKeys.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {achievement.ticketKeys.slice(0, 3).map((key) => (
                        <span
                          key={key}
                          className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                        >
                          {key}
                        </span>
                      ))}
                      {achievement.ticketKeys.length > 3 && (
                        <span className="text-xs text-muted-foreground">
                          +{achievement.ticketKeys.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {achievement.period}
                  </p>
                </div>
              </TableCell>

              <TableCell>
                <Input
                  placeholder="e.g., Feature Development"
                  value={
                    achievementData[`category-${achievement.id}`] ||
                    achievement.savedCategory ||
                    ""
                  }
                  onChange={(e) =>
                    updateAchievementData(
                      `category-${achievement.id}`,
                      e.target.value
                    )
                  }
                  className="h-9 text-sm"
                />
              </TableCell>

              <TableCell>
                <Textarea
                  placeholder="What did you do?"
                  value={
                    achievementData[`description-${achievement.id}`] ||
                    achievement.savedDescription ||
                    ""
                  }
                  onChange={(e) =>
                    updateAchievementData(
                      `description-${achievement.id}`,
                      e.target.value
                    )
                  }
                  className="min-h-[60px] text-sm resize-none"
                  rows={2}
                />
              </TableCell>

              <TableCell>
                <Textarea
                  placeholder="Impact, results, or notes"
                  value={
                    achievementData[`impact-${achievement.id}`] ||
                    achievement.savedImpact ||
                    ""
                  }
                  onChange={(e) =>
                    updateAchievementData(
                      `impact-${achievement.id}`,
                      e.target.value
                    )
                  }
                  className="min-h-[60px] text-sm resize-none"
                  rows={2}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
