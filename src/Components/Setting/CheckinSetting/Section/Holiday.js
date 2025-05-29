import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Input, DatePicker, message, Button } from 'antd';
import FooterBar from '../../../Footer/Footer';
import styled from 'styled-components';
import moment from 'moment';
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

const Holiday = () => {
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [holidays, setHolidays] = useState([]);
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
  const canCreate = hasAllModuleAuthority || permissions.some(
    (p) => p.moduleId === 'setting' && p.actionId === 'create'
  );
  const canUpdate = hasAllModuleAuthority || permissions.some(
    (p) => p.moduleId === 'setting' && p.actionId === 'update'
  );

  // Fetch holidays from API
  const fetchHolidays = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/api/Holiday');
      const holidaysData = response.data.map((holiday) => ({
        id: holiday.id,
        holidayName: holiday.holidayName,
        startDate: moment(holiday.fromDate),
        endDate: moment(holiday.toDate),
      }));
      setHolidays(holidaysData);
      form.setFieldsValue({ holidays: holidaysData });
    } catch (err) {
      console.error('Error fetching holidays:', err);
      message.error('Không thể tải danh sách ngày lễ.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHolidays();
  }, []);

  const handleAddHoliday = () => {
    if (!canCreate) {
      message.error('Bạn không có quyền tạo mới ngày lễ.');
      return;
    }
    const newHoliday = {
      id: `H${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`, // Temporary ID
      holidayName: '',
      startDate: null,
      endDate: null,
    };
    const updated = [...holidays, newHoliday];
    setHolidays(updated);
    form.setFieldsValue({ holidays: updated });
  };

  const handleHolidayChange = (index, field, value) => {
    const updated = [...holidays];
    updated[index][field] = value;
    setHolidays(updated);
    form.setFieldsValue({ holidays: updated });
  };

  const handleDeleteHoliday = (index) => {
    if (!canUpdate) {
      message.error('Bạn không có quyền xóa ngày lễ.');
      return;
    }
    const updated = holidays.filter((_, i) => i !== index);
    setHolidays(updated);
    form.setFieldsValue({ holidays: updated });
  };

  const handleEdit = () => {
    if (!canUpdate) {
      message.error('Bạn không có quyền chỉnh sửa ngày lễ.');
      return;
    }
    setIsEditing(true);
  };

  const handleCancel = () => {
    form.resetFields();
    fetchHolidays(); // Reload original data
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!isEditing || isLoading) return;
    if (!canUpdate) {
      message.error('Bạn không có quyền cập nhật ngày lễ.');
      return;
    }

    try {
      setIsLoading(true);
      const values = await form.validateFields();

      const formattedValues = values.holidays.map((holiday) => ({
        id: holiday.id,
        holidayName: holiday.holidayName,
        fromDate: holiday.startDate ? holiday.startDate.toISOString() : null,
        toDate: holiday.endDate ? holiday.endDate.toISOString() : null,
      }));

      const response = await axios.put('/api/Holiday', formattedValues);

      if (response.status === 200) {
        message.success('Cập nhật ngày lễ thành công!');
        setIsEditing(false);
        fetchHolidays(); // Refresh data
      } else {
        message.error(`Yêu cầu không thành công với mã trạng thái: ${response.status}`);
      }
    } catch (err) {
      if (err.errorFields) {
        message.error('Vui lòng nhập đầy đủ các trường bắt buộc!');
        return;
      }
      console.error('Holiday operation error:', err);
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
          /* Style for disabled Input */
          .ant-input-disabled {
            background-color: white !important;
            color: rgba(0, 0, 0, 0.85) !important;
            cursor: not-allowed;
          }

          /* Style for disabled DatePicker */
          .ant-picker-disabled .ant-picker-input > input {
            background-color: white !important;
            color: rgba(0, 0, 0, 0.85) !important;
            cursor: not-allowed;
          }

          .ant-picker-disabled {
            background-color: white !important;
          }
        `}
      </style>
      <Form form={form} layout="vertical">
        <Form.List name="holidays">
          {(fields) => (
            <>
              {fields.map(({ key, name, ...restField }, index) => (
                <Row gutter={[16, 16]} key={key} align="middle">
                  <Col xs={24} sm={12}>
                    <Form.Item
                      {...restField}
                      label="Tên ngày lễ"
                      name={[name, 'holidayName']}
                      rules={[{ required: true, message: 'Vui lòng nhập tên ngày lễ!' }]}
                    >
                      <Input
                        placeholder="Nhập tên ngày lễ"
                        style={{ width: '100%' }}
                        disabled={!isEditing}
                        onChange={(e) => handleHolidayChange(index, 'holidayName', e.target.value)}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={10}>
                    <Form.Item
                      label="Thời gian nghỉ"
                      required
                    >
                      <Row gutter={[8, 8]} style={{ flexWrap: 'nowrap' }} justify="start">
                        <Col xs={24} sm={12} style={{ display: 'flex', alignItems: 'center' }}>
                          <Form.Item
                            {...restField}
                            name={[name, 'startDate']}
                            rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu!' }]}
                            noStyle
                          >
                            <DatePicker
                              placeholder="Ngày bắt đầu"
                              disabled={!isEditing}
                              style={{ width: '100%' }}
                              onChange={(date) => handleHolidayChange(index, 'startDate', date)}
                              format="DD/MM/YYYY"
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} style={{ display: 'flex', alignItems: 'center' }}>
                          <Form.Item
                            {...restField}
                            name={[name, 'endDate']}
                            rules={[
                              { required: true, message: 'Vui lòng chọn ngày kết thúc!' },
                              ({ getFieldValue }) => ({
                                validator(_, value) {
                                  const startDate = getFieldValue(['holidays', name, 'startDate']);
                                  if (!startDate || !value || moment(value).isSameOrAfter(startDate)) {
                                    return Promise.resolve();
                                  }
                                  return Promise.reject(new Error('Ngày kết thúc phải sau hoặc bằng ngày bắt đầu!'));
                                },
                              }),
                            ]}
                            noStyle
                          >
                            <DatePicker
                              placeholder="Ngày kết thúc"
                              disabled={!isEditing}
                              style={{ width: '100%' }}
                              onChange={(date) => handleHolidayChange(index, 'endDate', date)}
                              format="DD/MM/YYYY"
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={2} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {isEditing && (
                      <DeleteButton onClick={() => handleDeleteHoliday(index)}>
                        Xóa
                      </DeleteButton>
                    )}
                  </Col>
                </Row>
              ))}
              {isEditing && (
                <Form.Item>
                  <AddButton onClick={handleAddHoliday} block>
                    Thêm mới ngày lễ
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

export default Holiday;