import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const WorkingCapitalChart = () => {
  const workingCapitalData = [
    { month: 'Jan', netWorking: 97, grossWorking: 62 },
    { month: 'Feb', netWorking: 249, grossWorking: 342 },
    { month: 'Mar', netWorking: 262, grossWorking: 201 },
    { month: 'Apr', netWorking: 291, grossWorking: 192 },
    { month: 'May', netWorking: -160, grossWorking: -532 },
    { month: 'Jun', netWorking: 305, grossWorking: 247 },
    { month: 'Jul', netWorking: 561, grossWorking: -532 },
    { month: 'Aug', netWorking: 540, grossWorking: 125 },
    { month: 'Sep', netWorking: 333, grossWorking: 186 },
    { month: 'Oct', netWorking: 347, grossWorking: -62 },
    { month: 'Nov', netWorking: 247, grossWorking: 0 },
    { month: 'Dec', netWorking: 0, grossWorking: 0 },
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow border">
      <h3 className="text-sm text-gray-600 mb-4">Net Working Capital vs Gross Working Capital</h3>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={workingCapitalData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(value) => [`$${value}K`, '']} />
          <Legend />
          <Line type="monotone" dataKey="netWorking" stroke="#F59E0B" name="Net Working Capital" />
          <Line type="monotone" dataKey="grossWorking" stroke="#3B82F6" name="Gross Working Capital" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WorkingCapitalChart;