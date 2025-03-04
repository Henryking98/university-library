import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: "*",
            }
            // {
            //     protocol: 'https',
            //     hostname: "img.freepik.com",
            // }
            // {
            //     protocol: 'https',
            //     hostname: "cdn.pixabay.com",
            // }
            // {
            //     protocol: 'https',
            //     hostname: "cdn.appwrite.io",
            // }
        ]
    },
    devIndicators: {
        appIsrStatus: true,
        buildActivity: true,
        buildActivityPosition: 'bottom-right'
    }
    
};

export default nextConfig;
