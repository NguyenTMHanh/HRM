import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const BranchDepartmentChart = () => {
  const branchDepartmentData = [
    { name: 'Nhân sự', daNang: 50, hoChiMinh: 40 },
    { name: 'Kiểm thử', daNang: 30, hoChiMinh: 25 },
    { name: 'Lập trình', daNang: 20, hoChiMinh: 35 },
    { name: 'Tài chính', daNang: 15, hoChiMinh: 30 },
    { name: 'Kỹ thuật', daNang: 25, hoChiMinh: 20 },
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow border">
      <h3 className="text-sm text-gray-600 mb-4">Số lượng nhân viên theo bộ phận và chi nhánh</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={branchDepartmentData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value) => [`${value} nhân viên`, '']} />
          <Legend />
          <Bar dataKey="daNang" fill="#F5E6A3" name="Đà Nẵng" />
          <Bar dataKey="hoChiMinh" fill="#2D5F5D" name="Hồ Chí Minh" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BranchDepartmentChart;