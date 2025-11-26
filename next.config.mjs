/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  experimental: {
    serverActions: false,
  },
  reactStrictMode: false,
};

export default nextConfig;
