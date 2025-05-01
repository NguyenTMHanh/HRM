import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Input, InputNumber, message, Button } from 'antd';
import FooterBar from '../../../Footer/Footer';
import styled from 'styled-components';

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

  const initialMinimumWage = {
    region: 'Vùng I', // Default region name as text
    wagePerHour: 23400, // Default minimum wage per hour (e.g., 23,400 VND/hour for Region I as of 2025)
  };

  useEffect(() => {
    const initial = form.getFieldValue('minimumWages') || [initialMinimumWage];
    setMinimumWages(initial);
    form.setFieldsValue({ minimumWages: initial });
  }, [form]);

  const handleAddMinimumWage = () => {
    const updated = [...minimumWages, { region: '', wagePerHour: 0 }];
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
    const updated = minimumWages.filter((_, i) => i !== index);
    setMinimumWages(updated);
    form.setFieldsValue({ minimumWages: updated });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    form.resetFields();
    const initial = [initialMinimumWage];
    setMinimumWages(initial);
    form.setFieldsValue({ minimumWages: initial });
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      const formattedValues = values.minimumWages.map((minimumWage) => ({
        region: minimumWage.region || '',
        wagePerHour: minimumWage.wagePerHour || 0,
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
        {minimumWages.map((minimumWage, index) => (
          <Row gutter={[16, 16]} key={index} align="middle">
            <Col xs={24} sm={12}>
              <Form.Item
                label="Tên vùng"
                name={['minimumWages', index, 'region']}
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
                label="Mức lương vùng (tối thiểu / giờ)"
                name={['minimumWages', index, 'wagePerHour']}
                rules={[{ required: true, message: 'Vui lòng nhập mức lương tối thiểu theo giờ!' }]}
              >
                <InputNumber
                  placeholder="Nhập mức lương tối thiểu theo giờ"
                  min={0}
                  step={100}
                  formatter={(value) => value ? `${Number(value).toLocaleString('fr-FR')} VNĐ` : ''}
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

export default MinimumWage;