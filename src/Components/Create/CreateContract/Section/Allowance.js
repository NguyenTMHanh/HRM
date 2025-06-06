import React, { useState, useEffect } from 'react';
import { Form, Select, Input, Button, Row, Col } from 'antd';
import styled from 'styled-components';
import axios from 'axios';

const DeleteButton = styled(Button)`
  background-color: #f5222d;
  border-color: #f5222d;
  color: white;
  border-radius: 4px;
  padding: 8px 16px;
  transition: all 0.3s ease;

  &:hover {
    background-color: #d42a2a;
    border-color: #d42a2a;
    color: white !important;
    cursor: pointer;
  }

  &:focus {
    outline: none;
  }
`;

const AddButton = styled(Button)`
  background-color: #001b45;
  border-color: #001b45;
  color: white;
  border-radius: 4px;
  padding: 8px 16px;
  transition: all 0.3s ease;

  &:hover {
    background-color: #002d72 !important;
    border-color: #002d72;
    color: white !important;
    cursor: pointer;
  }

  &:focus {
    outline: none;
  }
`;

// Custom function to format numbers with spaces as thousand separators
const formatWithSpaces = (number) => {
  if (number == null) return '';
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

const Allowance = ({ form }) => {
  const [allowanceOptions, setAllowanceOptions] = useState([]);

  // Fetch allowances from the API
  useEffect(() => {
    const fetchAllowances = async () => {
      try {
        const response = await axios.get('/api/Allowance');
        if (response.status === 200 && Array.isArray(response.data)) {
          // Map API response to the format expected by the Select component
          const options = response.data.map((allowance) => ({
            label: allowance.nameAllowance,
            value: allowance.nameAllowance,
            amount: `${formatWithSpaces(allowance.moneyAllowance)} VNĐ`,
            moneyAllowance: allowance.moneyAllowance, // Store raw amount for reference
          }));
          setAllowanceOptions(options);
        } else {
          console.error('Unexpected API response:', response);
        }
      } catch (err) {
        console.error('Error fetching allowances:', err);
      }
    };

    fetchAllowances();
  }, []);

  const getAmountByName = (name) => {
    const found = allowanceOptions.find((item) => item.value === name);
    return found?.amount || '';
  };

  return (
    <Form.List name="allowances">
      {(fields, { add, remove }) => (
        <>
          {fields.map(({ key, name, ...restField }) => (
            <Row gutter={[16, 16]} key={key}>
              <Col xs={24} sm={11}>
                <Form.Item
                  {...restField}
                  label="Tên phụ cấp"
                  name={[name, 'name']}
                  rules={[{ required: true, message: 'Vui lòng chọn tên phụ cấp!' }]}
                >
                  <Select
                    placeholder="Chọn tên phụ cấp"
                    options={allowanceOptions}
                    onChange={(value) => {
                      form.setFieldsValue({
                        allowances: form
                          .getFieldValue('allowances')
                          .map((item, idx) =>
                            idx === name ? { ...item, amount: getAmountByName(value) } : item
                          ),
                      });
                    }}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={11}>
                <Form.Item
                  {...restField}
                  label="Mức phụ cấp"
                  name={[name, 'amount']}
                  rules={[{ required: true, message: 'Mức phụ cấp không được để trống!' }]}
                >
                  <Input placeholder="Mức phụ cấp" disabled />
                </Form.Item>
              </Col>

              <Col xs={24} sm={2} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <DeleteButton onClick={() => remove(name)}>Xóa</DeleteButton>
              </Col>
            </Row>
          ))}

          <Form.Item>
            <AddButton onClick={() => add()} block>
              Thêm mới phụ cấp
            </AddButton>
          </Form.Item>
        </>
      )}
    </Form.List>
  );
};

export default Allowance;