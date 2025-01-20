"use client";

import React, { useEffect, useRef, useState } from "react";
import Navbar from "../components/UI/Navbar";
import BottomMenu from "../components/UI/BottomMenu";
import MobileNavbar from "../components/UI/MobileNavbar";
import Footer from "../components/UI/Footer";
import { Toaster } from "react-hot-toast";
import Timer from "../components/UI/Timer";
import Game from "../components/UI/Game";
import "../app/globals.css";
import GameHistory from "../components/UI/GameHistory";
import Wallet from "../components/UI/Wallet";
import Drawer from "../components/UI/Drawer";
import WinLoseScreen from "../components/UI/WinLoseScreen";
import Loader from "../components/UI/Loader";

const Play = () => {
  const times = [
    { label: "1min", seconds: 60 },
    { label: "3min", seconds: 180 },
    { label: "5min", seconds: 300 },
    { label: "10min", seconds: 600 },
  ];

  const [isLoading, setIsLoading] = useState(true);
  const [showOverlay, setShowOverlay] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [color, setColor] = useState("green");
  const [selected, setSelected] = useState();
  const [bidAmount, setBidAmount] = useState();
  const [result, setResult] = useState();
  const [money, setMoney] = useState();
  const [resultDisplay, setResultDisplay] = useState(false);
  const [myHistory, setMyHistory] = useState();
  const audioRef = useRef(null);

  useEffect(() => {
    // Hide loader once components are mounted
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (showOverlay) {
      if (audioRef.current) {
        audioRef.current.play();
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  }, [showOverlay]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <audio ref={audioRef} src="/assets/music.mp3" preload="auto" />
      {resultDisplay && <WinLoseScreen myHistory={myHistory} setResultDisplay={setResultDisplay} />}
      <Toaster />
      <div className="hidden md:block">
        <Navbar />
      </div>
      <div className="block md:hidden">
        <MobileNavbar />
      </div>
      <div className="p-1 mt-16 md:mt-24 space-y-8">
        <div className="wallet-balance-container">
          <div className="flex justify-center items-center my-6 relative px-4">
            <Wallet setMoney={setMoney} money={money} />
          </div>
        </div>
        <div className="timer-container">
          <Timer
            times={times}
            setResultDisplay={setResultDisplay}
            onLastTenSeconds={setShowOverlay}
            selected={selected}
            setSelected={setSelected}
            result={result}
            setResult={setResult}
            bidAmount={bidAmount}
            setMyHistory={setMyHistory}
          />
        </div>
        <div className="game-container">
          <Game
            showOverlay={showOverlay}
            setIsOpen={setIsOpen}
            setColor={setColor}
            setSelected={setSelected}
          />
        </div>
        <div className="game-history-container">
          <GameHistory result={result} />
        </div>
        <div className="grid gap-4 mt-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"></div>
      </div>
      <div className="hidden md:block">
        <Footer />
      </div>
      <div className="block md:hidden fixed bottom-0 w-full z-20">
        <BottomMenu />
      </div>
      <Drawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        color={color}
        totalAmount={1.0}
        selected={selected}
        setMoney={setMoney}
        setBidAmount={setBidAmount}
      />
    </>
  );
};

export default Play;