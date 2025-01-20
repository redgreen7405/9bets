// components/RoomCard.jsx
import { TimerSelector } from "./TimerSelector";
import { DropdownMenu } from "./DropdownMenu";
import {
  numberOptions,
  colorOptions,
  sizeOptions,
} from "../../constants/timerConfig";
import { useEffect, useState } from "react";

// Utility function to format time display
const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes < 10 ? "0" : ""}${minutes}:${secs < 10 ? "0" : ""}${secs}`;
};

const times = [60, 180, 300, 600];

export const RoomCard = ({
  roomNumber,
  duration,
  onSubmit,
  loading,
  selectedValues,
  onValueChange,
}) => {
  const [timeLeft, setTimeLeft] = useState();
  const fetchTimers = async () => {
    try {
      const res = await fetch("/api/timer");
      const data = await res.json();
      setTimeLeft(data.timers.map((timer) => timer.remaining));
    } catch (error) {
      console.error("Error fetching timers:", error);
    }
  };

  useEffect(() => {
    fetchTimers();
  }, []);

  // Timer countdown logic
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prevTimes) =>
        prevTimes.map((time, index) => {
          return time > 0 ? time - 1 : times[index] - 2;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [times]);

  return (
    <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">
          {duration / 60} Min
        </h3>
        <h3>
          {timeLeft && formatTime(timeLeft[roomNumber - 1])}
        </h3>
        {/* <TimerSelector
        duration={duration}
        onTimerEnd={() => console.log(`Timer ended for room ${roomNumber}`)}
      /> */}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {[
          { label: "Number", key: "number", options: numberOptions },
          { label: "Color", key: "color", options: colorOptions },
          { label: "Big / Small", key: "size", options: sizeOptions },
        ].map(({ label, key, options }) => (
          <div key={key} className="space-y-2">
            <label className="text-sm font-medium text-gray-700">{label}</label>
            <DropdownMenu
              value={selectedValues[key] || ""}
              onChange={(value) => onValueChange(key, value)}
              options={options}
              placeholder={`Select ${label.toLowerCase()}`}
            />
          </div>
        ))}
      </div>

      <button
        onClick={onSubmit}
        disabled={loading}
        className="w-full px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? "Processing..." : "Submit"}
      </button>
    </div>
  )
};
