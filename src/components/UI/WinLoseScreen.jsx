import React from "react";
import { motion } from "framer-motion";
import {
  XMarkIcon,
  TrophyIcon,
  FaceFrownIcon,
} from "@heroicons/react/24/outline";

const WinLoseScreen = ({ myHistory, setResultDisplay }) => {
  const isWin = myHistory.result === "Win";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden relative"
      >
        {/* Close button */}
        <button
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
          onClick={() => setResultDisplay(false)}
        >
          <XMarkIcon className="w-5 h-5 text-gray-500" />
        </button>

        {/* Content */}
        <div className="p-6 sm:p-8">
          {/* Result Icon */}
          <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center bg-gradient-to-br from-red-500 to-rose-600">
            {isWin ? (
              <TrophyIcon className="w-10 h-10 text-white" />
            ) : (
              <FaceFrownIcon className="w-10 h-10 text-white" />
            )}
          </div>

          {/* Title */}
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4 text-gray-900">
            {isWin ? "Congratulations!" : "Better Luck Next Time!"}
          </h2>

          {/* Message */}
          <p className="text-center text-gray-600 mb-8">
            {isWin
              ? "You've won! Your strategy and skill have paid off."
              : "Don't give up! Every attempt brings you closer to victory."}
          </p>

          {/* Stats Section */}
          <div className="mb-8 p-4 bg-gray-50 rounded-xl">
            <div className="text-center">
              <p className="text-sm text-gray-500">Result</p>
              <p className="font-semibold text-gray-900">{myHistory.result}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              className="px-6 py-2.5 rounded-xl text-white font-medium transition-all
                        bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700
                        focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none"
              onClick={() => setResultDisplay(false)}
            >
              Continue
            </button>
            <button
              className="px-6 py-2.5 rounded-xl font-medium transition-all
                        text-gray-700 bg-gray-100 hover:bg-gray-200
                        focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none"
              onClick={() => setResultDisplay(false)}
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default WinLoseScreen;
