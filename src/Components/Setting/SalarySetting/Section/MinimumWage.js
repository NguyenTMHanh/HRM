import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Input, InputNumber, message, Button } from 'antd';
import FooterBar from '../../../Footer/Footer';
import styled from 'styled-components';
import axios from 'axios';

// Axios configuration (assuming it's already set up globally)
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

const MinimumWage = () => {
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [minimumWages, setMinimumWages] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const initialMinimumWage = {
    id: `MW${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`, // Temporary ID
    region: 'Vùng I', // Default region name as text
    wagePerHour: 23400, // Default minimum wage per hour (e.g., 23,400 VND/hour for Region I as of 2025)
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
  const canUpdate = hasAllModuleAuthority || permissions.some(
    (p) => p.moduleId === 'setting' && p.actionId === 'update'
  );

  // Fetch minimum wages from API
  const fetchMinimumWages = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/api/MinimumWageArea');
      const minimumWagesData = response.data.map((minimumWage) => ({
        id: minimumWage.id,
        region: minimumWage.nameArea,
        wagePerHour: minimumWage.moneyMinimumWageArea,
      }));
      setMinimumWages(minimumWagesData);
      form.setFieldsValue({ minimumWages: minimumWagesData });
    } catch (err) {
      console.error('Error fetching minimum wages:', err);
      message.error('Không thể tải danh sách mức lương vùng.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMinimumWages();
  }, []);

  const handleAddMinimumWage = () => {
    const newMinimumWage = {
      id: `MW${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`, // Temporary ID
      region: '',
      wagePerHour: 0,
    };
    const updated = [...minimumWages, newMinimumWage];
    setMinimumWages(updated);
    form.setFieldsValue({ minimumWages: updated });
  };

  const handleMinimumWageChange = (index, field, value) => {
    const updated = [...minimumWages];
    updated[index][field] = value;
    setMinimumWages(updated);
    form.setFieldsValue({ minimumWages: updated });
  };

  const handleDeleteMinimumWage = (index) => {
    if (!canUpdate) {
      message.error('Bạn không có quyền xóa mức lương vùng.');
      return;
    }
    const updated = minimumWages.filter((_, i) => i !== index);
    setMinimumWages(updated);
    form.setFieldsValue({ minimumWages: updated });
  };

  const handleEdit = () => {
    if (!canUpdate) {
      message.error('Bạn không có quyền chỉnh sửa mức lương vùng.');
      return;
    }
    setIsEditing(true);
  };

  const handleCancel = () => {
    fetchMinimumWages(); // Reload original data
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!isEditing || isLoading) return;
    if (!canUpdate) {
      message.error('Bạn không có quyền cập nhật mức lương vùng.');
      return;
    }

    try {
      setIsLoading(true);
      const values = await form.validateFields();

      const formattedValues = values.minimumWages.map((minimumWage) => ({
        id: minimumWage.id,
        nameArea: minimumWage.region || '',
        moneyMinimumWageArea: minimumWage.wagePerHour || 0,
      }));

      const response = await axios.put('/api/MinimumWageArea', formattedValues);

      if (response.status === 200) {
        message.success('Cập nhật mức lương vùng thành công!');
        setIsEditing(false);
        fetchMinimumWages(); // Refresh data
      } else {
        message.error(`Yêu cầu không thành công với mã trạng thái: ${response.status}`);
      }
    } catch (err) {
      if (err.errorFields) {
        message.error('Vui lòng nhập đầy đủ các trường bắt buộc!');
        return;
      }
      console.error('Minimum wage operation error:', err);
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
      {/* Add custom styles for disabled Input and InputNumber */}
      <style>
        {`
          /* Style for disabled Input */
          .ant-input-disabled {
            background-color: white !important;
            color: rgba(0, 0, 0, 0.85) !important; /* Keep text color normal */
            cursor: not-allowed;
          }

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
        <Form.List name="minimumWages">
          {(fields) => (
            <>
              {fields.map(({ key, name, ...restField }, index) => (
                <Row gutter={[16, 16]} key={key} align="middle">
                  <Col xs={24} sm={12}>
                    <Form.Item
                      {...restField}
                      label="Tên vùng"
                      name={[name, 'region']}
                      rules={[{ required: true, message: 'Vui lòng nhập tên vùng!' }]}
                    >
                      <Input
                        placeholder="Nhập tên vùng"
                        style={{ width: '100%' }}
                        disabled={!isEditing}
                        onChange={(e) => handleMinimumWageChange(index, 'region', e.target.value)}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={10}>
                    <Form.Item
                      {...restField}
                      label="Mức lương vùng (tối thiểu / giờ)"
                      name={[name, 'wagePerHour']}
                      rules={[{ required: true, message: 'Vui lòng nhập mức lương tối thiểu theo giờ!' }]}
                    >
                      <InputNumber
                        placeholder="Nhập mức lương tối thiểu theo giờ"
                        min={0}
                        step={100}
                        formatter={(value) => (value ? `${Number(value).toLocaleString('fr-FR')} VNĐ` : '')}
                        parser={(value) => value.replace(/[^0-9]/g, '')}
                        style={{ width: '100%' }}
                        disabled={!isEditing}
                        onChange={(value) => handleMinimumWageChange(index, 'wagePerHour', value)}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={2} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {isEditing && (
                      <DeleteButton onClick={() => handleDeleteMinimumWage(index)}>
                        Xóa
                      </DeleteButton>
                    )}
                  </Col>
                </Row>
              ))}
              {isEditing && (
                <Form.Item>
                  <AddButton onClick={handleAddMinimumWage} block>
                    Thêm mới mức lương vùng
                  </AddButton>
                </Form.Item>
              )}
            </>
          )}
        </Form.List>
      </Form>
      <FooterBar
        isModalFooter={true}
        showEdit={!isEditing && canUpdate} // Only show Edit button if user has update permission
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

export default MinimumWage;