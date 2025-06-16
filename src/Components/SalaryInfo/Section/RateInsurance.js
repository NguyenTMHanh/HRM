import React from 'react';
import { Table } from 'antd';


const RateInsurance = ({ insuranceRates = [] }) => {
    const columns = [
        {
            title: 'Tên loại bảo hiểm',
            dataIndex: 'name',
            key: 'name',
            render: (text) => text || 'N/A',
        },
        {
            title: 'Tỷ lệ đóng (%)',
            dataIndex: 'rate',
            key: 'rate',
            render: (value) =>
                value || value === 0 ? `${value.toLocaleString()}%` : 'N/A',
        },
    ];

    return (
        <div className="info-display" style={{ fontSize: '0.75rem !important' }}>
            <Table
                columns={columns}
                dataSource={insuranceRates.map((item, index) => ({ ...item, key: index }))}
                pagination={false}
                locale={{ emptyText: 'Không có dữ liệu bảo hiểm' }}
                bordered
                className="custom-allowance-table"
            />
        </div>
    );
};
export default RateInsurance;
