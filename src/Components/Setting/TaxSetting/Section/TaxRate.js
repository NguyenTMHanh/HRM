import React, { useState, useEffect } from 'react';
import { Form, Row, Col, InputNumber, message, Button } from 'antd';
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

const TaxRate = () => {
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [taxRates, setTaxRates] = useState([]);

  const initialTaxRate = {
    threshold: 5000000, // Default taxable income threshold (e.g., 5,000,000 VND)
    rate: 5, // Default tax rate (e.g., 5%)
    progressive: 0, // Default progressive amount (e.g., 0 VND)
  };

  useEffect(() => {
    const initial = form.getFieldValue('taxRates') || [initialTaxRate];
    setTaxRates(initial);
    form.setFieldsValue({ taxRates: initial });
  }, [form]);

  const handleAddTaxRate = () => {
    const updated = [...taxRates, { threshold: 0, rate: 0, progressive: 0 }];
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
    const updated = taxRates.filter((_, i) => i !== index);
    setTaxRates(updated);
    form.setFieldsValue({ taxRates: updated });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    form.resetFields();
    const initial = [initialTaxRate];
    setTaxRates(initial);
    form.setFieldsValue({ taxRates: initial });
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      const formattedValues = values.taxRates.map((taxRate) => ({
        threshold: taxRate.threshold || 0,
        rate: taxRate.rate || 0,
        progressive: taxRate.progressive || 0,
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
        {taxRates.map((taxRate, index) => (
          <Row gutter={[16, 16]} key={index} align="middle">
            <Col xs={24} sm={8}>
              <Form.Item
                label="Ngưỡng thu nhập tính thuế"
                name={['taxRates', index, 'threshold']}
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
                  onChange={(value) => handleTaxRateChange(index, 'threshold', value)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={7}>
              <Form.Item
                label="Thuế suất"
                name={['taxRates', index, 'rate']}
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
                  onChange={(value) => handleTaxRateChange(index, 'rate', value)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={7}>
              <Form.Item
                label="Lũy tiến"
                name={['taxRates', index, 'progressive']}
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
                  onChange={(value) => handleTaxRateChange(index, 'progressive', value)}
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

export default TaxRate;