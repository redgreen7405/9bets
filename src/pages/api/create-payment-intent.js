// src/pages/api/create-payment-intent.js

import Cors from "micro-cors"; // Ensure micro-cors is installed

const cors = Cors();
export const runtime = "edge";

const handler = async (req, res) => {
  if (req.method === "POST") {
    const { amount } = req.body; // Extract amount from the request body

    try {
      // Since Stripe is removed, we can just simulate the deposit
      // In place of Stripe logic, you can handle the amount by storing it or doing anything else
      // For now, we'll just simulate a success response
      res.status(200).json({
        success: true,
        message: "Amount received successfully.",
        amount,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default cors(handler);
