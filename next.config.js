/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["i.discogs.com", "i.scdn.co", "st.discogs.com"],
  },
  // async rewrites() {
  //   return [
  //     {
  //       source: "/api/:path*",
  //       destination: "https://api.example.com/:path*",
  //     },
  //   ];
  // },
};

module.exports = nextConfig;
