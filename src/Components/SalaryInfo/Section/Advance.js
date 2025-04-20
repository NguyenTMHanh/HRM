import React from 'react';
import { Table } from 'antd';


const Advance = ({ advances = [] }) => {
  const columns = [
    {
      title: 'Tên tạm ứng',
      dataIndex: 'name',
      key: 'name',
      render: (text) => text || 'N/A',
    },
    {
      title: 'Mức tạm ứng',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => (amount || amount === 0 ? amount.toLocaleString('fr-FR') : 'N/A'),
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
        dataSource={advances.map((item, index) => ({ ...item, key: index }))}
        pagination={false}
        locale={{ emptyText: 'Không có tạm ứng' }}
        bordered
        className="custom-allowance-table"
      />
    </div>
  );
};

export default Advance;
