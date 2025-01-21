import { database } from "../../utils/firebase"; // Adjust path as per your project structure
import { ref, push, set, get } from "firebase/database";

export const runtime = "edge";


const formatPeriod = (date, index) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 01-12
  const day = String(date.getDate()).padStart(2, "0"); // 01-31
  const number = String(index).padStart(5, "0"); // Format the index with leading zeros
  return `${year}${month}${day}${number}`; // Format as YYYYMMDDNNN
};

export default async function handler(req) {
  if (req.method === "GET") {
      const randomNumber = Math.floor(Math.random() * 10); // Random number between 0 and 9

      // Determine the colors based on the random number
      let colors = [];
      if ([1, 3, 7, 9].includes(randomNumber)) {
        colors.push("green");
      } else if ([2, 4, 6, 8].includes(randomNumber)) {
        colors.push("red");
      } else if (randomNumber === 0) {
        colors.push("red", "violet");
      } else if (randomNumber === 5) {
        colors.push("green", "violet");
      }

      // Get the current date and timestamp with proper timezone handling
      const currentDate = new Date();
      const timestamp = Date.now();

      // Format date consistently for both period and date field
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, "0");
      const day = String(currentDate.getDate()).padStart(2, "0");
      const dateString = `${year}-${month}-${day}`; // Today's date (YYYY-MM-DD)

      // Check if current date exists in Firebase
      const dateRef = ref(database, `dates/${dateString}`);
      const dateSnapshot = await get(dateRef);

      // If date doesn't exist, create it with initial values
      if (!dateSnapshot.exists()) {
        await set(dateRef, {
          created: timestamp,
          totalRecords: 0,
          lastUpdate: timestamp,
        });
      }

      // Fetch the current count of records for today from Firebase
      const countRef = ref(database, `recordCount/${dateString}`);
      const countSnapshot = await get(countRef);
      let recordCount = 0;

      if (countSnapshot.exists()) {
        recordCount = countSnapshot.val(); // Get the current count
      }

      // Format the period with the current record count using the same date
      const period = formatPeriod(currentDate, recordCount + 1); // Increment count for period

      // Generate the object with required attributes
      const data = {
        timestamp,
        number: randomNumber,
        bigSmall: randomNumber >= 5 ? "big" : "small", // Determine big or small
        colors, // Array of colors
        date: dateString, // Using the same date format as period
        period, // Custom period formatted as YYYYMMDDNNN
      };

      // Add the new object to Firebase Realtime Database (appending)
      const dbRef = ref(database, "randomData");
      push(dbRef, data)
        .then(async () => {
          // Successfully added data

          // After insertion, increment and update the record count for the day
          const newRecordCount = recordCount + 1;
          await set(countRef, newRecordCount); // Update the count after insertion

          // Update the date info
          await set(ref(database, `dates/${dateString}`), {
            lastUpdate: timestamp,
            totalRecords: newRecordCount,
          });
        })
        .catch((error) => {
          console.error("Error adding data:", error);
        })

    return new Response({
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } else {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }
}
