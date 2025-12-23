import type { Metadata, Viewport } from "next";
import { Space_Grotesk } from "next/font/google";
import { Toaster } from "sonner";
import { unstable_cache } from "next/cache";
import { TRPCProvider } from "@/components/trpc-provider";
import { ThemeRepository } from "@/server/repository/theme.repository";
import { DEFAULT_THEME } from "@/lib/constants";
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

const getTheme = unstable_cache(
  async (): Promise<string> => {
    try {
      const themeRepository = new ThemeRepository();
      return await themeRepository.getThemePreference();
    } catch {
      return DEFAULT_THEME;
    }
  },
  ["theme-preference"],
  { revalidate: 60, tags: ["theme"] }
);

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = await getTheme();

  return (
    <html lang="en" className="dark" data-loading-theme={theme} suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://api.openai.com" />
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
