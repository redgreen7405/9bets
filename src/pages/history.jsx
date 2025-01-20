"use client";

import React from "react";
import Navbar from "../components/UI/Navbar";
import MobileNavbar from "../components/UI/MobileNavbar";
import Footer from "../components/UI/Footer";
import BottomMenu from "../components/UI/BottomMenu";
import { Toaster } from "react-hot-toast";
import TransactionHistory from "../components/UI/TransactionHistory";
import "../app/globals.css";

const History = () => {
  const games = [
    { id: 1, name: "Game A", score: 250, date: "2024-11-01" },
    { id: 2, name: "Game B", score: 150, date: "2024-11-02" },
    { id: 3, name: "Game C", score: 200, date: "2024-11-03" },
    { id: 4, name: "Game D", score: 300, date: "2024-11-04" },
    { id: 5, name: "Game E", score: 400, date: "2024-11-05" },
  ];

  return (
    <>
      <Toaster />
      <div className="hidden md:block">
        <Navbar />
      </div>
      <div className="block md:hidden">
        <MobileNavbar />
      </div>

      <div className="p-1 mt-16 md:mt-24 space-y-8">
        {/* History Section */}
        <div className="w-full bg-white rounded-2xl shadow-md p-4">
          <h2 className="text-xl font-semibold mb-4">Game History</h2>
          <div className="space-y-3">
            {games.map((game) => (
              <div
                key={game.id}
                className="flex justify-between items-center bg-gray-100 p-3 rounded-lg shadow-sm"
              >
                <div>
                  <p className="font-medium">{game.name}</p>
                  <p className="text-gray-500 text-sm">{game.date}</p>
                </div>
                <div className="font-semibold text-blue-600">Score: {game.score}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="hidden md:block">
        <Footer />
      </div>
      <div className="block md:hidden fixed bottom-0 w-full z-20">
        <BottomMenu />
      </div>
    </>
  );
};

export default History;
