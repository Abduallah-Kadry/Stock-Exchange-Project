import type {NextConfig} from "next";

const nextConfig: NextConfig = {
	reactCompiler: true,
	output: 'standalone', // This is crucial for Docker

};

export default nextConfig;
