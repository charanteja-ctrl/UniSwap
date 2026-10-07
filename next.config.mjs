/** @type {import('next').NextConfig} */
const nextConfig = {
  // If deployed on Vercel as frontend with a separate Render backend,
  // proxy all /api/* requests to the Render backend URL seamlessly without CORS issues.
  async rewrites() {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL;
    if (!backendUrl) return [];

    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl.replace(/\/$/, "")}/api/:path*`,
      },
    ];
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
