import React from 'react';
import CircularProgressCard from './CircularProgressCard';

const CircularProgressSection = () => {
  const progressData = [
    { title: 'Current Ratio', value: 1.86, max: 3, color: '#3B82F6', label: '', sublabel: '' },
    { title: 'DSI', value: 10, max: 31, color: '#F59E0B', label: '[Days Sales Inventory]', sublabel: 'Days' },
    { title: 'DSO', value: 7, max: 31, color: '#EF4444', label: '[Days Sales Outstanding]', sublabel: 'Days' },
    { title: 'DPO', value: 28, max: 31, color: '#10B981', label: '[Days Payable Outstanding]', sublabel: 'Days' },
  ];

  return (
    <div className="flex flex-row gap-4 justify-center items-center flex-wrap">
      {progressData.map((item) => (
        <CircularProgressCard key={item.title} {...item} />
      ))}
    </div>
  );
};

export default CircularProgressSection;