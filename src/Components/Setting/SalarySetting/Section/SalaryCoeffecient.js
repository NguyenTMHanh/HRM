import React, { useState, useEffect } from 'react';
import { Form, Row, Col, InputNumber, message, Button, Select } from 'antd';
import FooterBar from '../../../Footer/Footer';
import styled from 'styled-components';

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

  // Sample positions for the combobox
  const positions = [
    { value: 'developer', label: 'Lập trình viên' },
    { value: 'manager', label: 'Quản lý' },
    { value: 'designer', label: 'Thiết kế' },
    { value: 'tester', label: 'Kiểm thử' },
  ];

  const initialSalaryCoefficient = {
    position: 'developer', // Default position
    coefficient: 1.5, // Default salary coefficient
  };

  useEffect(() => {
    const initial = form.getFieldValue('salaryCoefficients') || [initialSalaryCoefficient];
    setSalaryCoefficients(initial);
    form.setFieldsValue({ salaryCoefficients: initial });
  }, [form]);

  const handleAddSalaryCoefficient = () => {
    const updated = [...salaryCoefficients, { position: '', coefficient: 0 }];
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
    const updated = salaryCoefficients.filter((_, i) => i !== index);
    setSalaryCoefficients(updated);
    form.setFieldsValue({ salaryCoefficients: updated });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    form.resetFields();
    const initial = [initialSalaryCoefficient];
    setSalaryCoefficients(initial);
    form.setFieldsValue({ salaryCoefficients: initial });
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      const formattedValues = values.salaryCoefficients.map((salaryCoefficient) => ({
        position: salaryCoefficient.position || '',
        coefficient: salaryCoefficient.coefficient || 0,
      }));

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
      {/* Add custom styles for disabled InputNumber and Select */}
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
        {salaryCoefficients.map((salaryCoefficient, index) => (
          <Row gutter={[16, 16]} key={index} align="middle">
            <Col xs={24} sm={12}>
              <Form.Item
                label="Vị trí"
                name={['salaryCoefficients', index, 'position']}
                rules={[{ required: true, message: 'Vui lòng chọn vị trí!' }]}
              >
                <Select
                  placeholder="Chọn vị trí"
                  style={{ width: '100%' }}
                  disabled={!isEditing}
                  onChange={(value) => handleSalaryCoefficientChange(index, 'position', value)}
                >
                  {positions.map((position) => (
                    <Option key={position.value} value={position.value}>
                      {position.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={10}>
              <Form.Item
                label="Hệ số lương"
                name={['salaryCoefficients', index, 'coefficient']}
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

export default SalaryCoefficient;