import type { NextConfig } from "next";

// `next dev` runs a full Node server (writer tool's API routes need that);
// only the production build (`next build`, NODE_ENV=production) is a static
// export for GitHub Pages. output: "export" disables API routes outright,
// even in dev, so it must not be active while developing.
const isStaticExport = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  ...(isStaticExport
    ? {
        output: "export" as const,
        images: { unoptimized: true },
      }
    : {}),
};

export default nextConfig;
