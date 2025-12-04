"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  MessageSquare,
  Bug,
  Lightbulb,
  Star,
  Sparkles,
  Send,
  ArrowLeft,
  Check,
  Loader2,
  List,
  PlusCircle,
  RefreshCw,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { trpc } from "@/components/trpc-provider";
import { FeedbackType } from "@/enums/feedback.enum";

interface FeedbackItem {
  id: number;
  type: FeedbackType;
  title: string;
  description: string;
  created_at: string;
  status: string;
}

interface FeedbackTypeOption {
  id: FeedbackType;
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
}

const feedbackTypes: FeedbackTypeOption[] = [
  {
    id: FeedbackType.BUG,
    label: "Bug Report",
    description: "Report an issue or error",
    icon: Bug,
    color: "text-red-500 bg-red-500/10 border-red-500/20",
  },
  {
    id: FeedbackType.FEEDBACK,
    label: "Feedback",
    description: "General feedback about the app",
    icon: MessageSquare,
    color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
  },
  {
    id: FeedbackType.SUGGESTION,
    label: "Suggestion",
    description: "Suggest an improvement",
    icon: Lightbulb,
    color: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
  },
  {
    id: FeedbackType.FEATURE,
    label: "New Feature",
    description: "Request a new feature",
    icon: Sparkles,
    color: "text-purple-500 bg-purple-500/10 border-purple-500/20",
  },
];

export function FeedbackClient() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"submit" | "view">("submit");
  const [selectedType, setSelectedType] = useState<FeedbackType | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { data: feedbackData, isLoading, refetch: refetchFeedback } = trpc.feedback.getAll.useQuery(
    undefined,
    {
      enabled: activeTab === "view",
    }
  );

  const createFeedbackMutation = trpc.feedback.create.useMutation({
    onSuccess: () => {
      setIsSubmitted(true);
      toast.success("Thank you for your feedback!");
      refetchFeedback();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to submit feedback");
    },
  });

  const feedbackList = feedbackData?.feedback || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedType || !title.trim() || !description.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      await createFeedbackMutation.mutateAsync({
        type: selectedType,
        title: title.trim(),
        description: description.trim(),
      });
    } catch (error) {
      // Error handled by mutation
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSelectedType(null);
    setTitle("");
    setDescription("");
    setIsSubmitted(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTypeConfig = (type: FeedbackType) => {
    return feedbackTypes.find((t) => t.id === type) || feedbackTypes[1];
  };

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <Card className="border-green-500/20 bg-green-500/5">
            <CardContent className="pt-8 pb-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/10 flex items-center justify-center">
                <Check className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">Thank You!</h2>
              <p className="text-muted-foreground mb-6">
                Your feedback has been submitted anonymously. We appreciate your input!
              </p>
              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={handleReset}>
                  Submit Another
                </Button>
                <Button variant="outline" onClick={() => setActiveTab("view")}>
                  <List className="w-4 h-4 mr-2" />
                  View All Feedback
                </Button>
                <Button onClick={() => router.push("/")}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/")}
            className="mb-4 -ml-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Feedback</h1>
          <p className="text-muted-foreground mt-2">
            Share your thoughts anonymously. All feedback is welcome!
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === "submit" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("submit")}
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Submit Feedback
          </Button>
          <Button
            variant={activeTab === "view" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("view")}
          >
            <List className="w-4 h-4 mr-2" />
            View All ({feedbackList.length})
          </Button>
        </div>

        {activeTab === "view" ? (
          /* Feedback List View */
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                {feedbackList.length} feedback submissions
              </p>
                <Button variant="ghost" size="sm" onClick={() => refetchFeedback()} disabled={isLoading}>
                <RefreshCw className={cn("w-4 h-4 mr-2", isLoading && "animate-spin")} />
                Refresh
              </Button>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : feedbackList.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="py-12 text-center">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p className="text-muted-foreground">No feedback yet. Be the first to share!</p>
                  <Button variant="outline" size="sm" className="mt-4" onClick={() => setActiveTab("submit")}>
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Submit Feedback
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {feedbackList.map((item) => {
                  const typeConfig = getTypeConfig(item.type);
                  const Icon = typeConfig.icon;
                  return (
                    <Card key={item.id}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <div className={cn("p-2 rounded-lg shrink-0", typeConfig.color.split(" ").slice(1).join(" "))}>
                              <Icon className={cn("w-4 h-4", typeConfig.color.split(" ")[0])} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <CardTitle className="text-base truncate">{item.title}</CardTitle>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className={cn("text-xs", typeConfig.color)}>
                                  {typeConfig.label}
                                </Badge>
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {formatDate(item.created_at)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{item.description}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* Submit Form */
          <form onSubmit={handleSubmit}>
            {/* Feedback Type Selection */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">What type of feedback?</CardTitle>
                <CardDescription>Select the category that best fits your feedback</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {feedbackTypes.map((type) => {
                    const Icon = type.icon;
                    const isSelected = selectedType === type.id;
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setSelectedType(type.id)}
                        className={cn(
                          "flex flex-col items-start p-4 rounded-lg border-2 transition-all text-left",
                          isSelected
                            ? type.color
                            : "border-border hover:border-muted-foreground/30 hover:bg-muted/50"
                        )}
                      >
                        <Icon className={cn("w-5 h-5 mb-2", isSelected ? "" : "text-muted-foreground")} />
                        <span className="font-medium text-sm">{type.label}</span>
                        <span className="text-xs text-muted-foreground mt-0.5">
                          {type.description}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Feedback Details */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Details</CardTitle>
                <CardDescription>
                  Provide as much detail as possible to help us understand your feedback
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">
                    Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    placeholder="Brief summary of your feedback"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={200}
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    {title.length}/200
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">
                    Description <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    placeholder={
                      selectedType === "bug"
                        ? "Please describe the issue, steps to reproduce, and expected behavior..."
                        : selectedType === "feature"
                        ? "Describe the feature you'd like to see and how it would help..."
                        : "Share your thoughts, ideas, or suggestions..."
                    }
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={6}
                    maxLength={2000}
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    {description.length}/2000
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Anonymous Notice */}
            <Card className="mb-6 border-muted bg-muted/30">
              <CardContent className="py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Star className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Anonymous Submission</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Your feedback is completely anonymous. No personal information is collected or stored.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={!selectedType || !title.trim() || !description.trim() || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Feedback
                </>
              )}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
