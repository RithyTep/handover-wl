"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Pencil, Trash2, Plus, Clock, CheckCircle2, MessageSquare, Ticket } from "lucide-react";
import { trpc } from "@/components/trpc-provider"
import { toast } from "sonner"
import { CommentType } from "@/enums"
import type { IScheduledCommentItem } from "@/interfaces"

export default function ScheduledComments() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingComment, setEditingComment] = useState<IScheduledCommentItem | null>(null);

  const [commentType, setCommentType] = useState<CommentType>(CommentType.SLACK)
  const [ticketKey, setTicketKey] = useState("");
  const [commentText, setCommentText] = useState("");
  const [cronSchedule, setCronSchedule] = useState("");
  const [enabled, setEnabled] = useState(true);

  const { data: commentsData, refetch: refetchComments } = trpc.scheduledComments.getAll.useQuery();
  const createMutation = trpc.scheduledComments.create.useMutation({
    onSuccess: () => {
      toast.success("Scheduled comment created");
      refetchComments();
      resetForm();
    },
    onError: (error) => {
      toast.error("Error creating comment: " + error.message);
    },
  });

  const updateMutation = trpc.scheduledComments.update.useMutation({
    onSuccess: () => {
      toast.success("Scheduled comment updated");
      refetchComments();
      resetForm();
    },
    onError: (error) => {
      toast.error("Error updating comment: " + error.message);
    },
  });

  const deleteMutation = trpc.scheduledComments.delete.useMutation({
    onSuccess: () => {
      toast.success("Scheduled comment deleted");
      refetchComments();
    },
    onError: (error) => {
      toast.error("Error deleting comment: " + error.message);
    },
  });

  const comments = commentsData?.comments || [];
  const loading = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  const resetForm = () => {
    setCommentType(CommentType.SLACK)
    setTicketKey("")
    setCommentText("")
    setCronSchedule("")
    setEnabled(true)
    setEditingComment(null)
  }

  const handleNew = () => {
    resetForm();
    setDialogOpen(true);
  };

  const handleEdit = (comment: IScheduledCommentItem) => {
    setEditingComment(comment);
    setCommentType(comment.comment_type);
    setTicketKey(comment.ticket_key ?? "");
    setCommentText(comment.comment_text);
    setCronSchedule(comment.cron_schedule);
    setEnabled(comment.enabled);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    const finalCronSchedule = commentType === "slack" ? "0 0 * * *" : cronSchedule

    if (editingComment) {
      try {
        await updateMutation.mutateAsync({
          id: editingComment.id,
          comment_type: commentType,
          ticket_key: commentType === "jira" ? ticketKey : undefined,
          comment_text: commentText,
          cron_schedule: finalCronSchedule,
          enabled,
        });
        setDialogOpen(false);
      } catch (error) {
        // Error handled by mutation
      }
    } else {
      try {
        await createMutation.mutateAsync({
          comment_type: commentType,
          ticket_key: commentType === "jira" ? ticketKey : undefined,
          comment_text: commentText,
          cron_schedule: finalCronSchedule,
          enabled,
        });
        setDialogOpen(false);
      } catch (error) {
        // Error handled by mutation
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this scheduled comment?")) return;
    try {
      await deleteMutation.mutateAsync({ id });
    } catch (error) {
      // Error handled by mutation
    }
  };

  const formatDate = (dateString?: string | Date | null) => {
    if (!dateString) return "Never";
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getCronDescription = (cron: string) => {
    if (cron === "0 9 * * *") return "Daily at 9:00 AM";
    if (cron === "0 17 * * *") return "Daily at 5:00 PM";
    if (cron === "0 */2 * * *") return "Every 2 hours";
    if (cron === "*/30 * * * *") return "Every 30 minutes";
    if (cron === "0 9 * * 1") return "Every Monday at 9:00 AM";
    return cron;
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Scheduled Comments</CardTitle>
              <CardDescription>
                Automatically post comments to Jira tickets using your user token
              </CardDescription>
            </div>
            <Button onClick={handleNew}>
              <Plus className="mr-2 h-4 w-4" />
              New Schedule
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {comments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No scheduled comments yet. Create one to get started!
            </div>
          ) : (
            <div className="space-y-3">
              {comments.map((comment) => (
                <Card key={comment.id} className="border">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          {comment.comment_type === "slack" ? (
                            <span className="text-xs bg-blue-500/10 text-blue-600 px-2 py-1 rounded font-medium">
                              Slack Thread
                            </span>
                          ) : (
                            <span className="font-mono font-semibold text-sm bg-primary/10 px-2 py-1 rounded">
                              {comment.ticket_key}
                            </span>
                          )}
                          {comment.enabled ? (
                            <span className="text-xs flex items-center gap-1 text-green-600">
                              <CheckCircle2 className="h-3 w-3" />
                              Enabled
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground">Disabled</span>
                          )}
                        </div>
                        <p className="text-sm mb-2 line-clamp-2">{comment.comment_text}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          {comment.comment_type === "jira" && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {getCronDescription(comment.cron_schedule)}
                            </span>
                          )}
                          {comment.comment_type === 'slack' && (
                            <span>Posted after handover messages</span>
                          )}
                          <span>Last posted: {formatDate(comment.last_posted_at)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEdit(comment)}
                          disabled={loading}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDelete(comment.id)}
                          disabled={loading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingComment ? "Edit Scheduled Comment" : "New Scheduled Comment"}
            </DialogTitle>
            <DialogDescription>
              {commentType === "jira"
                ? "Schedule a comment to be posted to a Jira ticket using your user token."
                : "Schedule a comment to be posted as a reply to handover Slack messages using your user token."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="comment_type">Comment Type</Label>
              <Select value={commentType} onValueChange={(value) => setCommentType(value as CommentType)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="slack">Slack Thread (replies to handover messages)</SelectItem>
                  <SelectItem value="jira">Jira Ticket Comment</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {commentType === "jira" && (
              <div className="grid gap-2">
                <Label htmlFor="ticket_key">Ticket Key</Label>
                <Input
                  id="ticket_key"
                  placeholder="e.g., PROJ-123"
                  value={ticketKey}
                  onChange={(e) => setTicketKey(e.target.value.toUpperCase())}
                />
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="comment_text">Comment Text</Label>
              <Textarea
                id="comment_text"
                placeholder="Enter the comment to post..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                rows={4}
              />
            </div>

            {commentType === "jira" && (
              <div className="grid gap-2">
                <Label htmlFor="cron_schedule">Cron Schedule</Label>
                <Input
                  id="cron_schedule"
                  placeholder="e.g., 0 9 * * * (Daily at 9 AM)"
                  value={cronSchedule}
                  onChange={(e) => setCronSchedule(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Examples: <code>0 9 * * *</code> (Daily 9 AM), <code>0 */2 * * *</code> (Every 2
                  hours), <code>*/30 * * * *</code> (Every 30 min)
                </p>
              </div>
            )}

            {commentType === "slack" && (
              <div className="p-3 bg-muted/50 rounded-md border border-border/50">
                <p className="text-sm text-muted-foreground">
                  <strong>Note:</strong> Slack thread comments are automatically posted as replies to handover messages at 5:10 PM and 10:40 PM GMT+7.
                </p>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Switch id="enabled" checked={enabled} onCheckedChange={setEnabled} />
              <Label htmlFor="enabled">Enabled</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={loading || !commentText || (commentType === "jira" && (!ticketKey || !cronSchedule))}
            >
              {loading ? "Saving..." : editingComment ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
