// constants/timerConfig.js
export const TIMER_DURATIONS = {
  ONE_MIN: 60,
  THREE_MIN: 180,
  FIVE_MIN: 300,
  TEN_MIN: 600,
};

export const numberOptions = Array.from({ length: 10 }, (_, i) => ({
  value: i.toString(),
  label: i.toString(),
}));

export const colorOptions = [
  { value: "red", label: "Red", color: "bg-red-500" },
  { value: "green", label: "Green", color: "bg-green-500" },
  { value: "violet", label: "Violet", color: "bg-violet-500" },
];

export const sizeOptions = [
  { value: "big", label: "Big", color: "bg-blue-500" },
  { value: "small", label: "Small", color: "bg-yellow-500" },
];
