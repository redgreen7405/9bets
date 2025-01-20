import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  collection,
  query,
  where,
  getDocs,
  getFirestore,
} from "firebase/firestore";
import { app } from "../../utils/firebase";
import {
  WalletIcon,
  ArrowDownIcon,
  ArrowUpIcon,
} from "@heroicons/react/24/solid";

const Wallet = ({ money, setMoney }) => {
  const db = getFirestore(app);

  useEffect(() => {
    const fetchWalletBalance = async () => {
      const id = localStorage.getItem("user")?.slice(1, -1);
      if (!id) return;
      try {
        const userQuery = query(collection(db, "users"), where("id", "==", id));
        const querySnapshot = await getDocs(userQuery);
        if (!querySnapshot.empty) {
          setMoney(querySnapshot.docs[0]?.data().money || 0);
        } else {
          console.warn("No user found with that ID!");
        }
      } catch (error) {
        console.error("Error fetching wallet balance:", error);
      }
    };
    fetchWalletBalance();
  }, [db]);

  const formatMoneyInINR = (amount = 0) => {
    if (isNaN(amount) || amount === null || amount === undefined) {
      amount = 0;
    }
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl overflow-hidden transform transition-all duration-300 hover:scale-[1.02]">
      <div className="bg-gradient-to-r from-red-600 to-rose-500 p-6 text-center text-white">
        <WalletIcon className="mx-auto mb-4 w-12 h-12 text-white" />
        <p className="text-3xl font-bold tracking-wide">
          {formatMoneyInINR(money)}
        </p>
        <p className="text-sm opacity-80 mt-2">Wallet Balance</p>
      </div>

      <div className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Link
            href="/wallet"
            className="flex items-center justify-center space-x-2 bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
          >
            <ArrowDownIcon className="w-5 h-5" />
            <span className="font-semibold">Withdraw</span>
          </Link>

          <Link
            href="/wallet"
            className="flex items-center justify-center space-x-2 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
          >
            <ArrowUpIcon className="w-5 h-5" />
            <span className="font-semibold">Deposit</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
