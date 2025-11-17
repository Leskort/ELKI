/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    // Отключаем строгую проверку ESLint во время сборки (можно исправить позже)
    ignoreDuringBuilds: false,
  },
  typescript: {
    // Отключаем проверку типов во время сборки (можно исправить позже)
    ignoreBuildErrors: false,
  },
}

module.exports = nextConfig

