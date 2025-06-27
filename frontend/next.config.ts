import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	eslint: {
		ignoreDuringBuilds: true, // Skip ESLint during builds for deployment
	},
};

export default nextConfig;
