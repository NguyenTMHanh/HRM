import React, { useState, useEffect } from 'react';
import { Form, Row, Col, InputNumber, message } from 'antd';
import FooterBar from '../../../Footer/Footer';

const LocationCheckin = () => {
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [permissions, setPermissions] = useState([]);

  // Fetch permissions from localStorage
  useEffect(() => {
    const storedPermissions = JSON.parse(localStorage.getItem('permissions')) || [];
    setPermissions(storedPermissions);
  }, []);

  // Permission checks
  const canView = permissions.some(
    (p) => p.moduleId === 'allModule' && p.actionId === 'fullAuthority'
  ) || permissions.some(
    (p) => p.moduleId === 'setting' && p.actionId === 'view'
  );
  const canUpdate = permissions.some(
    (p) => p.moduleId === 'allModule' && p.actionId === 'fullAuthority'
  ) || permissions.some(
    (p) => p.moduleId === 'setting' && p.actionId === 'update'
  );

  const handleEdit = () => {
    if (!canUpdate) {
      message.error('Bạn không có quyền chỉnh sửa cài đặt vị trí check-in.');
      return;
    }
    setIsEditing(true);
  };

  const handleCancel = () => {
    form.resetFields(); // Reset form về giá trị ban đầu
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!canUpdate) {
      message.error('Bạn không có quyền chỉnh sửa cài đặt vị trí check-in.');
      return;
    }
    if (!isEditing || isLoading) return;

    try {
      setIsLoading(true);
      await form.validateFields();
      message.success('Cập nhật cài đặt vị trí check-in thành công!');
      setIsEditing(false);
    } catch (err) {
      if (err.errorFields) {
        message.error('Vui lòng nhập đầy đủ các trường bắt buộc!');
      } else {
        message.error('Không thể cập nhật cài đặt vị trí check-in.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <style>
        {`
          .ant-input-number-disabled .ant-input-number-input {
            background-color: white !important;
            color: rgba(0, 0, 0, 0.85) !important;
            cursor: not-allowed;
          }
          .ant-input-number-disabled {
            background-color: white !important;
          }
        `}
      </style>
      <Form form={form} layout="vertical">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12}>
            <Form.Item
              label="Kinh độ"
              name="longitude"
              rules={[
                { required: true, message: 'Vui lòng nhập kinh độ!' },
                {
                  type: 'number',
                  min: -180,
                  max: 180,
                  message: 'Kinh độ phải nằm trong khoảng từ -180 đến 180!',
                },
              ]}
            >
              <InputNumber
                placeholder="Nhập kinh độ"
                style={{ width: '100%' }}
                disabled={!isEditing || isLoading}
                step={0.000001}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Vĩ độ"
              name="latitude"
              rules={[
                { required: true, message: 'Vui lòng nhập vĩ độ!' },
                {
                  type: 'number',
                  min: -90,
                  max: 90,
                  message: 'Vĩ độ phải nằm trong khoảng từ -90 đến 90!',
                },
              ]}
            >
              <InputNumber
                placeholder="Nhập vĩ độ"
                style={{ width: '100%' }}
                disabled={!isEditing || isLoading}
                step={0.000001}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <FooterBar
        isModalFooter={true}
        showEdit={!isEditing && canUpdate}
        onEdit={handleEdit}
        onCancel={handleCancel}
        onSave={handleSave}
        isEditing={isEditing}
        showSave={isEditing && canUpdate}
        showCancel={isEditing}
        loading={isLoading}
      />
    </div>
  );
};

export default LocationCheckin;