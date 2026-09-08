/** @type {import('next').NextConfig} */
const nextConfig = {
  // GitHub Pages is a static file host: no Node server, no image optimizer,
  // no middleware. Everything is prerendered into `out/` at build time.
  output: "export",
  trailingSlash: true,
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    unoptimized: true
  }
};

export default nextConfig;
