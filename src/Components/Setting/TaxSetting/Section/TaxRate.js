import React, { useState, useEffect } from 'react';
import { Form, Row, Col, InputNumber, message, Button } from 'antd';
import FooterBar from '../../../Footer/Footer';
import styled from 'styled-components';
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

const DeleteButton = styled(Button)`
  background-color: #f5222d;
  border-color: #f5222d;
  color: white;
  border-radius: 4px;
  padding: 8px 16px;
  transition: all 0.3s ease;

  &:hover {
    background-color: #fff !important;
    border-color: #d42a2a !important;
    color: #d42a2a !important;
    cursor: pointer;
  }

  &:focus {
    outline: none;
  }
`;

const AddButton = styled(Button)`
  background-color: #001b45;
  border-color: #001b45;
  color: #fff;
  border-radius: 4px;
  padding: 8px 16px;
  transition: all 0.3s ease;

  &:hover {
    background-color: #002d72 !important;
    border-color: #002d72;
    color: #fff !important;
    cursor: pointer;
  }

  &:focus {
    outline: none;
  }
`;

const TaxRate = () => {
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [taxRates, setTaxRates] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const initialTaxRate = {
    id: `T${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`, // Temporary ID
    taxableIncome: 5000000, // Default taxable income threshold (e.g., 5,000,000 VND)
    taxRate: 5, // Default tax rate (e.g., 5%)
    progression: 0, // Default progressive amount (e.g., 0 VND)
  };

  // Fetch permissions from localStorage
  useEffect(() => {
    const storedPermissions = JSON.parse(localStorage.getItem('permissions')) || [];
    setPermissions(storedPermissions);
  }, []);

  // Permission checks
  const hasAllModuleAuthority = permissions.some(
    (p) => p.moduleId === 'allModule' && p.actionId === 'fullAuthority'
  );
  const canCreate = hasAllModuleAuthority || permissions.some(
    (p) => p.moduleId === 'setting' && p.actionId === 'create'
  );
  const canUpdate = hasAllModuleAuthority || permissions.some(
    (p) => p.moduleId === 'setting' && p.actionId === 'update'
  );

  // Fetch tax rates from API
  const fetchTaxRates = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/api/TaxRateProgression');
      const taxRatesData = response.data.map((taxRate) => ({
        id: taxRate.id,
        taxableIncome: taxRate.taxableIncome,
        taxRate: taxRate.taxRate,
        progression: taxRate.progression,
      }));
      setTaxRates(taxRatesData);
      form.setFieldsValue({ taxRates: taxRatesData });
    } catch (err) {
      console.error('Error fetching tax rates:', err);
      message.error('Không thể tải danh sách thuế suất.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTaxRates();
  }, []);

  const handleAddTaxRate = () => {
    if (!canCreate) {
      message.error('Bạn không có quyền tạo mới thuế suất.');
      return;
    }
    const newTaxRate = {
      id: `T${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`, // Temporary ID
      taxableIncome: 0,
      taxRate: 0,
      progression: 0,
    };
    const updated = [...taxRates, newTaxRate];
    setTaxRates(updated);
    form.setFieldsValue({ taxRates: updated });
  };

  const handleTaxRateChange = (index, field, value) => {
    const updated = [...taxRates];
    updated[index][field] = value;
    setTaxRates(updated);
    form.setFieldsValue({ taxRates: updated });
  };

  const handleDeleteTaxRate = (index) => {
    if (!canUpdate) {
      message.error('Bạn không có quyền xóa thuế suất.');
      return;
    }
    const updated = taxRates.filter((_, i) => i !== index);
    setTaxRates(updated);
    form.setFieldsValue({ taxRates: updated });
  };

  const handleEdit = () => {
    if (!canUpdate) {
      message.error('Bạn không có quyền chỉnh sửa thuế suất.');
      return;
    }
    setIsEditing(true);
  };

  const handleCancel = () => {
    fetchTaxRates(); // Reload original data
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!isEditing || isLoading) return;
    if (!canUpdate) {
      message.error('Bạn không có quyền cập nhật thuế suất.');
      return;
    }

    try {
      setIsLoading(true);
      const values = await form.validateFields();

      const formattedValues = values.taxRates.map((taxRate) => ({
        id: taxRate.id,
        taxableIncome: taxRate.taxableIncome || 0,
        taxRate: taxRate.taxRate || 0,
        progression: taxRate.progression || 0,
      }));

      const response = await axios.put('/api/TaxRateProgression', formattedValues);

      if (response.status === 200) {
        message.success('Cập nhật thuế suất thành công!');
        setIsEditing(false);
        fetchTaxRates(); // Refresh data
      } else {
        message.error(`Yêu cầu không thành công với mã trạng thái: ${response.status}`);
      }
    } catch (err) {
      if (err.errorFields) {
        message.error('Vui lòng nhập đầy đủ các trường bắt buộc!');
        return;
      }
      console.error('Tax rate operation error:', err);
      if (err.response) {
        const { status, data } = err.response;
        const { errors } = data || {};
        const errorMsg = errors?.[0] || 'Không thể xử lý yêu cầu.';
        message.error(
          status === 400
            ? errorMsg
            : status === 401
            ? 'Bạn không có quyền thực hiện hành động này.'
            : status === 500
            ? 'Lỗi server. Vui lòng thử lại sau.'
            : `Lỗi không xác định với mã trạng thái: ${status}`
        );
      } else {
        message.error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
      }
    } finally {
      setIsLoading(false);
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
        <Form.List name="taxRates">
          {(fields) => (
            <>
              {fields.map(({ key, name, ...restField }, index) => (
                <Row gutter={[16, 16]} key={key} align="middle">
                  <Col xs={24} sm={8}>
                    <Form.Item
                      {...restField}
                      label="Ngưỡng thu nhập tính thuế"
                      name={[name, 'taxableIncome']}
                      rules={[{ required: true, message: 'Vui lòng nhập ngưỡng thu nhập tính thuế!' }]}
                    >
                      <InputNumber
                        placeholder="Nhập ngưỡng thu nhập tính thuế"
                        min={0}
                        step={100000}
                        formatter={(value) => value ? `${Number(value).toLocaleString('fr-FR')} VNĐ` : ''}
                        parser={(value) => value.replace(/[^0-9]/g, '')}
                        style={{ width: '100%' }}
                        disabled={!isEditing}
                        onChange={(value) => handleTaxRateChange(index, 'taxableIncome', value)}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={7}>
                    <Form.Item
                      {...restField}
                      label="Thuế suất"
                      name={[name, 'taxRate']}
                      rules={[{ required: true, message: 'Vui lòng nhập thuế suất!' }]}
                    >
                      <InputNumber
                        placeholder="Nhập thuế suất"
                        min={0}
                        max={100}
                        step={0.1}
                        formatter={(value) => `${value}%`}
                        parser={(value) => value.replace('%', '')}
                        style={{ width: '100%' }}
                        disabled={!isEditing}
                        onChange={(value) => handleTaxRateChange(index, 'taxRate', value)}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={7}>
                    <Form.Item
                      {...restField}
                      label="Lũy tiến"
                      name={[name, 'progression']}
                      rules={[{ required: true, message: 'Vui lòng nhập số tiền lũy tiến!' }]}
                    >
                      <InputNumber
                        placeholder="Nhập số tiền lũy tiến"
                        min={0}
                        step={100000}
                        formatter={(value) => value ? `${Number(value).toLocaleString('fr-FR')} VNĐ` : ''}
                        parser={(value) => value.replace(/[^0-9]/g, '')}
                        style={{ width: '100%' }}
                        disabled={!isEditing}
                        onChange={(value) => handleTaxRateChange(index, 'progression', value)}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={2} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {isEditing && (
                      <DeleteButton onClick={() => handleDeleteTaxRate(index)}>
                        Xóa
                      </DeleteButton>
                    )}
                  </Col>
                </Row>
              ))}
              {isEditing && (
                <Form.Item>
                  <AddButton onClick={handleAddTaxRate} block>
                    Thêm mới thuế suất
                  </AddButton>
                </Form.Item>
              )}
            </>
          )}
        </Form.List>
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

export default TaxRate;