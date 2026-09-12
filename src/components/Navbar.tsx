"use client";

import React from "react";
import { useTheme } from "next-themes";
import {
  ShieldCheck,
  Activity,
  Sun,
  Moon,
  LayoutDashboard,
  BookOpen,
  PlusCircle,
  DollarSign,
  RotateCcw,
  Sparkles
} from "lucide-react";

interface NavbarProps {
  activeTab: "board" | "rulebook" | "intake" | "subscriptions";
  setActiveTab: (tab: "board" | "rulebook" | "intake" | "subscriptions") => void;
  onResetCases: () => void;
  caseCount: { ready: number; verify: number; exception: number };
}

export function Navbar({
  activeTab,
  setActiveTab,
  onResetCases,
  caseCount
}: NavbarProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--color-border)] bg-[var(--color-panel)]/90 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo & Platform Info */}
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-stripe-purple)] text-white shadow-sm">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-lg tracking-tight text-[var(--color-text-primary)]">
                  Cozad Medical Ops
                </span>
                <span className="inline-flex items-center rounded-full bg-[var(--color-ready-bg)] px-2 py-0.5 text-xs font-medium text-[var(--color-ready)] border border-[var(--color-ready-border)]">
                  <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-[var(--color-ready)] animate-pulse" />
                  AI-First Prior Auth
                </span>
              </div>
              <p className="text-xs text-[var(--color-text-muted)] hidden sm:block">
                Automated Clinical Intake • Payer Rule Checks • Triaged Queues
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => setActiveTab("board")}
              className={`inline-flex items-center px-3.5 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === "board"
                  ? "bg-[var(--color-stripe-purple)]/10 text-[var(--color-stripe-purple)] font-semibold"
                  : "text-[var(--color-text-secondary)] hover:bg-[var(--color-panel-hover)]"
              }`}
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Triage Board
              <span className="ml-2 inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-xs text-[var(--color-text-muted)] font-mono">
                {caseCount.ready + caseCount.verify + caseCount.exception}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("intake")}
              className={`inline-flex items-center px-3.5 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === "intake"
                  ? "bg-[var(--color-stripe-purple)]/10 text-[var(--color-stripe-purple)] font-semibold"
                  : "text-[var(--color-text-secondary)] hover:bg-[var(--color-panel-hover)]"
              }`}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              New Intake
            </button>

            <button
              onClick={() => setActiveTab("rulebook")}
              className={`inline-flex items-center px-3.5 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === "rulebook"
                  ? "bg-[var(--color-stripe-purple)]/10 text-[var(--color-stripe-purple)] font-semibold"
                  : "text-[var(--color-text-secondary)] hover:bg-[var(--color-panel-hover)]"
              }`}
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Payer Rulebook
            </button>

            <button
              onClick={() => setActiveTab("subscriptions")}
              className={`inline-flex items-center px-3.5 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === "subscriptions"
                  ? "bg-[var(--color-stripe-purple)]/10 text-[var(--color-stripe-purple)] font-semibold"
                  : "text-[var(--color-text-secondary)] hover:bg-[var(--color-panel-hover)]"
              }`}
            >
              <DollarSign className="mr-2 h-4 w-4" />
              SaaS Stack & Costs
            </button>
          </nav>

          {/* Right Action Controls: Reset, Theme Toggle */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onResetCases}
              title="Reset to 3 standard synthetic test cases"
              className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-panel-hover)] rounded-md border border-[var(--color-border)] transition-colors"
            >
              <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
              Reset Demo
            </button>

            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="rounded-md p-2 text-[var(--color-text-muted)] hover:bg-[var(--color-panel-hover)] hover:text-[var(--color-text-primary)] transition-colors border border-[var(--color-border)]"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4 text-amber-400" />
                ) : (
                  <Moon className="h-4 w-4 text-slate-600" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Tab Row */}
        <div className="flex md:hidden border-t border-[var(--color-border)] py-2 space-x-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab("board")}
            className={`px-3 py-1 text-xs font-medium rounded ${
              activeTab === "board" ? "bg-[var(--color-stripe-purple)] text-white" : "text-[var(--color-text-muted)]"
            }`}
          >
            Board
          </button>
          <button
            onClick={() => setActiveTab("intake")}
            className={`px-3 py-1 text-xs font-medium rounded ${
              activeTab === "intake" ? "bg-[var(--color-stripe-purple)] text-white" : "text-[var(--color-text-muted)]"
            }`}
          >
            Intake
          </button>
          <button
            onClick={() => setActiveTab("rulebook")}
            className={`px-3 py-1 text-xs font-medium rounded ${
              activeTab === "rulebook" ? "bg-[var(--color-stripe-purple)] text-white" : "text-[var(--color-text-muted)]"
            }`}
          >
            Rulebook
          </button>
          <button
            onClick={() => setActiveTab("subscriptions")}
            className={`px-3 py-1 text-xs font-medium rounded ${
              activeTab === "subscriptions" ? "bg-[var(--color-stripe-purple)] text-white" : "text-[var(--color-text-muted)]"
            }`}
          >
            SaaS Stack
          </button>
        </div>
      </div>
    </header>
  );
}
