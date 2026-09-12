import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "Cozad Medical Ops — AI Prior Authorization Workflow",
  description: "AI-first prior authorization workflow automation with deterministic payer criteria checking and zero-drag routing into READY, VERIFY, and EXCEPTION states.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          {children}
        </ThemeProvider>
        {/* Central Demo Traffic Tracker */}
        <img
          src="https://demo-traffic.vercel.app/api/px?p=cozad-priorauth"
          alt=""
          width={1}
          height={1}
          style={{ position: "absolute", width: 1, height: 1, opacity: 0 }}
        />
      </body>
    </html>
  );
}
