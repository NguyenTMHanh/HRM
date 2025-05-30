import React, { useState, useEffect } from 'react';
import { Form, Row, Col, InputNumber, message, Button, Select } from 'antd';
import FooterBar from '../../../Footer/Footer';
import styled from 'styled-components';
import axios from 'axios';

const { Option } = Select;

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

const SalaryCoefficient = () => {
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [salaryCoefficients, setSalaryCoefficients] = useState([]);
  const [positions, setPositions] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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

  // Fetch positions from API (assumed endpoint: /api/Position)
  const fetchPositions = async () => {
    try {
      const response = await axios.get('/api/Position');
      setPositions(response.data);
    } catch (err) {
      console.error('Error fetching positions:', err);
      message.error('Không thể tải danh sách vị trí.');
    }
  };

  // Fetch salary coefficients from API
  const fetchSalaryCoefficients = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/api/SalaryCoefficient');
      const coefficientsData = response.data.map((item) => ({
        id: item.id,
        positionName: item.positionName,
        coefficient: item.salaryCoefficient,
      }));
      setSalaryCoefficients(coefficientsData);
      form.setFieldsValue({ salaryCoefficients: coefficientsData });
    } catch (err) {
      console.error('Error fetching salary coefficients:', err);
      message.error('Không thể tải danh sách hệ số lương.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPositions();
    fetchSalaryCoefficients();
  }, []);

  const handleAddSalaryCoefficient = () => {
    const newCoefficient = {
      id: `SC${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`, // Temporary ID
      positionName: '',
      coefficient: 0,
    };
    const updated = [...salaryCoefficients, newCoefficient];
    setSalaryCoefficients(updated);
    form.setFieldsValue({ salaryCoefficients: updated });
  };

  const handleSalaryCoefficientChange = (index, field, value) => {
    const updated = [...salaryCoefficients];
    updated[index][field] = value;
    setSalaryCoefficients(updated);
    form.setFieldsValue({ salaryCoefficients: updated });
  };

  const handleDeleteSalaryCoefficient = (index) => {
    if (!canUpdate) {
      message.error('Bạn không có quyền xóa hệ số lương.');
      return;
    }
    const updated = salaryCoefficients.filter((_, i) => i !== index);
    setSalaryCoefficients(updated);
    form.setFieldsValue({ salaryCoefficients: updated });
  };

  const handleEdit = () => {
    if (!canUpdate) {
      message.error('Bạn không có quyền chỉnh sửa hệ số lương.');
      return;
    }
    setIsEditing(true);
  };

  const handleCancel = () => {
    fetchSalaryCoefficients(); // Reload original data
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!isEditing || isLoading) return;
    if (!canUpdate) {
      message.error('Bạn không có quyền cập nhật hệ số lương.');
      return;
    }

    try {
      setIsLoading(true);
      const values = await form.validateFields();

      const formattedValues = values.salaryCoefficients.map((item) => ({
        id: item.id,
        salaryCoefficient: item.coefficient || 0,
        positionName: item.positionName || '',
      }));

      const response = await axios.put('/api/SalaryCoefficient', formattedValues);

      if (response.status === 200) {
        message.success('Cập nhật hệ số lương thành công!');
        setIsEditing(false);
        fetchSalaryCoefficients(); // Refresh data
      } else {
        message.error(`Yêu cầu không thành công với mã trạng thái: ${response.status}`);
      }
    } catch (err) {
      if (err.errorFields) {
        message.error('Vui lòng nhập đầy đủ các trường bắt buộc!');
        return;
      }
      console.error('Salary coefficient operation error:', err);
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

          /* Style for disabled Select */
          .ant-select-disabled .ant-select-selector {
            background-color: white !important;
            color: rgba(0, 0, 0, 0.85) !important; /* Keep text color normal */
            cursor: not-allowed;
          }
        `}
      </style>
      <Form form={form} layout="vertical">
        <Form.List name="salaryCoefficients">
          {(fields) => (
            <>
              {fields.map(({ key, name, ...restField }, index) => (
                <Row gutter={[16, 16]} key={key} align="middle">
                  <Col xs={24} sm={12}>
                    <Form.Item
                      {...restField}
                      label="Vị trí"
                      name={[name, 'positionName']}
                      rules={[{ required: true, message: 'Vui lòng chọn vị trí!' }]}
                    >
                      <Select
                        placeholder="Chọn vị trí"
                        style={{ width: '100%' }}
                        disabled={!isEditing}
                        onChange={(value) => handleSalaryCoefficientChange(index, 'positionName', value)}
                      >
                        {positions.map((pos) => (
                          <Option key={pos.id} value={pos.positionName}>
                            {pos.positionName}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={10}>
                    <Form.Item
                      {...restField}
                      label="Hệ số lương"
                      name={[name, 'coefficient']}
                      rules={[{ required: true, message: 'Vui lòng nhập hệ số lương!' }]}
                    >
                      <InputNumber
                        placeholder="Nhập hệ số lương"
                        min={0}
                        step={0.1}
                        style={{ width: '100%' }}
                        disabled={!isEditing}
                        onChange={(value) => handleSalaryCoefficientChange(index, 'coefficient', value)}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={2} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {isEditing && (
                      <DeleteButton onClick={() => handleDeleteSalaryCoefficient(index)}>
                        Xóa
                      </DeleteButton>
                    )}
                  </Col>
                </Row>
              ))}
              {isEditing && (
                <Form.Item>
                  <AddButton onClick={handleAddSalaryCoefficient} block>
                    Thêm mới hệ số lương
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

export default SalaryCoefficient;