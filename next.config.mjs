/** @type {import('next').NextConfig} */
const nextConfig = {
  // When NEXT_PUBLIC_BACKEND_URL is set (e.g. Vercel frontend talking to Render backend),
  // use 'beforeFiles' rewrites so Next.js proxies all /api/* requests to the Render backend
  // BEFORE checking local route handlers. This eliminates missing-secret errors on the frontend host!
  async rewrites() {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL;
    if (!backendUrl) return [];

    return {
      beforeFiles: [
        {
          source: "/api/:path*",
          destination: `${backendUrl.replace(/\/$/, "")}/api/:path*`,
        },
      ],
    };
  },

  // Enable CORS headers for direct API calls to the Render backend
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
