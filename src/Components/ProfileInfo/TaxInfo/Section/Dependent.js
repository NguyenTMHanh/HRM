import React from 'react';
import { Table } from 'antd';
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
            <a
              href={`#`} 
              download={files[0].name}
            >
              {files[0].name}
            </a>
          ) : (
            'N/A'
          ),
      }
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
