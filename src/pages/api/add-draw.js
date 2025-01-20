export const runtime = "edge";

import { firestore } from "../../utils/firebase"; // Adjust path based on your directory structure
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { roomId, selections } = req.body;

    try {
      // Add the data to the Firestore collection
      await addDoc(collection(firestore, "draw"), {
        roomId,
        selections,
      });

      res.status(200).json({ message: "Data stored successfully" });
    } catch (error) {
      console.error("Error storing data:", error);
      res
        .status(500)
        .json({ message: "Failed to store data", error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
