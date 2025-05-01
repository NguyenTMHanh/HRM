import React, { useState, useEffect } from 'react';
import { Form, Row, Col, InputNumber, message } from 'antd';
import FooterBar from '../../../Footer/Footer';

const RateBHTN = () => {
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);

  const initialData = {
    companyRateBHTN: 1, // Default BHTN contribution rate for the company (e.g., 1%)
    employeeRateBHTN: 1, // Default BHTN contribution rate for the employee (e.g., 1%)
  };

  useEffect(() => {
    form.setFieldsValue({
      companyRateBHTN: initialData.companyRateBHTN,
      employeeRateBHTN: initialData.employeeRateBHTN,
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
        companyRateBHTN: values.companyRateBHTN || 0,
        employeeRateBHTN: values.employeeRateBHTN || 0,
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
      <Form form={form} layout="vertical">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12}>
            <Form.Item
              label="Tỷ lệ đóng BHTN của DN"
              name="companyRateBHTN"
              rules={[{ required: true, message: 'Vui lòng nhập tỷ lệ đóng BHTN của DN!' }]}
            >
              <InputNumber
                placeholder="Nhập tỷ lệ đóng BHTN của DN"
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
              label="Tỷ lệ đóng BHTN của NLĐ"
              name="employeeRateBHTN"
              rules={[{ required: true, message: 'Vui lòng nhập tỷ lệ đóng BHTN của NLĐ!' }]}
            >
              <InputNumber
                placeholder="Nhập tỷ lệ đóng BHTN của NLĐ"
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

export default RateBHTN;