"use client";

import React, { useState, useEffect, useMemo } from "react";
import { database, firestore } from "../utils/firebase";
import { ref, onValue, set } from "firebase/database";
import {
  collection,
  query,
  orderBy,
  where,
  getDocs,
  updateDoc,
  addDoc,
} from "firebase/firestore";
import { Toaster, toast } from "react-hot-toast";
import Navbar from "../components/UI/Navbar";
import MobileNavbar from "../components/UI/MobileNavbar";
import Footer from "../components/UI/Footer";
import BottomMenu from "../components/UI/BottomMenu";
import {
  PlusCircleIcon,
  ChevronDownIcon,
  ClipboardDocumentIcon,
  ArrowUpTrayIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/solid";
import { Menu } from "@headlessui/react";
import Loader from "../components/UI/Loader";
import "../app/globals.css";

// Define filter options as a constant outside the component
const FILTER_OPTIONS = [
  { value: "all", label: "All Transactions" },
  { value: "today", label: "Today's Transactions" },
  { value: "thisMonth", label: "This Month's Transactions" },
];

// Define the Dashboard component as a named function
export default function Dashboard() {
  const [amount, setAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState(FILTER_OPTIONS[0]);
  const [referralUrl, setReferralUrl] = useState("");
  const [balance, setBalance] = useState();

  // Fetch payments and set referral URL
  useEffect(() => {
    // Ensure this runs only on client-side
    if (typeof window !== "undefined") {
      const generateReferralId = () => {
        return (
          Math.random().toString(36).substring(2, 15) +
          Math.random().toString(36).substring(2, 15)
        );
      };

      const setUrl = () => {
        setReferralUrl(
          `${window.location.origin}/referral?id=${generateReferralId()}`
        );
      };

      setUrl();
      fetchUserBalance();
      fetchPayments();
    }
  }, []);

  const fetchPayments = async () => {
    const userId = localStorage.getItem("user")?.slice(1, -1); // Get the userId from localStorage

    try {
      const usersRef = collection(firestore, "users"); // Reference to the 'users' collection
      const userSnapshot = await getDocs(
        query(usersRef, where("id", "==", userId))
      );

      if (!userSnapshot.empty) {
        // If the user exists, access the first user document
        const userData = userSnapshot.docs[0].data(); // Get the user data

        // Now that we have the user data, access the user's transactions sub-collection
        const transactionsRef = collection(
          firestore,
          `users/${userSnapshot.docs[0].id}/transactions` // Path to the transactions sub-collection
        );

        const transactionsSnapshot = await getDocs(transactionsRef); // Fetch the transactions from the sub-collection

        // Map through the transaction documents to get the required data
        const paymentsList = transactionsSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id, // Document ID
            amount: data.amount,
            type: data.type,
            timestamp: data.timestamp,
            formattedAmount: new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
            }).format(data.amount),
          };
        });

        setPayments(paymentsList);
      } else {
        throw new Error("User not found.");
      }
    } catch (error) {
      console.error("Error fetching payments: ", error);
      toast.error("Could not fetch payments. Please try again.");
    }
  };

  // Fetch user balance
  const fetchUserBalance = async () => {
    try {
      const userId = localStorage.getItem("user")?.slice(1, -1);
      if (!userId) throw new Error("User ID not found.");

      const usersRef = collection(firestore, "users");
      const userSnapshot = await getDocs(
        query(usersRef, where("id", "==", userId))
      );

      if (!userSnapshot.empty) {
        const userData = userSnapshot.docs[0].data();
        setBalance(userData.money || 0);
      }
    } catch (error) {
      console.error("Error fetching balance:", error);
      toast.error("Could not fetch balance");
    }
  };

  // Handle transaction (deposit or withdrawal)
  const handleTransaction = async (type, value) => {
    if (!value || isNaN(value) || value <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }

    setLoading(true);
    try {
      const userId = localStorage.getItem("user")?.slice(1, -1);
      if (!userId) throw new Error("User ID not found.");

      // Reference to the Firestore collection for users
      const usersRef = collection(firestore, "users");
      const userSnapshot = await getDocs(
        query(usersRef, where("id", "==", userId))
      );
      if (userSnapshot.empty) throw new Error("User document not found.");

      const userDoc = userSnapshot.docs[0];
      const currentMoney = userDoc.data().money || 0;
      const numValue = parseFloat(value);
      const newMoney =
        type === "add" ? currentMoney + numValue : currentMoney - numValue;

      if (newMoney < 0) throw new Error("Insufficient balance.");

      // Update Firestore document to reflect the new balance
      await updateDoc(userDoc.ref, { money: newMoney });

      // Create a new transaction document in the 'transactions' subcollection
      const transactionRef = collection(userDoc.ref, "transactions");

      // Each transaction gets a unique document ID automatically by Firestore
      await addDoc(transactionRef, {
        amount: numValue,
        type: type === "add" ? "Deposit" : "Withdrawal",
        timestamp: new Date().toISOString(),
      });

      toast.success(`${type === "add" ? "Deposit" : "Withdrawal"} successful!`);
      setBalance(newMoney);
      type === "add" ? setAmount("") : setWithdrawAmount("");
      await fetchPayments();
    } catch (error) {
      toast.error(error.message || "Transaction failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Copy referral URL
  const handleCopyReferralUrl = () => {
    navigator.clipboard
      .writeText(referralUrl)
      .then(() => toast.success("Referral URL copied!"))
      .catch(() => toast.error("Failed to copy URL."));
  };

  const filteredPayments = useMemo(() => {
    const now = new Date(); // Compute current date once

    return payments.filter((payment) => {
      if (filter.value === "all") return true;

      const paymentDate = new Date(payment.timestamp);

      // Filter for "today"
      if (filter.value === "today") {
        return (
          paymentDate.getDate() === now.getDate() &&
          paymentDate.getMonth() === now.getMonth() &&
          paymentDate.getFullYear() === now.getFullYear()
        );
      }

      // Filter for "this month"
      return (
        paymentDate.getMonth() === now.getMonth() &&
        paymentDate.getFullYear() === now.getFullYear()
      );
    });
  }, [payments, filter]);

  // return !balance ? <Loader /> : (
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Toaster position="top-center" />

      {/* Responsive Navigation */}
      <nav className="md:hidden">
        <MobileNavbar />
      </nav>
      <nav className="hidden md:block">
        <Navbar />
      </nav>

      <main className="container mx-auto mt-10 px-4 py-8 lg:max-w-4xl">
        <div className="bg-white rounded-xl p-3 lg:p-6 space-y-6">
          {/* Balance Display */}
          <div className="text-center mt-3 lg:mt-4">
            <h2 className="text-3xl font-bold text-red-600">
              ₹{balance ? balance.toLocaleString() : 0.0}
            </h2>
            <p className="text-gray-500">Current Balance</p>
          </div>

          {/* Transaction Sections */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Deposit Section */}
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="text-xl font-semibold mb-4 text-green-700">
                <ArrowUpTrayIcon className="inline-block w-5 h-5 mr-2" />
                Deposit
              </h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleTransaction("add", amount);
                }}
                className="flex"
              >
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-green-600 text-white p-2 rounded-r-lg hover:bg-green-700 transition-colors"
                >
                  Deposit
                </button>
              </form>
            </div>

            {/* Withdraw Section */}
            <div className="bg-red-50 rounded-lg p-4">
              <h3 className="text-xl font-semibold mb-4 text-red-700">
                <ArrowDownTrayIcon className="inline-block w-5 h-5 mr-2" />
                Withdraw
              </h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleTransaction("withdraw", withdrawAmount);
                }}
                className="flex"
              >
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-red-600 text-white p-2 rounded-r-lg hover:bg-red-700 transition-colors"
                >
                  Withdraw
                </button>
              </form>
            </div>
          </div>

          {/* Transaction Filter */}
          <div>
            <label className="block mb-2 text-gray-700">
              Filter Transactions:
            </label>
            <Menu as="div" className="relative">
              <Menu.Button className="flex justify-between w-full bg-white border rounded-md px-4 py-2 hover:bg-gray-50">
                {filter.label}
                <ChevronDownIcon className="h-5 w-5 text-red-600" />
              </Menu.Button>
              <Menu.Items className="absolute z-10 w-full mt-2 bg-white shadow-lg rounded-md overflow-hidden">
                {FILTER_OPTIONS.map((option) => (
                  <Menu.Item key={option.value}>
                    {({ active }) => (
                      <button
                        onClick={() => setFilter(option)}
                        className={`block w-full text-left px-4 py-2 ${
                          active ? "bg-red-100" : ""
                        } ${filter.value === option.value ? "bg-red-200" : ""}`}
                      >
                        {option.label}
                      </button>
                    )}
                  </Menu.Item>
                ))}
              </Menu.Items>
            </Menu>
          </div>

          {/* Transaction History */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Transaction History
            </h3>
            {filteredPayments.length > 0 ? (
              <div className="space-y-2 max-h-64 overflow-y-auto scroll-smooth">
                {filteredPayments
                  .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)) // Sort by timestamp (latest first)
                  .map((payment) => (
                    <div
                      key={payment.id}
                      className={`flex justify-between p-3 rounded-lg ${
                        payment.type === "Deposit"
                          ? "bg-green-100"
                          : "bg-red-100"
                      }`}
                    >
                      <div>
                        <p className="font-medium">{payment.type}</p>
                        <p className="text-sm text-gray-600">
                          {/* Improved date formatting */}
                          <p className="text-sm text-gray-600">
                            {payment && payment.timestamp
                              ? new Date(payment.timestamp).toLocaleString(
                                  "en-IN",
                                  {
                                    weekday: "short",
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                    hour: "numeric",
                                    minute: "numeric",
                                    second: "numeric",
                                  }
                                )
                              : "N/A"}
                          </p>
                        </p>
                      </div>
                      <span
                        className={`font-bold ${
                          payment.type === "Deposit"
                            ? "text-green-700"
                            : "text-red-700"
                        }`}
                      >
                        {payment.formattedAmount}
                      </span>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">
                No transactions available.
              </p>
            )}
          </div>

          {/* Referral Section */}
          <div className="mb-3 lg:mb-4">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Referral Link
            </h3>
            <div className="flex">
              <input
                type="text"
                value={referralUrl}
                readOnly
                className="w-full p-2 border rounded-l-lg bg-gray-100 truncate"
              />
              <button
                onClick={handleCopyReferralUrl}
                className="bg-red-600 text-white p-2 rounded-r-lg hover:bg-red-700 transition-colors"
              >
                <ClipboardDocumentIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Responsive Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0">
        <BottomMenu />
      </nav>

      {/* Desktop Footer */}
      <footer className="hidden md:block">
        <Footer />
      </footer>
    </div>
  );
}
