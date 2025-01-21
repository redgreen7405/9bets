/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    runtime: "edge",
  },
};

export default nextConfig;

// Example function to fetch from the `/api/timer` route
export const fetchTimerData = async () => {
  try {
    await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/timer`);
  } catch (error) {
    console.error('Failed to fetch timer data:', error);
  }
};

// Call the function at runtime initialization
fetchTimerData();
