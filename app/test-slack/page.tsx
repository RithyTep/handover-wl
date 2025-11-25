"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function TestSlackPage() {
  const [message, setMessage] = useState("Test reply from bot");
  const [threadTs, setThreadTs] = useState("");
  const [result, setResult] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const postMessage = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/slack-thread", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          thread_ts: threadTs || undefined,
        }),
      });
      const data = await res.json();
      setResult(data);
    } catch (error: any) {
      setResult({ error: error.message });
    }
    setLoading(false);
  };

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/slack-thread");
      const data = await res.json();
      if (data.success) {
        setMessages(data.messages);
      } else {
        setResult(data);
      }
    } catch (error: any) {
      setResult({ error: error.message });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Slack Thread Test</h1>

        {/* Setup Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Setup Required</CardTitle>
            <CardDescription>Add these to your .env.local</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <code className="block bg-muted p-2 rounded">SLACK_BOT_TOKEN=xoxb-your-token</code>
            <code className="block bg-muted p-2 rounded">SLACK_CHANNEL=C0123456789</code>
            <div className="mt-4 space-y-1 text-muted-foreground">
              <p>1. Go to <a href="https://api.slack.com/apps" className="text-primary underline" target="_blank">api.slack.com/apps</a></p>
              <p>2. Create app → From scratch</p>
              <p>3. OAuth & Permissions → Add scopes: <code>chat:write</code>, <code>channels:history</code></p>
              <p>4. Install to Workspace → Copy Bot Token</p>
              <p>5. Invite bot to channel: <code>/invite @YourBot</code></p>
              <p>6. Get Channel ID: Right-click channel → View details</p>
            </div>
          </CardContent>
        </Card>

        {/* Post Message */}
        <Card>
          <CardHeader>
            <CardTitle>Post Message</CardTitle>
            <CardDescription>Send a message or reply to a thread</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Message</label>
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter message..."
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Thread TS (optional - leave empty for new message)</label>
              <Input
                value={threadTs}
                onChange={(e) => setThreadTs(e.target.value)}
                placeholder="e.g., 1234567890.123456"
              />
            </div>
            <Button onClick={postMessage} disabled={loading}>
              {loading ? "Posting..." : threadTs ? "Reply in Thread" : "Post New Message"}
            </Button>
          </CardContent>
        </Card>

        {/* Fetch Recent Messages */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Messages</CardTitle>
            <CardDescription>Get message timestamps to reply to</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={fetchMessages} disabled={loading} variant="outline">
              {loading ? "Loading..." : "Fetch Messages"}
            </Button>
            {messages.length > 0 && (
              <div className="space-y-2">
                {messages.map((msg, i) => (
                  <div key={i} className="p-3 bg-muted rounded text-sm">
                    <div className="flex justify-between items-start gap-2">
                      <span className="flex-1 truncate">{msg.text}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setThreadTs(msg.ts)}
                        className="text-xs"
                      >
                        Use TS
                      </Button>
                    </div>
                    <code className="text-xs text-muted-foreground">{msg.ts}</code>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Result */}
        {result && (
          <Card>
            <CardHeader>
              <CardTitle>Result</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-3 rounded text-xs overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
