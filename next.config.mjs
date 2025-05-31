// next.config.mjs (if you are using ES Modules)
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your existing rewrites configuration
  eslint: {
    ignoreDuringBuilds: true,
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*",

        destination:
          process.env.NODE_ENV === "development"
            ? "http://localhost:5000/api/:path*" // For local dev
            : "https://your-deployed-backend-url.com/api/:path*", // CHANGE THIS for production
      },
    ];
  },

  // Add the images configuration here
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ibb.co",
        port: "",
        pathname: "/**", // Allows any path under this hostname
      },
      // If you have other image hostnames, add them here as separate objects
    ],
  },

  // Add any other existing configurations you might have
  // reactStrictMode: true, // for example
};

export default nextConfig;
