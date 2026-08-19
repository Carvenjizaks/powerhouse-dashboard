/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["better-sqlite3"],
  },
  // Make sure better-sqlite3 is not bundled (it's a native module)
  // On Vercel it won't be used at all (Neon Postgres is used instead)
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...config.externals, "better-sqlite3"];
    }
    return config;
  },
};

export default nextConfig;
