import React, { useState } from "react";
import Image from "next/image";
import balls from "../../assets";
import { useEffect } from "react";

const Game = ({ showOverlay, setIsOpen, setColor, setSelected }) => {
  const [images] = useState(balls);

  const handlePlayButton = (e) => {
    const buttonId = e.target.id;
    const cleanedId = buttonId.replace("Button", "");
    setSelected(cleanedId);
    if (["red", "green", "violet"].includes(cleanedId)) {
      setColor(cleanedId);
    } else if (["0", "2", "4", "6", "8"].includes(cleanedId)) {
      setColor("red");
    } else if (["1", "3", "5", "7", "9"].includes(cleanedId)) {
      setColor("green");
    } else if (cleanedId === "big") {
      setColor("red");
    } else if (cleanedId === "small") {
      setColor("sky");
    }
    setIsOpen((prev) => !prev);
  };

  const [counter, setCounter] = useState(10);

  useEffect(() => {
    let timer;
    if (showOverlay) {
      setCounter(10); // Reset counter to 10 when overlay is shown
      timer = setInterval(() => {
        setCounter((prev) => (prev > 0 ? prev - 1 : 0)); // Decrement the counter
      }, 1000);
    } else {
      clearInterval(timer); // Clear timer when overlay is hidden
    }
    return () => clearInterval(timer); // Cleanup timer on unmount
  }, [showOverlay]);

  return (
    <div className="relative w-full max-w-full mx-auto md:max-w-2xl flex flex-col items-center justify-center space-y-6 px-5 py-0">
      {/* Overlay Warning */}
      {showOverlay && (
        <div className="absolute inset-0 bg-red-500/75 mx-4 my-0 z-10 flex flex-col justify-center items-center rounded-lg">
          <div className="flex items-center space-x-2 text-white">
            <h1 className="text-white text-9xl font-black text-center">
              {counter > 0
                ? counter.toString().padStart(2, "0")
                : "Time is Up!"}
            </h1>
          </div>
        </div>
      )}

      {/* Color Selection Buttons */}
      <div className="w-full flex flex-wrap justify-between md:space-y-0 md:space-x-4">
        {[
          { id: "redButton", color: "bg-red-500", label: "Red" },
          { id: "violetButton", color: "bg-purple-500", label: "Violet" },
          { id: "greenButton", color: "bg-green-500", label: "Green" },
        ].map((button) => (
          <button
            key={button.id}
            id={button.id}
            onClick={handlePlayButton}
            className={`
              ${button.color} text-white font-bold 
              py-2 px-4 rounded-lg hover:bg-opacity-90 
              flex-1 mx-1 transition-all duration-300
            `}
          >
            {button.label}
          </button>
        ))}
      </div>

      {/* Ball Images Grid */}
      <div className="rounded-lg p-3 w-full">
        {/* First Row of Balls */}
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {images.slice(0, 5).map((image, index) => (
            <div
              key={index}
              className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28"
            >
              <Image
                src={image.src}
                id={`${index}Button`}
                onClick={handlePlayButton}
                alt={`Ball ${index}`}
                width={128}
                height={128}
                className="w-full h-full object-contain"
                priority
              />
            </div>
          ))}
        </div>

        {/* Second Row of Balls */}
        <div className="flex flex-wrap justify-center gap-2">
          {images.slice(5, 10).map((image, index) => (
            <div
              key={index + 5}
              className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28"
            >
              <Image
                src={image.src}
                id={`${index + 5}Button`}
                onClick={handlePlayButton}
                alt={`Ball ${index + 5}`}
                width={128}
                height={128}
                className="w-full h-full object-contain"
                priority
              />
            </div>
          ))}
        </div>
      </div>

      {/* Big/Small Buttons */}
      <div className="w-full flex justify-center mt-6 pb-2">
        <div className="flex space-x-0 bg-gray-100 rounded-3xl p-1 shadow-md w-full">
          <button
            id="bigButton"
            onClick={handlePlayButton}
            className="bg-red-600 text-white text-sm md:text-lg font-bold py-2 px-10 md:px-16 rounded-l-3xl hover:bg-red-700 flex-1 transition-all duration-300"
          >
            Big
          </button>
          <button
            id="smallButton"
            onClick={handlePlayButton}
            className="bg-sky-500 text-white text-sm md:text-lg font-bold py-2 px-10 md:px-16 rounded-r-3xl hover:bg-sky-600 flex-1 transition-all duration-300"
          >
            Small
          </button>
        </div>
      </div>
    </div>
  );
};

export default Game;
