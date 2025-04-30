/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    // Only set up rewrites if we're using the external API
    if (process.env.NEXT_PUBLIC_API_URL && process.env.NEXT_PUBLIC_USE_MOCK_API !== 'true') {
      return [
        {
          source: '/api/:path*',
          destination: process.env.NEXT_PUBLIC_API_URL + '/api/:path*',
        },
      ]
    }

    // Return empty array when using mock API
    return []
  },
}

module.exports = nextConfig
