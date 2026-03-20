import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/"],
      },
      {
        // Search engines & AI crawlers — allow for better discoverability
        userAgent: [
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
        ],
        allow: ["/", "/llms.txt"],
        disallow: ["/api/", "/admin/"],
      },
    ],
    sitemap: "https://nourishhealthai.com/sitemap.xml",
  };
}
