// src/pages/api/payment-intent-status.js

export const runtime = "edge";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { paymentIntentId } = req.query;

    // Simulate a response for the payment intent request
    try {
      // Replace this mock data with your actual logic
      const paymentIntentMock = {
        id: paymentIntentId,
        amount_received: 1000, // Mock amount received
        currency: "usd", // Mock currency
        status: "succeeded", // Mock status
        created: new Date().toISOString(), // Mock date of creation
      };

      // Send the mock response
      res.status(200).json(paymentIntentMock);
    } catch (error) {
      console.error("Error retrieving payment intent:", error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
