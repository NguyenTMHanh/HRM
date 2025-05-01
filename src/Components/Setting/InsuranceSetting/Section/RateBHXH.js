import React, { useState, useEffect } from 'react';
import { Form, Row, Col, InputNumber, message } from 'antd';
import FooterBar from '../../../Footer/Footer';

const RateBHXH = () => {
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);

  const initialData = {
    companyRateBHXH: 17.5, // Default BHXH contribution rate for the company (e.g., 17.5%)
    employeeRateBHXH: 8, // Default BHXH contribution rate for the employee (e.g., 8%)
  };

  useEffect(() => {
    form.setFieldsValue({
      companyRateBHXH: initialData.companyRateBHXH,
      employeeRateBHXH: initialData.employeeRateBHXH,
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
        companyRateBHXH: values.companyRateBHXH || 0,
        employeeRateBHXH: values.employeeRateBHXH || 0,
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
              label="Tỷ lệ đóng BHXH của DN"
              name="companyRateBHXH"
              rules={[{ required: true, message: 'Vui lòng nhập tỷ lệ đóng BHXH của DN!' }]}
            >
              <InputNumber
                placeholder="Nhập tỷ lệ đóng BHXH của DN"
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
              label="Tỷ lệ đóng BHXH của NLĐ"
              name="employeeRateBHXH"
              rules={[{ required: true, message: 'Vui lòng nhập tỷ lệ đóng BHXH của NLĐ!' }]}
            >
              <InputNumber
                placeholder="Nhập tỷ lệ đóng BHXH của NLĐ"
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

export default RateBHXH;