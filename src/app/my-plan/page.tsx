import type { Metadata } from "next";
import { MyPlanView } from "@/components/plan/MyPlanView";

export const metadata: Metadata = {
  title: "My Plan",
  description:
    "Today's FitLog session: five lifts max, live minutes and calorie totals, plus the lifts you saved for later.",
  alternates: { canonical: "/my-plan" },
};

export default function MyPlanPage() {
  return (
    <div className="border-b border-line/0">
      <MyPlanView />
    </div>
  );
}
