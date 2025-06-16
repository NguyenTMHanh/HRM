import React from 'react';
import { Table } from 'antd';
import './styles.css';

const AllowanceInfo = ({ allowances = [] }) => {
  const columns = [
    {
      title: 'Tên phụ cấp',
      dataIndex: 'name',
      key: 'name',
      render: (text) => text || " ",
    },
    {
      title: 'Mức phụ cấp',
      dataIndex: 'amount',
      key: 'amount',
      render: (text) => text || " ",
    },
  ];

  return (
    <div className="info-display">
      <Table
        columns={columns}
        dataSource={allowances.map((item, index) => ({ ...item, key: index }))}
        pagination={false}
        locale={{ emptyText: 'Không có phụ cấp' }}
        bordered
        className="custom-allowance-table"
      />
    </div>
  );
};

export default AllowanceInfo;