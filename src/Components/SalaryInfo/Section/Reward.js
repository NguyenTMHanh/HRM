import React from 'react';
import { Table } from 'antd';


const Reward = ({ rewards = [] }) => {
  const columns = [
    {
      title: 'Tên thưởng',
      dataIndex: 'name',
      key: 'name',
      render: (text) => text || 'N/A',
    },
    {
      title: 'Mức thưởng',
      dataIndex: 'amount',
      key: 'amount',
      render: (text) => (text || text === 0 ? text.toLocaleString('fr-FR') : 'N/A'),
    },
    {
      title: 'Lý do',
      dataIndex: 'reason',
      key: 'reason',
      render: (text) => text || 'N/A',
    },
  ];

  return (
    <div className="info-display" style={{ fontSize: '0.75rem !important' }}>
      <Table
        columns={columns}
        dataSource={rewards.map((item, index) => ({ ...item, key: index }))}
        pagination={false}
        locale={{ emptyText: 'Không có thưởng' }}
        bordered
        className="custom-allowance-table"
      />
    </div>
  );
};

export default Reward;