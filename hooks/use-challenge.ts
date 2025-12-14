"use client";

/**
 * React hook for managing browser challenge state
 */

import { useState, useEffect, useCallback } from "react";
import {
  initChallengeSession,
  clearChallengeSession,
  getSessionTimeRemaining,
} from "@/lib/security/client/challenge-manager";

interface UseChallengeReturn {
  /** Whether challenge session is initialized */
  isInitialized: boolean;
  /** Whether initialization is in progress */
  isLoading: boolean;
  /** Any error during initialization */
  error: Error | null;
  /** Time remaining on session (ms) */
  timeRemaining: number;
  /** Manually reinitialize session */
  refresh: () => Promise<void>;
  /** Clear session */
  clear: () => void;
}

export function useChallenge(): UseChallengeReturn {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);

  // Initialize challenge session on mount
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        setIsLoading(true);
        setError(null);
        await initChallengeSession();
        if (mounted) {
          setIsInitialized(true);
          setTimeRemaining(getSessionTimeRemaining());
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error("Failed to initialize challenge"));
          setIsInitialized(false);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    init();

    return () => {
      mounted = false;
    };
  }, []);

  // Update time remaining periodically
  useEffect(() => {
    if (!isInitialized) return;

    const interval = setInterval(() => {
      const remaining = getSessionTimeRemaining();
      setTimeRemaining(remaining);

      // Auto-refresh when expired
      if (remaining <= 0) {
        setIsInitialized(false);
        initChallengeSession()
          .then(() => {
            setIsInitialized(true);
            setTimeRemaining(getSessionTimeRemaining());
          })
          .catch((err) => {
            setError(err instanceof Error ? err : new Error("Session refresh failed"));
          });
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [isInitialized]);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    clearChallengeSession();

    try {
      await initChallengeSession();
      setIsInitialized(true);
      setTimeRemaining(getSessionTimeRemaining());
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to refresh challenge"));
      setIsInitialized(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    clearChallengeSession();
    setIsInitialized(false);
    setTimeRemaining(0);
  }, []);

  return {
    isInitialized,
    isLoading,
    error,
    timeRemaining,
    refresh,
    clear,
  };
}
