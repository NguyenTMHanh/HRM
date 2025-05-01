import React, { useState, useEffect } from 'react';
import { Form, Row, Col, InputNumber, message } from 'antd';
import FooterBar from '../../../Footer/Footer';

const BreakLunch = () => {
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);

  const initialData = {
    breakHours: 1, // Default hours
    breakMinutes: 0, // Default minutes
  };

  useEffect(() => {
    form.setFieldsValue({
      breakHours: initialData.breakHours,
      breakMinutes: initialData.breakMinutes,
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
        breakDuration: values.breakHours || values.breakMinutes
          ? `${values.breakHours || 0}h${values.breakMinutes || 0}m`
          : null,
      };

      console.log('Saved values:', formattedValues);
      setIsEditing(false);
      message.success('Lưu dữ liệu thành công!');
    } catch (error) {
      console.log('Validation failed:', error);
      message.error('Lưu thất bại! Vui lòng nhập thời gian nghỉ trưa.');
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <Form form={form} layout="vertical">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12}>
            <Form.Item
              label="Số giờ nghỉ trưa"
              name="breakHours"
              rules={[{ required: true, message: 'Vui lòng nhập số giờ!' }]}
            >
              <InputNumber
                min={0}
                max={23}
                placeholder="Giờ"
                disabled={!isEditing}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Số phút nghỉ trưa"
              name="breakMinutes"
              rules={[{ required: true, message: 'Vui lòng nhập số phút!' }]}
            >
              <InputNumber
                min={0}
                max={59}
                placeholder="Phút"
                disabled={!isEditing}
                style={{ width: '100%' }}
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

export default BreakLunch;