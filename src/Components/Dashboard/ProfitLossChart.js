import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ProfitLossChart = () => {
  const profitLossData = [
    { month: 'Jan', profit: 675, loss: 675, other: 675 },
    { month: 'Feb', profit: 675, loss: 675, other: 675 },
    { month: 'Mar', profit: 675, loss: 675, other: 675 },
    { month: 'Apr', profit: 675, loss: 675, other: 675 },
    { month: 'May', profit: 675, loss: 675, other: 675 },
    { month: 'Jun', profit: 675, loss: 675, other: 675 },
    { month: 'Jul', profit: 675, loss: 675, other: 675 },
    { month: 'Aug', profit: 675, loss: 675, other: 675 },
    { month: 'Sep', profit: 675, loss: 675, other: 675 },
    { month: 'Oct', profit: 675, loss: 675, other: 675 },
    { month: 'Nov', profit: 675, loss: 675, other: 675 },
    { month: 'Dec', profit: 675, loss: 675, other: 675 },
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow border">
      <h3 className="text-sm text-gray-600 mb-4">Profit and Loss summary</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={profitLossData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(value) => [`$${value}K`, '']} />
          <Legend />
          <Bar dataKey="profit" stackId="a" fill="#10B981" name="Profit" />
          <Bar dataKey="other" stackId="a" fill="#F59E0B" name="Other" />
          <Bar dataKey="loss" fill="#3B82F6" name="Loss" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProfitLossChart;