import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const BonusAllowanceChart = () => {
  const bonusAllowanceData = [
    { month: 'Jan', totalBonus: 100, totalAllowance: 80 },
    { month: 'Feb', totalBonus: 120, totalAllowance: 90 },
    { month: 'Mar', totalBonus: 150, totalAllowance: 100 },
    { month: 'Apr', totalBonus: 180, totalAllowance: 110 },
    { month: 'May', totalBonus: 200, totalAllowance: 120 },
    { month: 'Jun', totalBonus: 220, totalAllowance: 130 },
    { month: 'Jul', totalBonus: 250, totalAllowance: 140 },
    { month: 'Aug', totalBonus: 270, totalAllowance: 150 },
    { month: 'Sep', totalBonus: 300, totalAllowance: 160 },
    { month: 'Oct', totalBonus: 320, totalAllowance: 170 },
    { month: 'Nov', totalBonus: 350, totalAllowance: 180 },
    { month: 'Dec', totalBonus: 400, totalAllowance: 200 },
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow border">
      <h3 className="text-sm text-gray-600 mb-4">Xu hướng thưởng và phụ cấp theo tháng</h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={bonusAllowanceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(value) => [`$${value}K`, '']} />
          <Legend />
          <Line type="monotone" dataKey="totalBonus" stroke="#F59E0B" name="Tổng Thưởng" />
          <Line type="monotone" dataKey="totalAllowance" stroke="#3B82F6" name="Tổng Phụ Cấp" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BonusAllowanceChart;