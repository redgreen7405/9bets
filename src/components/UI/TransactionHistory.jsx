import React, { useState, useEffect, useMemo } from "react";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { database, firestore } from "../../utils/firebase";
import { collection, query, orderBy, where, getDocs } from "firebase/firestore";
import { toast } from "react-hot-toast";

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filtering and Search States
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All Time");
  const [isTypeFilterOpen, setIsTypeFilterOpen] = useState(false);
  const [isDateFilterOpen, setIsDateFilterOpen] = useState(false);

  // Fetch transactions
  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const userId = localStorage.getItem("user")?.slice(1, -1);
      if (!userId) throw new Error("User ID not found.");

      const usersRef = collection(firestore, "users");
      const userSnapshot = await getDocs(
        query(usersRef, where("id", "==", userId))
      );

      if (!userSnapshot.empty) {
        const userDoc = userSnapshot.docs[0];
        const transactionsRef = collection(
          firestore,
          `users/${userDoc.id}/transactions`
        );

        const transactionsSnapshot = await getDocs(transactionsRef);

        const transactionsList = transactionsSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            amount: data.amount,
            type: data.type,
            timestamp: data.timestamp,
            formattedAmount: new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
            }).format(data.amount),
          };
        });

        setTransactions(transactionsList);
      } else {
        throw new Error("User not found.");
      }
    } catch (error) {
      console.error("Error fetching transactions: ", error);
      toast.error("Could not fetch transactions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch transactions when component mounts
  useEffect(() => {
    fetchTransactions();
  }, []);

  // Filtered and Searched Transactions
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter(
        (transaction) =>
          (typeFilter === "All" || transaction.type === typeFilter) &&
          (searchTerm === "" ||
            transaction.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.formattedAmount
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) &&
          (dateFilter === "All Time" ||
            (dateFilter === "Last 7 Days" &&
              new Date(transaction.timestamp) >=
                new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ||
            (dateFilter === "Last 30 Days" &&
              new Date(transaction.timestamp) >=
                new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)))
      )
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [transactions, typeFilter, searchTerm, dateFilter]);

  return (
    <div className="bg-white rounded-xl p-3 lg:p-6 space-y-8 transition-all duration-300">
      <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <h3 className="text-xl font-semibold text-gray-800">
          Transaction History
        </h3>

        {/* Search Bar */}
        <div className="relative w-full md:w-1/2 lg:w-1/3">
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all duration-300"
          />
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* Filters Section */}
      <div className="flex flex-wrap gap-3 justify-between items-center">
        {/* Type Filter Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setIsTypeFilterOpen(!isTypeFilterOpen);
              setIsDateFilterOpen(false);
            }}
            className="flex items-center px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-all duration-300"
          >
            {typeFilter} Transactions
            <ChevronDownIcon className="ml-2 h-5 w-5" />
          </button>
          {isTypeFilterOpen && (
            <div className="absolute z-10 mt-2 w-48 bg-white border border-gray-100 rounded-lg shadow-lg">
              {["All", "Deposit", "Withdrawal"].map((type) => (
                <div
                  key={type}
                  onClick={() => {
                    setTypeFilter(type);
                    setIsTypeFilterOpen(false);
                  }}
                  className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
                >
                  {type}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Date Filter Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setIsDateFilterOpen(!isDateFilterOpen);
              setIsTypeFilterOpen(false);
            }}
            className="flex items-center px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-all duration-300"
          >
            {dateFilter}
            <ChevronDownIcon className="ml-2 h-5 w-5" />
          </button>
          {isDateFilterOpen && (
            <div className="absolute z-10 mt-2 w-48 bg-white border border-gray-100 rounded-lg shadow-lg">
              {["All Time", "Last 7 Days", "Last 30 Days"].map((period) => (
                <div
                  key={period}
                  onClick={() => {
                    setDateFilter(period);
                    setIsDateFilterOpen(false);
                  }}
                  className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
                >
                  {period}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Transaction List */}
      {loading ? (
        <div className="text-center text-gray-500 animate-pulse">
          Loading transactions...
        </div>
      ) : filteredTransactions.length > 0 ? (
        <div className="space-y-2 max-h-80 overflow-y-auto scroll-smooth">
          {filteredTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className={`flex flex-col md:flex-row justify-between p-3 rounded-lg transition-all duration-300 ${
                transaction.type === "Deposit"
                  ? "bg-green-100 hover:bg-green-200"
                  : "bg-red-100 hover:bg-red-200"
              }`}
            >
              <div className="flex flex-col">
                <p className="font-medium text-gray-800">{transaction.type}</p>
                <p className="text-sm text-gray-600">
                  {new Date(transaction.timestamp).toLocaleString("en-IN", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                  })}
                </p>
              </div>
              <span
                className={`font-bold self-end ${
                  transaction.type === "Deposit"
                    ? "text-green-700"
                    : "text-red-700"
                }`}
              >
                {transaction.formattedAmount}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">
          No transactions matching your filters.
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
