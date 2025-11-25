"use client";

import { useState, useEffect, useCallback } from "react";
import { SchedulerPage } from "@/components/scheduler-page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Lock } from "lucide-react";

const AUTH_KEY = "scheduler_auth";
const AUTH_PASSWORD = "khmer4er";

export default function SecretScheduler() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showDialog, setShowDialog] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const isAuth = sessionStorage.getItem(AUTH_KEY) === "true";
    if (isAuth) {
      setIsAuthenticated(true);
      setShowDialog(false);
    }
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (password === AUTH_PASSWORD) {
      setIsAuthenticated(true);
      setShowDialog(false);
      setError("");
      sessionStorage.setItem(AUTH_KEY, "true");
    } else {
      setError("Incorrect password");
      setPassword("");
    }
  }, [password]);

  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setError("");
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Dialog open={showDialog} onOpenChange={() => {}}>
          <DialogContent
            className="sm:max-w-md"
            onInteractOutside={(e) => e.preventDefault()}
          >
            <DialogHeader>
              <div className="w-14 h-14 sm:w-12 sm:h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center mx-auto mb-4">
                <Lock className="w-7 h-7 sm:w-6 sm:h-6" />
              </div>
              <DialogTitle className="text-center text-lg">Enter Password</DialogTitle>
              <DialogDescription className="text-center text-sm">
                This page is password protected
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="Enter password"
                  className="h-11 sm:h-10 text-base sm:text-sm"
                  autoFocus
                />
                {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
              </div>
              <Button type="submit" className="w-full h-11 sm:h-10">
                Unlock
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <SchedulerPage />
      </div>
    </div>
  );
}
