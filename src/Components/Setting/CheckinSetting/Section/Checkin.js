import React, { useState, useEffect } from 'react';
import { Form, Row, Col, TimePicker, message } from 'antd';
import FooterBar from '../../../Footer/Footer';
import dayjs from 'dayjs';
import axios from 'axios';

const Checkin = () => {
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

  // Fetch check-in/check-out settings
  const fetchCheckInOutSettings = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/api/CheckInOutSetting/GetCheckInOutTime');
      const { code, data, errors } = response.data;
      if (code === 0 && data) {
        form.setFieldsValue({
          checkIn: data.checkin ? dayjs(data.checkin, 'HH:mm:ss') : null,
          checkOut: data.checkout ? dayjs(data.checkout, 'HH:mm:ss') : null,
        });
      } else {
        throw new Error(errors?.[0] || 'Không thể tải cài đặt check-in/check-out.');
      }
    } catch (err) {
      console.error('Error fetching check-in/check-out settings:', err);
      const errorMessage =
        err.response?.data?.errors?.[0] ||
        err.response?.data?.message ||
        err.message ||
        'Không thể tải cài đặt check-in/check-out.';
      message.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
      fetchCheckInOutSettings();
  }, [permissions]);

  const handleEdit = () => {
    if (!canUpdate) {
      message.error('Bạn không có quyền chỉnh sửa cài đặt check-in/check-out.');
      return;
    }
    setIsEditing(true);
  };

  const handleCancel = () => {
    fetchCheckInOutSettings();
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!canUpdate) {
      message.error('Bạn không có quyền chỉnh sửa cài đặt check-in/check-out.');
      return;
    }
    if (!isEditing || isLoading) return;

    try {
      setIsLoading(true);
      const values = await form.validateFields();
      const dataToSend = {
        checkin: values.checkIn ? values.checkIn.format('HH:mm:ss') : '00:00:00',
        checkout: values.checkOut ? values.checkOut.format('HH:mm:ss') : '00:00:00',
      };
      const response = await axios.put('/api/CheckInOutSetting/UpdateCheckInOutTime', dataToSend);
      const { code, errors } = response.data;

      if (code === 0) {
        message.success('Cập nhật cài đặt check-in/check-out thành công!');
        setIsEditing(false);
        fetchCheckInOutSettings();
      } else {
        throw new Error(errors?.[0] || 'Cập nhật cài đặt thất bại.');
      }
    } catch (err) {
      if (err.errorFields) {
        message.error('Vui lòng nhập đầy đủ các trường bắt buộc!');
        setIsLoading(false);
        return;
      }
      console.error('Error updating check-in/check-out settings:', err);
      const errorMessage =
        err.response?.data?.errors?.[0] ||
        err.response?.data?.message ||
        err.message ||
        'Không thể cập nhật cài đặt check-in/check-out.';
      message.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <style>
        {`
          .ant-picker-disabled .ant-picker-input input {
            background-color: white !important;
            color: rgba(0, 0, 0, 0.85) !important;
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
                disabled={!isEditing || isLoading}
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
                disabled={!isEditing || isLoading}
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

export default Checkin;