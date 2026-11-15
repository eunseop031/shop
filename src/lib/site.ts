// 배포 후 NEXT_PUBLIC_SITE_URL(예: https://noir-co.vercel.app)을 설정하세요.
// Vercel에서는 VERCEL_PROJECT_PRODUCTION_URL을 자동으로 사용합니다.
const raw =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const SITE_URL = raw.replace(/\/+$/, "");

export const absUrl = (path = "/") => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

/** 사이트 공통 기본 공유 이미지 (Unsplash 무료 이미지) */
export const DEFAULT_OG_IMAGE =
  "https://images.unsplash.com/photo-1778671394516-8270eac13c42?w=1200&h=630&fit=crop&auto=format&q=80";
