/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Empêche webpack de bundler le binaire natif de Chromium.
      // @sparticuz/chromium le résout lui-même à l'exécution selon l'environnement.
      config.externals = [
        ...(config.externals ?? []),
        { canvas: 'canvas' },
      ]
    }
    return config
  },
}

export default nextConfig;
