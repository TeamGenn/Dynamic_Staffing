/** @type {import('next').NextConfig} */
const nextConfig = {
  // Note: ignoreBuildErrors should be false in production
  // Set to true only for development if needed
  typescript: {
    ignoreBuildErrors: false, // Changed to false for production readiness
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
