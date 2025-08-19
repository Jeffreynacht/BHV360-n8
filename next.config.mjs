/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  distDir: 'out',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Remove the experimental.serverActions since it's no longer needed
  experimental: {
    // serverActions: true, // Remove this line
  },
  // Disable API routes for static export
  async rewrites() {
    return []
  },
  // Handle dynamic routes for static export
  async generateStaticParams() {
    return []
  }
}

export default nextConfig
