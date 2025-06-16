import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AgingChart = () => {
  const agingData = [
    { name: 'Current', receivable: 2494, payable: 1340 },
    { name: '1-30', receivable: 2340, payable: 500 },
    { name: '31-60', receivable: 1100, payable: 100 },
    { name: '61-90', payable: 75, receivable: 81 },
    { name: '91+', payable: 46, receivable: 29 },
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow border">
      <h3 className="text-sm text-gray-600 mb-4">Total Accounts Receivable and Payable Aging</h3>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={agingData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value) => [`$${value}K`, '']} />
          <Legend />
          <Bar dataKey="receivable" fill="#3B82F6" name="Accounts Receivable" />
          <Bar dataKey="payable" fill="#EF4444" name="Accounts Payable" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AgingChart;