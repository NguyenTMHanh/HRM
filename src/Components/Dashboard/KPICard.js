import React from 'react';

const KPICard = ({ title, value, color }) => (
  <div className="bg-white p-4 rounded-lg shadow border flex flex-col items-center">
    <h3 className="text-sm text-gray-600 mb-2">{title}</h3>
    <p className={`text-2xl font-bold ${color}`}>{value}</p>
  </div>
);

export default KPICard;