import React from 'react';

const CircularProgress = ({ value, max, color, label, sublabel }) => {
  const percentage = (value / max) * 100;
  const strokeDasharray = `${percentage} ${100 - percentage}`;

  return (
    <div className="relative w-24 h-24">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        <circle
          className="text-gray-200"
          strokeWidth="8"
          stroke="currentColor"
          fill="transparent"
          r="42"
          cx="50"
          cy="50"
        />
        <circle
          strokeWidth="8"
          strokeDasharray={strokeDasharray}
          strokeDashoffset="0"
          strokeLinecap="round"
          stroke={color}
          fill="transparent"
          r="42"
          cx="50"
          cy="50"
          style={{ transition: 'stroke-dasharray 0.5s ease-in-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-sm font-bold">{value}</span>
        <span className="text-xs text-gray-500">{sublabel}</span>
      </div>
      <div className="absolute -bottom-6 w-full text-center">
        <span className="text-xs text-gray-600">{label}</span>
      </div>
    </div>
  );
};

export default CircularProgress;