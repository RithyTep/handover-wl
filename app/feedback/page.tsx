import { Suspense } from "react";
import { FeedbackClient } from "@/components/feedback-client";

export default function FeedbackPage() {
  return (
    <Suspense fallback={null}>
      <FeedbackClient />
    </Suspense>
  );
}

export const metadata = {
  title: "Feedback - Jira Handover",
  description: "Submit anonymous feedback, suggestions, bug reports, or feature requests",
};
