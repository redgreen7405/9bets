import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import { ref, get, set, increment } from "firebase/database";
import { database, firestore } from "../../utils/firebase";

const Drawer = ({
  isOpen,
  onClose,
  color = "emerald",
  selected,
  setMoney,
  setBidAmount,
  // gameId,
}) => {
  const [gameState, setGameState] = useState({
    balance: [1, 10, 100, 1000],
    selectedBalance: 1,
    quantity: 1,
    multiplier: 1,
    isAgreed: false,
    isClosing: false,
  });

  const { selectedBalance, quantity, multiplier, isAgreed, isClosing } =
    gameState;
  const totalAmount = selectedBalance * quantity * multiplier;
  const multipliers = [1, 5, 10, 20, 50, 100];
  const canSubmit = isAgreed && totalAmount > 0;

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleClose = () => {
    setGameState((prev) => ({ ...prev, isClosing: true }));
    setTimeout(() => {
      onClose();
      setGameState((prev) => ({ ...prev, isClosing: false }));
    }, 300);
  };

  const calculatePotentialWinnings = () => {
    let winMultiplier;
    if (selected === "violet") {
      winMultiplier = 4.5;
    } else if (selected === "red" || selected === "green") {
      winMultiplier = 2;
    } else {
      winMultiplier = 9;
    }
    return totalAmount * winMultiplier;
  };

  const handleGamePlay = async () => {
    setGameState((prev) => ({ ...prev, isClosing: true }));

    try {
      // Get user ID from localStorage
      const userId = localStorage.getItem("user")?.slice(1, -1);
      if (!userId) throw new Error("User ID not found.");

      onClose();
      // Query users collection to find the user document by userId field
      const usersRef = collection(firestore, "users");
      const q = query(usersRef, where("id", "==", userId));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error("User not found in the database.");
      }

      // Get the first (and should be only) matching user document
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();
      const currentMoney = userData.money || 0;

      if (currentMoney < totalAmount) {
        throw new Error("Insufficient balance!");
      }

      const updatedMoney = currentMoney - totalAmount;

      toast.success(`Transaction successful! New balance: ${updatedMoney}`);

      // Get today's date (in YYYY-MM-DD format)
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const dd = String(today.getDate()).padStart(2, "0");
      const todayDate = `${yyyy}-${mm}-${dd}`; // Format: "YYYY-MM-DD"

      // Reference to the `dates` collection in Firebase Realtime Database
      const todayRef = ref(database, `dates/${todayDate}`);

      // Fetch totalRecords for today's date
      const snapshot = await get(todayRef);
      let totalRecords = 0;
      if (snapshot.exists()) {
        totalRecords = snapshot.val().totalRecords || 0;
      }

      // Increment the totalRecords and generate the period
      const newTotalRecords = totalRecords + 1;
      const period = `${todayDate.replace(/-/g, "")}${String(
        newTotalRecords
      ).padStart(4, "0")}`;

      // Reference to the user's transactions subcollection in Firestore
      const transactionsRef = collection(userDoc.ref, "myTransactions");

      const transactionData = {
        type: "bet",
        amount: totalAmount,
        selection: selected,
        quantity,
        multiplier,
        balanceBefore: currentMoney,
        balanceAfter: updatedMoney,
        timestamp: serverTimestamp(),
        status: "pending",
        period, // Add the generated period
        gameDetails: {
          selectedBalance,
          color,
          potentialWinnings: calculatePotentialWinnings(),
        },
      };

      // Add the transaction document to Firestore
      await addDoc(transactionsRef, transactionData);

      // Update the user's balance in Firestore
      await updateDoc(userDoc.ref, {
        money: updatedMoney,
      });

      setMoney(updatedMoney);
      setBidAmount(totalAmount);
      setGameState({
        balance: [1, 10, 100, 1000],
        selectedBalance: 1,
        quantity: 1,
        multiplier: 1,
        isAgreed: false,
        isClosing: false,
      })
    } catch (error) {
      toast.error(error.message);
      console.error("Transaction error:", error);
    } finally {
      setGameState((prev) => ({ ...prev, isClosing: false }));
    }
  };

  const renderButton = (value, currentValue, setter, prefix = "") => (
    <button
      key={value}
      className={`py-2 rounded-lg text-sm font-semibold tracking-wider transition-all duration-200 
        ${currentValue === value
          ? `bg-white text-${color}-600 ring-2 ring-${color}-500`
          : "bg-white/10 hover:bg-white/20 text-white"
        }`}
      onClick={() => setGameState((prev) => ({ ...prev, [setter]: value }))}
    >
      {prefix}
      {value}
    </button>
  );

  return (
    <div
      id="drawer-overlay"
      className={`fixed inset-0 z-50 flex justify-center items-end bg-black/50 
        ${isOpen ? "visible" : "invisible"}`}
      onClick={(e) => e.target.id === "drawer-overlay" && handleClose()}
    >
      <div
        className={`absolute bottom-0 w-full max-w-md rounded-t-3xl bg-${color}-600 
        text-white shadow-2xl overflow-hidden transform transition-transform duration-300 
        ease-in-out ${isOpen && !isClosing ? "translate-y-0" : "translate-y-full"
          }`}
      >
        <div className="p-6 space-y-6">
          {/* Header */}
          <h2 className="text-center text-2xl font-bold text-white drop-shadow-md tracking-wide">
            Win Go
          </h2>

          {/* Selected Option Display */}
          <div className="text-center">
            <span className="bg-white/20 rounded-full px-4 py-2 text-sm font-medium tracking-wider">
              Select <span className="capitalize font-bold">{selected}</span>
            </span>
          </div>

          {/* Balance Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-white/80">
              Select Balance
            </label>
            <div className="grid grid-cols-4 gap-2">
              {gameState.balance.map((value) =>
                renderButton(value, selectedBalance, "selectedBalance")
              )}
            </div>
          </div>

          {/* Quantity Selection */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-white/80">
                Quantity
              </label>
              <div className="flex items-center space-x-4">
                <button
                  className="bg-white/10 text-white w-10 h-10 rounded-full flex items-center 
                    justify-center hover:bg-white/20 active:scale-95 transition-all"
                  onClick={() =>
                    setGameState((prev) => ({
                      ...prev,
                      quantity: Math.max(prev.quantity - 1, 1),
                    }))
                  }
                >
                  -
                </button>
                <input
                  type="text"
                  value={quantity}
                  readOnly
                  className="w-16 text-center bg-white text-emerald-600 font-bold rounded-lg py-2"
                />
                <button
                  className="bg-white/10 text-white w-10 h-10 rounded-full flex items-center 
                    justify-center hover:bg-white/20 active:scale-95 transition-all"
                  onClick={() =>
                    setGameState((prev) => ({
                      ...prev,
                      quantity: Math.min(prev.quantity + 1, 100),
                    }))
                  }
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Multiplier Selection */}
          <div className="grid grid-cols-3 gap-2">
            {multipliers.map((value) =>
              renderButton(value, multiplier, "multiplier", "X")
            )}
          </div>

          {/* Agreement Checkbox */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="agree"
              className="w-5 h-5 rounded border-transparent text-emerald-500 
                focus:ring-emerald-500 focus:ring-2 bg-white/20"
              checked={isAgreed}
              onChange={() =>
                setGameState((prev) => ({ ...prev, isAgreed: !prev.isAgreed }))
              }
            />
            <label htmlFor="agree" className="text-sm text-white/80">
              I agree{" "}
              <span className="text-red-400 underline cursor-pointer">
                (Pre-sale rules)
              </span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            <button
              className="bg-white/10 text-white py-3 rounded-lg hover:bg-white/20 
                active:scale-95 transition-all tracking-wider"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              className={`py-3 rounded-lg transition-all duration-300 tracking-wider font-semibold
                ${canSubmit
                  ? `bg-gradient-to-br from-${color}-600 to-${color}-700 
                     hover:from-${color}-700 hover:to-${color}-800 text-white`
                  : "bg-gray-400 text-gray-200 cursor-not-allowed"
                }`}
              onClick={handleGamePlay}
              disabled={!canSubmit}
            >
              Total ₹ {totalAmount.toFixed(2)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Drawer;
