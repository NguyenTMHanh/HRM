import React, { useState, useEffect } from 'react';
import { Form, Row, Col, InputNumber, message } from 'antd';
import FooterBar from '../../../Footer/Footer';

const Deduction = () => {
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);

  const initialData = {
    personalDeduction: 11000000, // Default personal deduction (e.g., 11,000,000 VND as per Vietnam's tax law in 2025)
    dependentDeduction: 4400000, // Default dependent deduction (e.g., 4,400,000 VND per dependent as per Vietnam's tax law in 2025)
  };

  useEffect(() => {
    form.setFieldsValue({
      personalDeduction: initialData.personalDeduction,
      dependentDeduction: initialData.dependentDeduction,
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
        personalDeduction: values.personalDeduction || 0,
        dependentDeduction: values.dependentDeduction || 0,
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
          <Col xs={24} sm={12}>
            <Form.Item
              label="Mức giảm trừ cá nhân"
              name="personalDeduction"
              rules={[{ required: true, message: 'Vui lòng nhập mức giảm trừ cá nhân!' }]}
            >
              <InputNumber
                placeholder="Nhập mức giảm trừ cá nhân"
                min={0}
                step={100000}
                formatter={(value) => value ? `${Number(value).toLocaleString('fr-FR')} VNĐ` : ''}
                parser={(value) => value.replace(/[^0-9]/g, '')}
                style={{ width: '100%' }}
                disabled={!isEditing}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Mức giảm trừ người phụ thuộc"
              name="dependentDeduction"
              rules={[{ required: true, message: 'Vui lòng nhập mức giảm trừ người phụ thuộc!' }]}
            >
              <InputNumber
                placeholder="Nhập mức giảm trừ người phụ thuộc"
                min={0}
                step={100000}
                formatter={(value) => value ? `${Number(value).toLocaleString('fr-FR')} VNĐ` : ''}
                parser={(value) => value.replace(/[^0-9]/g, '')}
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

export default Deduction;