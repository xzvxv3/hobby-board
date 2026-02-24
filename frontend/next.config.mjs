/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,

  async rewrites() {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8080'

    return {
      beforeFiles: [],
      afterFiles: [],
      // fallback: 동적 라우트(NextAuth 등)를 모두 확인한 후 매칭되지 않을 때만 프록시
      fallback: [
        {
          source: '/api/:path*',
          destination: `${backendUrl}/api/:path*`,
        },
      ],
    }
  },
}

export default nextConfig