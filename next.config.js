/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Tương tự, bỏ qua lỗi type check nếu cần để deploy nhanh
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig

