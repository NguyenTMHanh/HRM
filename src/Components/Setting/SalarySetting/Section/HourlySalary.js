import React, { useState, useEffect } from 'react';
import { Form, Row, Col, InputNumber, message } from 'antd';
import FooterBar from '../../../Footer/Footer';

const HourlySalary = () => {
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);

  const initialData = {
    hourlyRate: 50000, // Default hourly rate (e.g., 50,000 VND/hour)
    standardHoursPerDay: 8, // Default standard working hours per day
    standardWorkingDays: 26, // Default standard working days per month
  };

  useEffect(() => {
    form.setFieldsValue({
      hourlyRate: initialData.hourlyRate,
      standardHoursPerDay: initialData.standardHoursPerDay,
      standardWorkingDays: initialData.standardWorkingDays,
    });
  }, [form]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    form.resetFields();
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      const formattedValues = {
        hourlyRate: values.hourlyRate || 0,
        standardHoursPerDay: values.standardHoursPerDay || 0,
        standardWorkingDays: values.standardWorkingDays || 0,
      };

      console.log('Saved values:', formattedValues);
      setIsEditing(false);
      message.success('Lưu dữ liệu thành công!');
    } catch (error) {
      console.log('Validation failed:', error);
      message.error('Lưu thất bại! Vui lòng nhập đầy đủ các trường bắt buộc.');
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Add custom styles for disabled InputNumber */}
      <style>
        {`
          /* Style for disabled InputNumber */
          .ant-input-number-disabled .ant-input-number-input {
            background-color: white !important;
            color: rgba(0, 0, 0, 0.85) !important; /* Keep text color normal */
            cursor: not-allowed;
          }

          /* Ensure the InputNumber container retains its border */
          .ant-input-number-disabled {
            background-color: white !important;
          }
        `}
      </style>
      <Form form={form} layout="vertical">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={8}>
            <Form.Item
              label="Mức lương/1h"
              name="hourlyRate"
              rules={[{ required: true, message: 'Vui lòng nhập mức lương theo giờ!' }]}
            >
              <InputNumber
                placeholder="Nhập mức lương theo giờ"
                min={0}
                step={1000}
                formatter={(value) => value ? `${Number(value).toLocaleString('fr-FR')} VNĐ` : ''}
                parser={(value) => value.replace(/[^0-9]/g, '')}
                style={{ width: '100%' }}
                disabled={!isEditing}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item
              label="Số giờ làm việc chuẩn/1 ngày"
              name="standardHoursPerDay"
              rules={[{ required: true, message: 'Vui lòng nhập số giờ làm việc chuẩn!' }]}
            >
              <InputNumber
                placeholder="Nhập số giờ làm việc chuẩn"
                min={0}
                max={24}
                step={0.5}
                formatter={(value) => `${value} giờ`}
                parser={(value) => value.replace(' giờ', '')}
                style={{ width: '100%' }}
                disabled={!isEditing}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item
              label="Số ngày công chuẩn"
              name="standardWorkingDays"
              rules={[{ required: true, message: 'Vui lòng nhập số ngày công chuẩn!' }]}
            >
              <InputNumber
                placeholder="Nhập số ngày công chuẩn"
                min={0}
                max={31}
                step={1}
                formatter={(value) => `${value} ngày`}
                parser={(value) => value.replace(' ngày', '')}
                style={{ width: '100%' }}
                disabled={!isEditing}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <FooterBar
        isModalFooter={true}
        showEdit={!isEditing}
        onEdit={handleEdit}
        onCancel={handleCancel}
        onSave={handleSave}
        isEditing={isEditing}
        showSave={isEditing}
        showCancel={isEditing}
      />
    </div>
  );
};

export default HourlySalary;