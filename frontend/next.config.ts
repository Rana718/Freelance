import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: true,
    compiler: {
        removeConsole: process.env.NODE_ENV === "production",
    },
    images: {
        domains: [
            "logo.com",
            "upload.wikimedia.org",
            "utfs.io",
            "nb8e1wq3ic.ufs.sh",
            "utfs.sh",
        ],
    },
};

export default nextConfig;
