import React, { useState, useEffect } from 'react';
import { Form, Row, Col, InputNumber, message } from 'antd';
import FooterBar from '../../../Footer/Footer';
import axios from 'axios';

const BreakLunch = () => {
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

  // Fetch break time settings
  const fetchBreakTimeSettings = async () => {
    if (!canView) {
      message.error('Bạn không có quyền xem cài đặt thời gian nghỉ trưa.');
      return;
    }
    try {
      setIsLoading(true);
      const response = await axios.get('/api/CheckInOutSetting/GetBreakTime');
      const { code, data, errors } = response.data;
      if (code === 0 && data) {
        form.setFieldsValue({
          breakHours: data.breakHour,
          breakMinutes: data.breakMinute,
        });
      } else {
        throw new Error(errors?.[0] || 'Không thể tải cài đặt thời gian nghỉ trưa.');
      }
    } catch (err) {
      console.error('Error fetching break time settings:', err);
      const errorMessage =
        err.response?.data?.errors?.[0] ||
        err.response?.data?.message ||
        err.message ||
        'Không thể tải cài đặt thời gian nghỉ trưa.';
      message.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (canView) {
      fetchBreakTimeSettings();
    }
  }, [permissions]);

  const handleEdit = () => {
    if (!canUpdate) {
      message.error('Bạn không có quyền chỉnh sửa cài đặt thời gian nghỉ trưa.');
      return;
    }
    setIsEditing(true);
  };

  const handleCancel = () => {
    fetchBreakTimeSettings();
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!canUpdate) {
      message.error('Bạn không có quyền chỉnh sửa cài đặt thời gian nghỉ trưa.');
      return;
    }
    if (!isEditing || isLoading) return;

    try {
      setIsLoading(true);
      const values = await form.validateFields();
      const dataToSend = {
        breakHour: values.breakHours || 0,
        breakMinute: values.breakMinutes || 0,
      };
      const response = await axios.put('/api/CheckInOutSetting/UpdateBreakTime', dataToSend);
      const { code, errors } = response.data;

      if (code === 0) {
        message.success('Cập nhật cài đặt thời gian nghỉ trưa thành công!');
        setIsEditing(false);
        fetchBreakTimeSettings();
      } else {
        throw new Error(errors?.[0] || 'Cập nhật cài đặt thất bại.');
      }
    } catch (err) {
      if (err.errorFields) {
        message.error('Vui lòng nhập đầy đủ các trường bắt buộc!');
        setIsLoading(false);
        return;
      }
      console.error('Error updating break time settings:', err);
      const errorMessage =
        err.response?.data?.errors?.[0] ||
        err.response?.data?.message ||
        err.message ||
        'Không thể cập nhật cài đặt thời gian nghỉ trưa.';
      message.error(errorMessage);
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
        `}
      </style>
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
                disabled={!isEditing || isLoading}
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
                disabled={!isEditing || isLoading}
                style={{ width: '100%' }}
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

export default BreakLunch;