import type { MetadataRoute } from "next";
import { absUrl } from "@/lib/site";

// 개인화/결제/검색 결과 페이지는 색인에서 제외합니다.
const PRIVATE = ["/api/", "/cart", "/checkout", "/wishlist", "/search"];

// 생성형 AI 검색(GEO)에 노출되도록 주요 AI 크롤러를 명시적으로 허용합니다.
// 학습용 수집까지 막고 싶다면 GPTBot, Google-Extended, Applebot-Extended 등을 이 목록에서 빼고 disallow 하세요.
const AI_BOTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Google-Extended",
  "Applebot-Extended",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVATE },
      { userAgent: AI_BOTS, allow: "/", disallow: PRIVATE },
    ],
    sitemap: absUrl("/sitemap.xml"),
  };
}
