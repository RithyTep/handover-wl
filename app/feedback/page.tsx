import { Suspense } from "react";
import { MessageSquare } from "lucide-react";
import { FeedbackClient } from "@/components/feedback-client";

function FeedbackLoading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <MessageSquare className="h-8 w-8 animate-pulse mx-auto mb-4 text-primary" />
        <p className="text-muted-foreground">Loading feedback form...</p>
      </div>
    </div>
  );
}

export default function FeedbackPage() {
  return (
    <Suspense fallback={<FeedbackLoading />}>
      <FeedbackClient />
    </Suspense>
  );
}

export const metadata = {
  title: "Feedback - Jira Handover",
  description: "Submit anonymous feedback, suggestions, bug reports, or feature requests",
};
