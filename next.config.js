/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["img.cgv.co.kr", "image.tmdb.org"],
    disableStaticImages: true,
  },
};

module.exports = nextConfig;
