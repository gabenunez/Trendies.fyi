/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return [
      {
        source: "/api/screenshot",
        destination: process.env.SCREENSHOT_SERVER_URL,
      },
    ];
  },
};

module.exports = nextConfig;
