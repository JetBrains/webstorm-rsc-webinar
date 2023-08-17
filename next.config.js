/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['cards.scryfall.io']
  },
  experimental: {
    serverActions: true,
    serverComponentsExternalPackages: ['better-sqlite3']
  }
};

module.exports = nextConfig;
