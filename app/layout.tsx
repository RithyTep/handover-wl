import type { Metadata, Viewport } from "next";
import { Space_Grotesk } from "next/font/google";
import { Toaster } from "sonner";
import { TRPCProvider } from "@/components/trpc-provider";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "Jira Handover Dashboard",
  description: "Manage and track Jira ticket handovers",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#111111",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        {/* Resource hints for external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://api.openai.com" />
        {/* Preload background image to prevent flash on load */}
        <link
          rel="preload"
          href="/assets/angkor-pixel/background.png"
          as="image"
          type="image/png"
          fetchPriority="high"
        />
      </head>
      <body className={spaceGrotesk.className}>
        <TRPCProvider>
          {children}
          <Toaster position="top-right" duration={3000} />
        </TRPCProvider>
      </body>
    </html>
  );
}
