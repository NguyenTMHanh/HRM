import React, { useState, useEffect } from 'react';
import { Form, Row, Col, InputNumber, message } from 'antd';
import FooterBar from '../../../Footer/Footer';
import axios from 'axios';

// Axios configuration
axios.defaults.baseURL = 'https://localhost:7239';
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers['Content-Type'] = 'application/json';
    return config;
  },
  (error) => Promise.reject(error)
);

const RateBHYT = () => {
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [permissions, setPermissions] = useState([]);
  const [currentData, setCurrentData] = useState(null);

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

  // Fetch rate insurance settings
  const fetchRateInsuranceSettings = async () => {
    if (!canView) {
      message.error('Bạn không có quyền xem cài đặt tỷ lệ đóng BHYT.');
      return;
    }
    try {
      setIsLoading(true);
      const response = await axios.get('/api/RateInsurance/GetRateInsurance');
      const { code, data, errors } = response.data;
      if (code === 0 && data) {
        setCurrentData(data); // Store full data for updates
        form.setFieldsValue({
          companyRateBHYT: data.bhytBusinessRate,
          employeeRateBHYT: data.bhytEmpRate,
        });
      } else {
        throw new Error(errors?.[0] || 'Không thể tải cài đặt tỷ lệ đóng BHYT.');
      }
    } catch (err) {
      console.error('Error fetching rate insurance settings:', err);
      const errorMessage =
        err.response?.data?.errors?.[0] ||
        err.response?.data?.message ||
        err.message ||
        'Không thể tải cài đặt tỷ lệ đóng BHYT.';
      message.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (canView) {
      fetchRateInsuranceSettings();
    }
  }, [permissions]);

  const handleEdit = () => {
    if (!canUpdate) {
      message.error('Bạn không có quyền chỉnh sửa cài đặt tỷ lệ đóng BHYT.');
      return;
    }
    setIsEditing(true);
  };

  const handleCancel = () => {
    fetchRateInsuranceSettings();
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!canUpdate) {
      message.error('Bạn không có quyền cập nhật cài đặt tỷ lệ đóng BHYT.');
      return;
    }
    if (!isEditing || isLoading) return;

    try {
      setIsLoading(true);


      const values = await form.validateFields();
      const dataToSend = {
        id: currentData?.id || '',
        bhytBusinessRate: values.companyRateBHYT || 0,
        bhytEmpRate: values.employeeRateBHYT || 0,
        bhxhBusinessRate: currentData?.bhxhBusinessRate || 0,
        bhxhEmpRate: currentData?.bhxhEmpRate || 0,
        bhtnBusinessRate: currentData?.bhtnBusinessRate || 0,
        bhtnEmpRate: currentData?.bhtnEmpRate || 0,
      };
      const response = await axios.put('/api/RateInsurance/UpdateBHYTRate', dataToSend);
      const { code, errors } = response.data;

      if (code === 0) {
        message.success('Cập nhật tỷ lệ đóng BHYT thành công!');
        setIsEditing(false);
        fetchRateInsuranceSettings();
      } else {
        throw new Error(errors?.[0] || 'Cập nhật tỷ lệ đóng BHYT thất bại.');
      }
    } catch (err) {
      if (err.errorFields) {
        message.error('Vui lòng nhập đầy đủ các trường bắt buộc!');
        setIsLoading(false);
        return;
      }
      console.error('Error updating BHYT rate:', err);
      const errorMessage =
        err.response?.data?.errors?.[0] ||
        err.response?.data?.message ||
        err.message ||
        'Không thể cập nhật cài đặt tỷ lệ đóng BHYT.';
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
                disabled={!isEditing || isLoading}
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

export default RateBHYT;