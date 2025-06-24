import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { TanstackProvider } from "@/components/providers/tanstack-provider";

export const metadata: Metadata = {
  title: "OptiRide Application",
  description: "Make rides a pleasure and fun.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`text-lg antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster className="first-letter:uppercase" position="top-center" />
          <TanstackProvider>
          {children}
          </TanstackProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
