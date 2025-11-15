/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // ← THIS IS THE FIX
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
