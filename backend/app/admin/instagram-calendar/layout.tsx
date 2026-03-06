import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Instagram Calendar | NourishAI Admin",
  robots: { index: false, follow: false },
};

export default function InstagramCalendarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
