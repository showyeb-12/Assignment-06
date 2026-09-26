import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Oswald } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers/AppProviders";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

const SITE_DESCRIPTION =
  "FitLog is a dark, no-nonsense gym companion: pick a lift, lock it into today's plan, and watch the week's work add up.";

export const metadata: Metadata = {
  metadataBase: new URL("https://fitlog-workout-library.vercel.app"),
  title: {
    default: "FitLog — Workout Library. Train hard, log honest.",
    template: "%s | FitLog",
  },
  description: SITE_DESCRIPTION,
  applicationName: "FitLog",
  keywords: ["workout library", "gym log", "exercise plan", "training", "fitness"],
  openGraph: {
    title: "FitLog — Train with intent. Log every set.",
    description: SITE_DESCRIPTION,
    type: "website",
    siteName: "FitLog",
  },
  twitter: {
    card: "summary_large_image",
    title: "FitLog — Train with intent. Log every set.",
    description: SITE_DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${oswald.variable} ${jetbrains.variable} h-full`}
    >
      <body className="flex min-h-full flex-col bg-ink text-bone antialiased">
        <AppProviders>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:font-semibold focus:text-accent-ink"
          >
            Skip to content
          </a>
          <Navbar />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}
