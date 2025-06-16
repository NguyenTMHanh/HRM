import React from 'react';
import { Row, Col, Divider, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons'; 
import './styles.css';

const WorkInfo = ({
    fullName,
    gender,
    dateOfBirth,
    joinDate,
    department,
    jobTitle,
    level,
    position,
    managedBy,
    workLocation,
    workMode,
    lunchBreak,
    avatarUrl, 
}) => {
    const formatDate = (date) => {
        if (!date) return 'N/A';
        return typeof date === 'string' ? date : date.format('DD/MM/YYYY');
    };

    const infoItems = [
        { label: 'Họ và tên', value: fullName },
        { label: 'Giới tính', value: gender },
        { label: 'Ngày sinh', value: formatDate(dateOfBirth) },
        { label: 'Ngày gia nhập công ty', value: formatDate(joinDate) },
        { label: 'Bộ phận', value: department },
        // { label: 'Chức vụ', value: jobTitle },
        { label: 'Cấp bậc', value: level },
        { label: 'Vị trí', value: position },
        { label: 'Được quản lý bởi', value: managedBy },
        { label: 'Cơ sở làm việc', value: workLocation },
        { label: 'Hình thức làm việc', value: workMode },
        { label: 'Giờ nghỉ trưa', value: lunchBreak },
    ];

    return (
        <div className="info-display" style={{ display: 'flex', alignItems: 'flex-start' }}>
            <div style={{ marginRight: '20px'}}>
                <Avatar
                    style={{backgroundColor: '#e6e9f0'}}
                    size={200}
                    src={avatarUrl}
                    icon={<UserOutlined />} 
                />
            </div>

            <div style={{ flex: 1}}>
                {infoItems.map((item, index) => (
                    <div key={index}>
                        <Row gutter={[16, 16]} className="info-row">
                            <Col xs={12} sm={6} className="info-label">
                                {item.label}
                            </Col>
                            <Col xs={12} sm={18} className="info-value" style={{ flex: 1 }}>
                                {item.value}
                            </Col>
                        </Row>
                        {index < infoItems.length - 1 && <Divider className="info-divider" />}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WorkInfo;