import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Input, InputNumber, message, Button, Select } from 'antd';
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

const AllowanceSetting = () => {
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [allowances, setAllowances] = useState([]);

  // Allowance types for the combobox: Mandatory/Non-Mandatory for Social Insurance
  const allowanceTypes = [
    { value: 'mandatory', label: 'Phụ cấp đóng BH bắt buộc' },
    { value: 'non_mandatory', label: 'Phụ cấp không bắt buộc đóng BH' },
  ];

  const initialAllowance = {
    allowanceName: 'Phụ cấp đi lại', // Default allowance name
    allowanceType: 'non_mandatory', // Default allowance type
    allowanceAmount: 1000000, // Default allowance amount (e.g., 1,000,000 VND)
    taxExemptAmount: 500000, // Default tax-exempt amount (e.g., 500,000 VND)
  };

  useEffect(() => {
    const initial = form.getFieldValue('allowances') || [initialAllowance];
    setAllowances(initial);
    form.setFieldsValue({ allowances: initial });
  }, [form]);

  const handleAddAllowance = () => {
    const updated = [...allowances, { allowanceName: '', allowanceType: '', allowanceAmount: 0, taxExemptAmount: 0 }];
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
    const updated = allowances.filter((_, i) => i !== index);
    setAllowances(updated);
    form.setFieldsValue({ allowances: updated });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    form.resetFields();
    const initial = [initialAllowance];
    setAllowances(initial);
    form.setFieldsValue({ allowances: initial });
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      const formattedValues = values.allowances.map((allowance) => ({
        allowanceName: allowance.allowanceName || '',
        allowanceType: allowance.allowanceType || '',
        allowanceAmount: allowance.allowanceAmount || 0,
        taxExemptAmount: allowance.taxExemptAmount || 0,
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
        {allowances.map((allowance, index) => (
          <Row gutter={[16, 16]} key={index} align="middle">
            <Col xs={24} sm={6}>
              <Form.Item
                label="Tên phụ cấp"
                name={['allowances', index, 'allowanceName']}
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
                label="Loại phụ cấp"
                name={['allowances', index, 'allowanceType']}
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
                label="Mức phụ cấp"
                name={['allowances', index, 'allowanceAmount']}
                rules={[{ required: true, message: 'Vui lòng nhập mức phụ cấp!' }]}
              >
                <InputNumber
                  placeholder="Nhập mức phụ cấp"
                  min={0}
                  step={10000}
                  formatter={(value) => value ? `${Number(value).toLocaleString('fr-FR')} VNĐ` : ''}
                  parser={(value) => value.replace(/[^0-9]/g, '')}
                  style={{ width: '100%' }}
                  disabled={!isEditing}
                  onChange={(value) => handleAllowanceChange(index, 'allowanceAmount', value)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={4}>
              <Form.Item
                label="Mức phụ cấp miễn thuế"
                name={['allowances', index, 'taxExemptAmount']}
                rules={[{ required: true, message: 'Vui lòng nhập mức phụ cấp miễn thuế!' }]}
              >
                <InputNumber
                  placeholder="Nhập mức miễn thuế"
                  min={0}
                  step={10000}
                  formatter={(value) => value ? `${Number(value).toLocaleString('fr-FR')} VNĐ` : ''}
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

export default AllowanceSetting;