import type { MetadataRoute } from "next";

const ALLOWED_BOTS = [
  "Googlebot",
  "Bingbot",
  "Applebot",
  "Applebot-Extended",
  "Google-Extended",
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "anthropic-ai",
  "Claude-Web",
  "ClaudeBot",
  "CCBot",
  "FacebookBot",
  "Meta-ExternalAgent",
  "Amazonbot",
  "cohere-ai",
  "PerplexityBot",
  "YouBot",
  "Bytespider",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      ...ALLOWED_BOTS.map((bot) => ({
        userAgent: bot,
        allow: "/",
        disallow: "/api/",
      })),
      {
        userAgent: "*",
        disallow: "/",
      },
    ],
    sitemap: "https://nourishhealthai.com/sitemap.xml",
  };
}
