// src/pages/api/payment-intent-status.js

export const runtime = "edge";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { paymentIntentId } = req.query;

    // Simulating a response, since we are removing Stripe
    try {
      // Here you can replace this mock logic with your actual backend functionality
      const paymentIntentMock = {
        id: paymentIntentId,
        amount_received: 1000, // Mock amount
        currency: "usd", // Mock currency
        status: "succeeded", // Mock status
        created: new Date().toISOString(), // Mock date
      };

      res.status(200).json(paymentIntentMock); // Send the mock response
    } catch (error) {
      console.error("Error retrieving payment intent:", error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
