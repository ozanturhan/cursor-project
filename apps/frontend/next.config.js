/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  poweredByHeader: false,
  eslint: {
    ignoreDuringBuilds: true, // We'll handle linting separately
  },
}

module.exports = nextConfig 