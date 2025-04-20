import React from 'react';
import { Table } from 'antd';

const Punishment = ({ punishments = [] }) => {
  const columns = [
    {
      title: 'Tên phạt',
      dataIndex: 'name',
      key: 'name',
      render: (text) => text || 'N/A',
    },
    {
      title: 'Mức phạt',
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
    <div className="info-display" style={{ fontSize: '1rem !important' }}>
      <Table
        columns={columns}
        dataSource={punishments.map((item, index) => ({ ...item, key: index }))}
        pagination={false}
        locale={{ emptyText: 'Không có phạt' }}
        bordered
        className="custom-allowance-table"
      />
    </div>
  );
};

export default Punishment;