import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Input, InputNumber, message, Button, Select } from 'antd';
import FooterBar from '../../../Footer/Footer';
import styled from 'styled-components';
import axios from 'axios';

const { Option } = Select;

// Axios configuration (assuming it's already set up globally as in Holiday)
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

const AllowanceSetting = () => {
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [allowances, setAllowances] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Allowance types for the combobox: Mandatory/Non-Mandatory for Social Insurance
  const allowanceTypes = [
    { value: 'mandatory', label: 'Phụ cấp đóng BH bắt buộc' },
    { value: 'non_mandatory', label: 'Phụ cấp không bắt buộc đóng BH' },
  ];

  const initialAllowance = {
    id: `A${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`, // Temporary ID
    allowanceName: 'Phụ cấp đi lại', // Default allowance name
    allowanceType: 'non_mandatory', // Default allowance type
    allowanceAmount: 1000000, // Default allowance amount (e.g., 1,000,000 VND)
    taxExemptAmount: 500000, // Default tax-exempt amount (e.g., 500,000 VND)
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

  // Fetch allowances from API
  const fetchAllowances = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/api/Allowance');
      const allowancesData = response.data.map((allowance) => ({
        id: allowance.id,
        allowanceName: allowance.nameAllowance,
        allowanceType: allowance.typeAllowance,
        allowanceAmount: allowance.moneyAllowance,
        taxExemptAmount: allowance.moneyAllowanceNoTax,
      }));
      setAllowances(allowancesData);
      form.setFieldsValue({ allowances: allowancesData });
    } catch (err) {
      console.error('Error fetching allowances:', err);
      message.error('Không thể tải danh sách phụ cấp.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllowances();
  }, []);

  const handleAddAllowance = () => {
    if (!canCreate) {
      message.error('Bạn không có quyền tạo mới phụ cấp.');
      return;
    }
    const newAllowance = {
      id: `A${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`, // Temporary ID
      allowanceName: '',
      allowanceType: '',
      allowanceAmount: 0,
      taxExemptAmount: 0,
    };
    const updated = [...allowances, newAllowance];
    setAllowances(updated);
    form.setFieldsValue({ allowances: updated });
  };

  const handleAllowanceChange = (index, field, value) => {
    const updated = [...allowances];
    updated[index][field] = value;
    setAllowances(updated);
    form.setFieldsValue({ allowances: updated });
  };

  const handleDeleteAllowance = (index) => {
    if (!canUpdate) {
      message.error('Bạn không có quyền xóa phụ cấp.');
      return;
    }
    const updated = allowances.filter((_, i) => i !== index);
    setAllowances(updated);
    form.setFieldsValue({ allowances: updated });
  };

  const handleEdit = () => {
    if (!canUpdate) {
      message.error('Bạn không có quyền chỉnh sửa phụ cấp.');
      return;
    }
    setIsEditing(true);
  };

  const handleCancel = () => {
    fetchAllowances(); // Reload original data
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!isEditing || isLoading) return;
    if (!canUpdate) {
      message.error('Bạn không có quyền cập nhật phụ cấp.');
      return;
    }

    try {
      setIsLoading(true);
      const values = await form.validateFields();

      const formattedValues = values.allowances.map((allowance) => ({
        id: allowance.id,
        nameAllowance: allowance.allowanceName || '',
        typeAllowance: allowance.allowanceType || '',
        moneyAllowance: allowance.allowanceAmount || 0,
        moneyAllowanceNoTax: allowance.taxExemptAmount || 0,
      }));

      const response = await axios.put('/api/Allowance', formattedValues);

      if (response.status === 200) {
        message.success('Cập nhật phụ cấp thành công!');
        setIsEditing(false);
        fetchAllowances(); // Refresh data
      } else {
        message.error(`Yêu cầu không thành công với mã trạng thái: ${response.status}`);
      }
    } catch (err) {
      if (err.errorFields) {
        message.error('Vui lòng nhập đầy đủ các trường bắt buộc!');
        return;
      }
      console.error('Allowance operation error:', err);
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
      {/* Add custom styles for disabled Input, InputNumber, and Select */}
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

          /* Style for disabled Select */
          .ant-select-disabled .ant-select-selector {
            background-color: white !important;
            color: rgba(0, 0, 0, 0.85) !important; /* Keep text color normal */
            cursor: not-allowed;
          }
        `}
      </style>
      <Form form={form} layout="vertical">
        <Form.List name="allowances">
          {(fields) => (
            <>
              {fields.map(({ key, name, ...restField }, index) => (
                <Row gutter={[16, 16]} key={key} align="middle">
                  <Col xs={24} sm={6}>
                    <Form.Item
                      {...restField}
                      label="Tên phụ cấp"
                      name={[name, 'allowanceName']}
                      rules={[{ required: true, message: 'Vui lòng nhập tên phụ cấp!' }]}
                    >
                      <Input
                        placeholder="Nhập tên phụ cấp"
                        style={{ width: '100%' }}
                        disabled={!isEditing}
                        onChange={(e) => handleAllowanceChange(index, 'allowanceName', e.target.value)}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={6}>
                    <Form.Item
                      {...restField}
                      label="Loại phụ cấp"
                      name={[name, 'allowanceType']}
                      rules={[{ required: true, message: 'Vui lòng chọn loại phụ cấp!' }]}
                    >
                      <Select
                        placeholder="Chọn loại phụ cấp"
                        style={{ width: '100%' }}
                        disabled={!isEditing}
                        onChange={(value) => handleAllowanceChange(index, 'allowanceType', value)}
                      >
                        {allowanceTypes.map((type) => (
                          <Option key={type.value} value={type.value}>
                            {type.label}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={6}>
                    <Form.Item
                      {...restField}
                      label="Mức phụ cấp"
                      name={[name, 'allowanceAmount']}
                      rules={[{ required: true, message: 'Vui lòng nhập mức phụ cấp!' }]}
                    >
                      <InputNumber
                        placeholder="Nhập mức phụ cấp"
                        min={0}
                        step={10000}
                        formatter={(value) => (value ? `${Number(value).toLocaleString('fr-FR')} VNĐ` : '')}
                        parser={(value) => value.replace(/[^0-9]/g, '')}
                        style={{ width: '100%' }}
                        disabled={!isEditing}
                        onChange={(value) => handleAllowanceChange(index, 'allowanceAmount', value)}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={4}>
                    <Form.Item
                      {...restField}
                      label="Mức phụ cấp miễn thuế"
                      name={[name, 'taxExemptAmount']}
                      rules={[{ required: true, message: 'Vui lòng nhập mức phụ cấp miễn thuế!' }]}
                    >
                      <InputNumber
                        placeholder="Nhập mức miễn thuế"
                        min={0}
                        step={10000}
                        formatter={(value) => (value ? `${Number(value).toLocaleString('fr-FR')} VNĐ` : '')}
                        parser={(value) => value.replace(/[^0-9]/g, '')}
                        style={{ width: '100%' }}
                        disabled={!isEditing}
                        onChange={(value) => handleAllowanceChange(index, 'taxExemptAmount', value)}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={2} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {isEditing && (
                      <DeleteButton onClick={() => handleDeleteAllowance(index)}>
                        Xóa
                      </DeleteButton>
                    )}
                  </Col>
                </Row>
              ))}
              {isEditing && (
                <Form.Item>
                  <AddButton onClick={handleAddAllowance} block>
                    Thêm mới phụ cấp
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

export default AllowanceSetting;