import type { NextConfig } from 'next';
import { PHASE_DEVELOPMENT_SERVER } from 'next/constants';
export default function nextConfig(phase: string): NextConfig {
  return {
    poweredByHeader: false,
    devIndicators: false,
    // Keep local development independent of production builds and their manifests.
    distDir: phase === PHASE_DEVELOPMENT_SERVER ? '.next-dev' : '.next',
  };
}
