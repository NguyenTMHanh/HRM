import React from 'react';
import { Table, Checkbox, Button } from 'antd';

const AllPayroll = ({ payrolls = [] }) => {
  const columns = [
    {
      title: 'Tháng',
      dataIndex: 'month',
      key: 'month',
      render: (text) => text || 'N/A',
    },
    {
      title: 'Đã xác nhận',
      dataIndex: 'confirmed',
      key: 'confirmed',
      render: (value) => <Checkbox checked={!!value} />,
    },
    {
      title: 'Download',
      key: 'download',
      render: () => (
        <Button className="download-btn">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#374151"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 15V3m0 12l-4-4m4 4l4-4"></path>
            <path d="M4 15v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4"></path>
          </svg>
        </Button>
      ),
    },
  ];

  return (
    <div className="info-display" style={{ fontSize: '0.875rem !important' }}>
      <Table
        columns={columns}
        dataSource={payrolls.map((item, index) => ({ ...item, key: index }))}
        pagination={false}
        locale={{ emptyText: 'Không có dữ liệu bảng lương' }}
        bordered
        className="custom-allowance-table"
      />
    </div>
  );
};

export default AllPayroll;