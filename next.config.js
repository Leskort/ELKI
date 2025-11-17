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
    // Игнорируем предупреждения во время сборки, но ошибки все равно будут блокировать
    ignoreDuringBuilds: false,
  },
  typescript: {
    // Отключаем проверку типов во время сборки (можно исправить позже)
    ignoreBuildErrors: false,
  },
}

module.exports = nextConfig

