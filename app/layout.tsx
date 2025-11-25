import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "Jira Handover Dashboard",
  description: "Manage and track Jira ticket handovers",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Force dark mode for Christmas theme */}
      </head>
      <body className={spaceGrotesk.className}>
        {children}
        <Toaster position="top-right" duration={3000} />
      </body>
    </html>
  );
}
