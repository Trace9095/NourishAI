import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Science-backed nutrition advice, AI technology deep dives, and practical tips to make macro tracking effortless.",
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
