import React from 'react';
import { Table, Checkbox } from 'antd';

const AllowanceInfo = ({ allowances = [] }) => {
  const columns = [
    {
      title: 'Tên phụ cấp',
      dataIndex: 'name',
      key: 'name',
      render: (text) => text || 'N/A',
    },
    {
      title: 'Mức phụ cấp',
      dataIndex: 'amount',
      key: 'amount',
      render: (text) => (text || text === 0 ? text.toLocaleString('fr-FR') : 'N/A'),
    },
    {
      title: 'Phụ cấp đóng BH',
      dataIndex: 'insuranceContribution',
      key: 'insuranceContribution',
      render: (value) => <Checkbox checked={!!value}/>,
    },
    {
      title: 'Phụ cấp miễn thuế',
      dataIndex: 'taxExempt',
      key: 'taxExempt',
      render: (value) => <Checkbox checked={!!value}/>,
    },
  ];

  return (
    <div className="info-display" style={{ fontSize: '0.875rem !important' }}>
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