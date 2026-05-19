import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    // Allow MiniPay to embed this app in its WebView.
    // Tighten frame-ancestors to known MiniPay domains before mainnet launch.
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // required by Next.js
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "media-src 'self' blob: https:",
      "connect-src 'self' https://forno.celo.org wss://forno.celo.org https://*.celo.org",
      "frame-ancestors 'self' https://*.minipay.app https://*.opera.com",
      "font-src 'self' https://fonts.gstatic.com",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  // Prevent Next.js from bundling native modules — they must stay server-side
  serverExternalPackages: ['better-sqlite3'],
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
