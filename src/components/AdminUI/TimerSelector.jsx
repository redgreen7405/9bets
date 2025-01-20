// components/TimerSelector.jsx
import { useState, useEffect } from "react";
import { formatTime } from "../../utils/timeFormatter";

export const TimerSelector = ({ duration, onTimerEnd }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft === 0) {
      onTimerEnd?.();
      setTimeLeft(duration);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, duration, onTimerEnd]);

  return (
    <span className="px-3 py-1 text-sm font-semibold text-red-700 bg-red-50 rounded-full">
      {formatTime(timeLeft)}
    </span>
  );
};
