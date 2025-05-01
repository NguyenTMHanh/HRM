import React, { useState, useEffect } from 'react';
import { Form, Row, Col, InputNumber, message } from 'antd';
import FooterBar from '../../../Footer/Footer';

const RateBHYT = () => {
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);

  const initialData = {
    companyRateBHYT: 3, 
    employeeRateBHYT: 1.5,
  };

  useEffect(() => {
    form.setFieldsValue({
      companyRateBHYT: initialData.companyRateBHYT,
      employeeRateBHYT: initialData.employeeRateBHYT,
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
        companyRateBHYT: values.companyRateBHYT || 0,
        employeeRateBHYT: values.employeeRateBHYT || 0,
      };

      console.log('Saved values:', formattedValues);
      setIsEditing(false);
      message.success("Lưu dữ liệu thành công!");
    } catch (error) {
      console.log('Validation failed:', error);
      message.error("Lưu thất bại! Vui lòng nhập đầy đủ các trường bắt buộc.");
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
              label="Tỉ lệ đóng BHYT của DN"
              name="companyRateBHYT"
              rules={[{ required: true, message: 'Vui lòng nhập tỉ lệ đóng BHYT của DN!' }]}
            >
              <InputNumber
                placeholder="Nhập tỉ lệ đóng BHYT của DN"
                min={0}
                max={100}
                step={0.1}
                formatter={(value) => `${value}%`}
                parser={(value) => value.replace('%', '')}
                style={{ width: '100%' }}
                disabled={!isEditing}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Tỉ lệ đóng BHYT của NLĐ"
              name="employeeRateBHYT"
              rules={[{ required: true, message: 'Vui lòng nhập tỉ lệ đóng BHYT của NLĐ!' }]}
            >
              <InputNumber
                placeholder="Nhập tỉ lệ đóng BHYT của NLĐ"
                min={0}
                max={100}
                step={0.1}
                formatter={(value) => `${value}%`}
                parser={(value) => value.replace('%', '')}
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

export default RateBHYT;