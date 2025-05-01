import React, { useState, useEffect } from 'react';
import { Form, Row, Col, TimePicker, message } from 'antd';
import FooterBar from '../../../Footer/Footer';
import dayjs from 'dayjs';

const Checkin = () => {
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);

  const initialData = {
    checkIn: dayjs('14:00', 'HH:mm'),
    checkOut: dayjs('12:00', 'HH:mm'),
  };

  useEffect(() => {
    form.setFieldsValue({
      checkIn: initialData.checkIn,
      checkOut: initialData.checkOut,
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
        checkIn: values.checkIn ? values.checkIn.format('HH:mm') : null,
        checkOut: values.checkOut ? values.checkOut.format('HH:mm') : null,
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
      <style>
        {`
          .ant-picker-disabled .ant-picker-input input {
            background-color: white !important;
            color: rgba(0, 0, 0, 0.85) !important; /* Keep text color normal */
            cursor: not-allowed;
          }

          .ant-picker-disabled {
            background-color: white !important;
          }

          .ant-picker-disabled .ant-picker-suffix {
            color: rgba(0, 0, 0, 0.25);
          }
        `}
      </style>
      <Form form={form} layout="vertical">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12}>
            <Form.Item
              label="Check-in"
              name="checkIn"
              rules={[{ required: true, message: 'Vui lòng chọn thời gian check-in!' }]}
            >
              <TimePicker
                placeholder="Chọn thời gian check-in"
                format="HH:mm"
                style={{ width: '100%' }}
                disabled={!isEditing}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Check-out"
              name="checkOut"
              rules={[{ required: true, message: 'Vui lòng chọn thời gian check-out!' }]}
            >
              <TimePicker
                placeholder="Chọn thời gian check-out"
                format="HH:mm"
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

export default Checkin;