/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["res.cloudinary.com"],
  },
  eslint: {
    // ✅ ESLint errors ko build ke time ignore karega
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
