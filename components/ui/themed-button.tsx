"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import type { Theme } from "@/lib/types"
import { Button, ButtonProps } from "./button"

interface ThemedButtonProps extends ButtonProps {
  theme: Theme
  themeVariant?: "primary" | "secondary"
}

export const ThemedButton = React.forwardRef<HTMLButtonElement, ThemedButtonProps>(
  ({ className, theme, themeVariant = "primary", children, ...props }, ref) => {
    const getThemeClasses = () => {
      const isPrimary = themeVariant === "primary"

      switch (theme) {
        case "christmas":
          return isPrimary ? "christmas-btn" : "christmas-btn-secondary"
        case "pixel":
          return isPrimary ? "pixel-btn-primary" : "pixel-btn-secondary"
        case "lunar":
          return isPrimary ? "lunar-btn" : "lunar-btn-secondary"
        case "coding":
          return isPrimary ? "coding-btn" : "coding-btn-secondary"
        default:
          return "default-btn"
      }
    }

    return (
      <Button
        ref={ref}
        className={cn(getThemeClasses(), className)}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

ThemedButton.displayName = "ThemedButton";
