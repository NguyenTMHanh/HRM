import React, { useState, useEffect } from 'react';
import { Form, Row, Col, InputNumber, message } from 'antd';
import FooterBar from '../../../Footer/Footer';
import axios from 'axios';

const HourlySalary = () => {
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

  // Fetch basic salary settings
  const fetchBasicSalarySettings = async () => {
    if (!canView) {
      message.error('Bạn không có quyền xem cài đặt lương cơ bản.');
      return;
    }
    try {
      setIsLoading(true);
      const response = await axios.get('/api/BasicSettingSalary');
      const { code, data, errors } = response.data;
      if (code === 0 && data) {
        form.setFieldsValue({
          hourlyRate: data.hourlySalary,
          standardHoursPerDay: data.hourWorkStandard,
          standardWorkingDays: data.dayWorkStandard,
        });
      } else {
        throw new Error(errors?.[0] || 'Không thể tải cài đặt lương cơ bản.');
      }
    } catch (err) {
      console.error('Error fetching basic salary settings:', err);
      const errorMessage =
        err.response?.data?.errors?.[0] ||
        err.response?.data?.message ||
        err.message ||
        'Không thể tải cài đặt lương cơ bản.';
      message.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (canView) {
      fetchBasicSalarySettings();
    }
  }, [permissions]);

  const handleEdit = () => {
    if (!canUpdate) {
      message.error('Bạn không có quyền chỉnh sửa cài đặt lương cơ bản.');
      return;
    }
    setIsEditing(true);
  };

  const handleCancel = () => {
    fetchBasicSalarySettings();
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!canUpdate) {
      message.error('Bạn không có quyền chỉnh sửa cài đặt lương cơ bản.');
      return;
    }
    if (!isEditing || isLoading) return;

    try {
      setIsLoading(true);
      const values = await form.validateFields();
      const dataToSend = {
        id: '123rrrrrrrr',
        hourlySalary: values.hourlyRate || 0,
        hourWorkStandard: values.standardHoursPerDay || 0,
        dayWorkStandard: values.standardWorkingDays || 0,
      };
      const response = await axios.put('/api/BasicSettingSalary', dataToSend);
      const { code, errors } = response.data;

      if (code === 0) {
        message.success('Cập nhật cài đặt lương cơ bản thành công!');
        setIsEditing(false);
        fetchBasicSalarySettings();
      } else {
        throw new Error(errors?.[0] || 'Cập nhật cài đặt thất bại.');
      }
    } catch (err) {
      if (err.errorFields) {
        message.error('Vui lòng nhập đầy đủ các trường bắt buộc!');
        setIsLoading(false);
        return;
      }
      console.error('Error updating basic salary settings:', err);
      const errorMessage =
        err.response?.data?.errors?.[0] ||
        err.response?.data?.message ||
        err.message ||
        'Không thể cập nhật cài đặt lương cơ bản.';
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
                formatter={(value) => (value ? `${Number(value).toLocaleString('fr-FR')} VNĐ` : '')}
                parser={(value) => value.replace(/[^0-9]/g, '')}
                style={{ width: '100%' }}
                disabled={!isEditing || isLoading}
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
                disabled={!isEditing || isLoading}
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

export default HourlySalary;