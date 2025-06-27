import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const GenderDepartmentChart = () => {
  const genderDepartmentData = [
    { name: 'Nhân sự', nam: 30, nu: 20 },
    { name: 'Kỹ thuật', nam: 50, nu: 30 },
    { name: 'Kinh doanh', nam: 25, nu: 15 },
    { name: 'Tài chính', nam: 10, nu: 15 },
    { name: 'Hành chính', nam: 20, nu: 10 },
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow border">
      <h3 className="text-sm text-gray-600 mb-4">Giới tính nhân viên theo bộ phận</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={genderDepartmentData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value) => [`${value} nhân viên`, '']} />
          <Legend />
          <Bar dataKey="nam" fill="#A3BFFA" name="Nam" />
          <Bar dataKey="nu" fill="#F8A9B6" name="Nữ" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GenderDepartmentChart;