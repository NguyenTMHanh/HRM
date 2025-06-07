import React from 'react';
import { Table } from 'antd';


const DeductionDependent = ({ dependents = [] }) => {
  const columns = [
    {
      title: 'Số lượng người phụ thuộc',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (text) => (text || text === 0 ? text.toLocaleString('fr-FR') : 'N/A'),
    },
    {
      title: 'Mức giảm trừ / 1 người',
      dataIndex: 'amountPerPerson',
      key: 'amountPerPerson',
      render: (text) => (text || text === 0 ? text.toLocaleString('fr-FR') : 'N/A'),
    },
  ];

  return (
    <div className="info-display" style={{ fontSize: '0.875rem !important' }}>
      <Table
        columns={columns}
        dataSource={dependents.map((item, index) => ({ ...item, key: index }))}
        pagination={false}
        locale={{ emptyText: 'Không có thông tin người phụ thuộc' }}
        bordered
        className="custom-allowance-table"
      />
    </div>
  );
};

export default DeductionDependent;
