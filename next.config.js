/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  images: {
    domains: ["infura-ipfs.io", "daulat-nft-marketplace.infura-ipfs.io"],
  },
};

module.exports = nextConfig;
