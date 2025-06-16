import React from 'react';
import CircularProgress from './CircularProgress';

const CircularProgressCard = ({ title, value, max, color, label, sublabel }) => (
  <div className="bg-white p-4 rounded-lg shadow border flex flex-col items-center">
    <h3 className="text-sm text-gray-600 mb-2 text-center">{title}</h3>
    <CircularProgress value={value} max={max} color={color} label={label} sublabel={sublabel} />
  </div>
);

export default CircularProgressCard;