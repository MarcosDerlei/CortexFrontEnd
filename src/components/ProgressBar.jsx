import React from "react";

export default function ProgressBar({ value, min }) {
  const percent = (value / min) * 100;
  const color =
    percent < 30 ? "bg-red-500" :
    percent < 60 ? "bg-yellow-500" : "bg-green-500";

  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div className={`${color} h-2 rounded-full`} style={{ width: `${percent}%` }} />
    </div>
  );
}
