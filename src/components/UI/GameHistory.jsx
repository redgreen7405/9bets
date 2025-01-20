"use client";

import { useState } from "react";
import RandomDataTable from "./RandomDataTable";
import MyHistoryTable from "./MyHistoryTable";

const GameHistory = ({ result }) => {
  const [activeTab, setActiveTab] = useState("gameHistory");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="flex flex-col items-center justify-center mt-8 space-y-4">
      {/* Tabs Section */}
      <div className="w-full max-w-full md:max-w-2xl px-4 flex flex-row justify-between space-x-2">
        <button
          onClick={() => handleTabClick("gameHistory")}
          className={`${activeTab === "gameHistory"
              ? "bg-red-600 text-white"
              : "bg-gray-200 text-gray-500"
            } text-sm md:text-lg font-bold py-2 px-4 md:py-3 md:px-6 rounded-lg flex-1 transition-colors duration-300 ${activeTab === "gameHistory" ? "hover:bg-red-600" : "hover:bg-gray-300"
            }`}
        >
          Game History
        </button>
        <button
          onClick={() => handleTabClick("myHistory")}
          className={`${activeTab === "myHistory"
              ? "bg-red-600 text-white"
              : "bg-gray-200 text-gray-500"
            } text-sm md:text-lg font-bold py-2 px-4 md:py-3 md:px-6 rounded-lg flex-1 transition-colors duration-300 ${activeTab === "myHistory" ? "hover:bg-red-600" : "hover:bg-gray-300"
            }`}
        >
          My History
        </button>
      </div>

      {/* Content Section */}
      {activeTab === "gameHistory" && (
        <div className="p-4 rounded-lg w-full max-w-full md:max-w-2xl">
          {/* <p className="text-gray-700 text-sm md:text-base"> */}
          {/* Content for Game History tab! */}
          <RandomDataTable />
          {/* </p> */}
        </div>
      )}
      {activeTab === "myHistory" && (
        <div className="mt-4 w-full max-w-full md:max-w-2xl">
          <p className="text-gray-700 text-sm md:text-base">
            {/* Content for My History tab! */}
            <MyHistoryTable />
          </p>
        </div>
      )}
    </div>
  );
};

export default GameHistory;
