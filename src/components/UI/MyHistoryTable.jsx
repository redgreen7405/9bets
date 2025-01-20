import { useState, useEffect } from "react";
import {
  MagnifyingGlassIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "@heroicons/react/20/solid";
import { getDocs, collection, query, where } from "firebase/firestore";
import { firestore } from "../../utils/firebase"; // Adjust this import based on your project structure
import toast from "react-hot-toast";

const MyHistoryTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]);
  const [tableHeaders] = useState([
    { label: "Draw Number", key: "drawNumber" },
    { label: "Result", key: "result" },
    { label: "Selected", key: "selected" },
    { label: "Period", key: "period" },
  ]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const userId = localStorage.getItem("user")?.slice(1, -1);
      const usersRef = collection(firestore, "users");
      const q = query(usersRef, where("id", "==", userId)); // Adjust this with the actual user ID logic
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error("User not found");
      }

      const userDoc = querySnapshot.docs[0];
      const historyRef = collection(userDoc.ref, "myHistory");
      const historySnapshot = await getDocs(historyRef);

      const fetchedData = historySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      setData(fetchedData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Something went wrong while fetching data.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 text-center">
      {/* Search Input */}
      <div className="mb-4 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search by Draw Number, Result, or Selected"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="w-full text-sm text-center">
          {/* Table Header */}
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              {tableHeaders.map((header) => (
                <th key={header.label} className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center">
                    {header.label}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={tableHeaders.length}
                  className="px-4 py-3 text-center text-gray-500"
                >
                  No data found
                </td>
              </tr>
            ) : (
              data.map((dataItem) => (
                <tr
                  key={dataItem.id}
                  className="border-b hover:bg-gray-100 transition duration-200"
                >
                  <td className="px-4 py-3 text-center">
                    {dataItem.drawNumber}
                  </td>
                  <td className="px-4 py-3 text-center">{dataItem.result}</td>
                  <td className="px-4 py-3 text-center">{dataItem.selected}</td>
                  <td className="px-4 py-3 text-center">{dataItem.period}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyHistoryTable;
