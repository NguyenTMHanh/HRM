import React from 'react';
import { Table, Button } from 'antd'; // Add Button to imports
import moment from 'moment';
import './styles.css';

const DependentInfo = ({ dependents = [] }) => {
  const columns = [
    {
      title: 'Tình trạng đăng ký',
      dataIndex: 'registered',
      key: 'registered',
      render: (text) => text || 'N/A',
    },
    {
      title: 'Mã số thuế',
      dataIndex: 'taxCode',
      key: 'taxCode',
      render: (text) => text || 'N/A',
    },
    {
      title: 'Họ và tên',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (text) => text || 'N/A',
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'birthDate',
      key: 'birthDate',
      render: (date) =>
        date ? moment(date).format('DD/MM/YYYY') : 'N/A',
    },
    {
      title: 'Mối quan hệ',
      dataIndex: 'relationship',
      key: 'relationship',
      render: (text) => text || 'N/A',
    },
    {
      title: 'Hồ sơ minh chứng',
      dataIndex: 'proofFile',
      key: 'proofFile',
      render: (files) =>
        files && files.length > 0 ? (
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
        ) : (
          'N/A'
        ),
    },
  ];

  return (
    <div className="info-display">
      <Table
        columns={columns}
        dataSource={dependents.map((item, index) => ({ ...item, key: index }))}
        pagination={false}
        locale={{ emptyText: 'Không có người phụ thuộc' }}
        bordered
        className="custom-dependent-table"
      />
    </div>
  );
};

export default DependentInfo;