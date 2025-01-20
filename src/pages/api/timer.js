// pages/api/timer.js

const timers = [
  { label: "1min", duration: 60 },
  { label: "3min", duration: 180 },
  { label: "5min", duration: 300 },
  { label: "10min", duration: 600 },
];

export const runtime = "edge";

// Centralized start time stored globally for simplicity (use Redis or a database in production)
let universalStartTime = Date.now();

// Helper to calculate remaining time for a timer based on the universal start time
const getRemainingTime = (index) => {
  const now = Date.now();
  const elapsed = Math.floor((now - universalStartTime) / 1000); // Elapsed seconds
  const remaining = timers[index].duration - (elapsed % timers[index].duration); // Loop logic
  return remaining > 0 ? remaining : 0;
};

// API handler
export default async function handler(req) {
  if (req.method === "GET") {
    // Calculate remaining time for all timers
    const remainingTimes = timers.map((_, index) => ({
      label: timers[index].label,
      remaining: getRemainingTime(index),
    }));

    // Return response with the remaining times as JSON
    return new Response(JSON.stringify({ timers: remainingTimes }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (req.method === "POST" && req.url.includes("reset")) {
    // Reset the universal start time
    universalStartTime = Date.now();

    // Return a response confirming the reset
    return new Response(JSON.stringify({ message: "Timers reset" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ error: "Method not allowed" }), {
    status: 405,
    headers: { "Content-Type": "application/json" },
  });
}
