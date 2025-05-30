import React, { useState, useEffect } from 'react';
import { Form, Row, Col, InputNumber, message } from 'antd';
import FooterBar from '../../../Footer/Footer';
import axios from 'axios';

const Deduction = () => {
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [permissions, setPermissions] = useState([]);

  // Fetch permissions from localStorage
  useEffect(() => {
    const storedPermissions = JSON.parse(localStorage.getItem('permissions')) || [];
    setPermissions(storedPermissions);
  }, []);

  const canUpdate = permissions.some(
    (p) => p.moduleId === 'allModule' && p.actionId === 'fullAuthority'
  ) || permissions.some(
    (p) => p.moduleId === 'setting' && p.actionId === 'update'
  );

  // Fetch deduction level settings
  const fetchDeductionLevelSettings = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/api/DeductionLevel');
      const { code, data, errors } = response.data;
      if (code === 0 && data) {
        form.setFieldsValue({
          personalDeduction: data.individualDeduction,
          dependentDeduction: data.dependentDeduction,
        });
      } else {
        throw new Error(errors?.[0] || 'Không thể tải cài đặt mức giảm trừ.');
      }
    } catch (err) {
      console.error('Error fetching deduction level settings:', err);
      const errorMessage =
        err.response?.data?.errors?.[0] ||
        err.response?.data?.message ||
        err.message ||
        'Không thể tải cài đặt mức giảm trừ.';
      message.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDeductionLevelSettings();
  }, [permissions]);

  const handleEdit = () => {
    if (!canUpdate) {
      message.error('Bạn không có quyền chỉnh sửa cài đặt mức giảm trừ.');
      return;
    }
    setIsEditing(true);
  };

  const handleCancel = () => {
    fetchDeductionLevelSettings();
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!canUpdate) {
      message.error('Bạn không có quyền chỉnh sửa cài đặt mức giảm trừ.');
      return;
    }
    if (!isEditing || isLoading) return;

    try {
      setIsLoading(true);
      const values = await form.validateFields();
      const dataToSend = {
        id: "default", // Since the API expects an ID, we can use a placeholder if not dynamically fetched
        individualDeduction: values.personalDeduction || 0,
        dependentDeduction: values.dependentDeduction || 0,
      };
      const response = await axios.put('/api/DeductionLevel', dataToSend);
      const { code, errors } = response.data;

      if (code === 0) {
        message.success('Cập nhật cài đặt mức giảm trừ thành công!');
        setIsEditing(false);
        fetchDeductionLevelSettings();
      } else {
        throw new Error(errors?.[0] || 'Cập nhật cài đặt thất bại.');
      }
    } catch (err) {
      if (err.errorFields) {
        message.error('Vui lòng nhập đầy đủ các trường bắt buộc!');
        setIsLoading(false);
        return;
      }
      console.error('Error updating deduction level settings:', err);
      const errorMessage =
        err.response?.data?.errors?.[0] ||
        err.response?.data?.message ||
        err.message ||
        'Không thể cập nhật cài đặt mức giảm trừ.';
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
              label="Mức giảm trừ cá nhân"
              name="personalDeduction"
              rules={[{ required: true, message: 'Vui lòng nhập mức giảm trừ cá nhân!' }]}
            >
              <InputNumber
                placeholder="Nhập mức giảm trừ cá nhân"
                min={0}
                step={100000}
                formatter={(value) => (value ? `${Number(value).toLocaleString('fr-FR')} VNĐ` : '')}
                parser={(value) => value.replace(/[^0-9]/g, '')}
                style={{ width: '100%' }}
                disabled={!isEditing || isLoading}
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
                formatter={(value) => (value ? `${Number(value).toLocaleString('fr-FR')} VNĐ` : '')}
                parser={(value) => value.replace(/[^0-9]/g, '')}
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

export default Deduction;