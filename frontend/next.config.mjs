/** @type {import('next').NextConfig} */
const nextConfig = {
  // ❌ REMOVE OR COMMENT OUT THIS LINE IF IT EXISTS:
  // output: 'export', 
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig; // (or export default nextConfig)