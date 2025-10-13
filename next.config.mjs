/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // ✅ ESLint errors ko build ke time ignore karega
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;