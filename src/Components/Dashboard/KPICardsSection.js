import React from 'react';
import KPICard from './KPICard';

const KPICardsSection = () => {
  const kpiData = [
    { title: 'Total Accounts Receivable', value: '$6,621,280', color: 'text-blue-600' },
    { title: 'Total Accounts Payable', value: '$1,630,270', color: 'text-red-600' },
    { title: 'Equity Ratio', value: '75.38 %', color: 'text-blue-800' },
    { title: 'Debt Equity', value: '1.10 %', color: 'text-blue-800' },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {kpiData.map((kpi, index) => (
        <KPICard key={index} {...kpi} />
      ))}
    </div>
  );
};

export default KPICardsSection;