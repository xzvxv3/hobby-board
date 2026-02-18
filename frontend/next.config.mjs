/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,

  async rewrites() {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8080'

    return [
      {
        // 프론트에서 /api/... 로 요청하면
        source: '/api/:path*',
        // 백엔드(8080)로 프록시
        destination: `${backendUrl}/api/:path*`,
      },
    ]
  },
}

export default nextConfig