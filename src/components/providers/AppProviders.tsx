"use client";

import { PlanProvider } from "./PlanProvider";
import { ToastProvider } from "./ToastProvider";

/** Client boundary for everything that lives above the router tree. */
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <PlanProvider>{children}</PlanProvider>
    </ToastProvider>
  );
}
