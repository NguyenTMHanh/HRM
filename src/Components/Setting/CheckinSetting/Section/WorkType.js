import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Input, InputNumber, message, Button } from 'antd';
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

const WorkType = () => {
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [workTypes, setWorkTypes] = useState([]);
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

  // Fetch job types from API
  const fetchWorkTypes = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/api/JobType');
      const jobTypes = response.data.map((jobType) => ({
        id: jobType.id,
        workTypeName: jobType.nameJobType,
        minWorkHours: jobType.workHourMinimum,
        minWorkMinutes: jobType.workMinuteMinimum,
      }));
      setWorkTypes(jobTypes);
      form.setFieldsValue({ workTypes: jobTypes });
    } catch (err) {
      console.error('Error fetching job types:', err);
      message.error('Không thể tải danh sách loại hình làm việc.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkTypes();
  }, []);

  const handleAddWorkType = () => {
    if (!canCreate) {
      message.error('Bạn không có quyền tạo mới loại hình làm việc.');
      return;
    }
    const newWorkType = {
      id: `W${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`, // Temporary ID
      workTypeName: '',
      minWorkHours: 0,
      minWorkMinutes: 0,
    };
    const updated = [...workTypes, newWorkType];
    setWorkTypes(updated);
    form.setFieldsValue({ workTypes: updated });
  };

  const handleWorkTypeChange = (index, field, value) => {
    const updated = [...workTypes];
    updated[index][field] = value;
    setWorkTypes(updated);
    form.setFieldsValue({ workTypes: updated });
  };

  const handleDeleteWorkType = (index) => {
    if (!canUpdate) {
      message.error('Bạn không có quyền xóa loại hình làm việc.');
      return;
    }
    const updated = workTypes.filter((_, i) => i !== index);
    setWorkTypes(updated);
    form.setFieldsValue({ workTypes: updated });
  };

  const handleEdit = () => {
    if (!canUpdate) {
      message.error('Bạn không có quyền chỉnh sửa loại hình làm việc.');
      return;
    }
    setIsEditing(true);
  };

  const handleCancel = () => {
    fetchWorkTypes(); 
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!isEditing || isLoading) return;
    if (!canUpdate) {
      message.error('Bạn không có quyền cập nhật loại hình làm việc.');
      return;
    }

    try {
      setIsLoading(true);
      const values = await form.validateFields();

      const formattedValues = values.workTypes.map((workType) => ({
        id: workType.id,
        nameJobType: workType.workTypeName,
        workHourMinimum: workType.minWorkHours || 0,
        workMinuteMinimum: workType.minWorkMinutes || 0,
      }));

      const response = await axios.put('/api/JobType', formattedValues);

      if (response.status === 200) {
        message.success('Cập nhật loại hình làm việc thành công!');
        setIsEditing(false);
        fetchWorkTypes(); // Refresh data
      } else {
        message.error(`Yêu cầu không thành công với mã trạng thái: ${response.status}`);
      }
    } catch (err) {
      if (err.errorFields) {
        message.error('Vui lòng nhập đầy đủ các trường bắt buộc!');
        return;
      }
      console.error('Job type operation error:', err);
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

          /* Style for disabled InputNumber */
          .ant-input-number-disabled .ant-input-number-input {
            background-color: white !important;
            color: rgba(0, 0, 0, 0.85) !important;
            cursor: not-allowed;
          }

          .ant-input-number-disabled {
            background-color: white !important;
          }
        `}
      </style>
      <Form form={form} layout="vertical">
        <Form.List name="workTypes">
          {(fields) => (
            <>
              {fields.map(({ key, name, ...restField }, index) => (
                <Row gutter={[16, 16]} key={key} align="middle">
                  <Col xs={24} sm={12}>
                    <Form.Item
                      {...restField}
                      label="Tên loại hình làm việc"
                      name={[name, 'workTypeName']}
                      rules={[{ required: true, message: 'Vui lòng nhập tên loại hình làm việc!' }]}
                    >
                      <Input
                        placeholder="Nhập tên loại hình làm việc"
                        style={{ width: '100%' }}
                        disabled={!isEditing}
                        onChange={(e) => handleWorkTypeChange(index, 'workTypeName', e.target.value)}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={10}>
                    <Form.Item
                      label="Thời gian làm việc tối thiểu"
                      required
                    >
                      <Row gutter={[8, 8]} style={{ flexWrap: 'nowrap' }} justify="start">
                        <Col xs={24} sm={12} style={{ display: 'flex', alignliwy: 'center' }}>
                          <Form.Item
                            {...restField}
                            name={[name, 'minWorkHours']}
                            rules={[{ required: true, message: 'Vui lòng nhập số giờ!' }]}
                            noStyle
                          >
                            <InputNumber
                              min={0}
                              max={23}
                              placeholder="Giờ"
                              disabled={!isEditing}
                              style={{ width: '100%' }}
                              onChange={(value) => handleWorkTypeChange(index, 'minWorkHours', value)}
                            />
                          </Form.Item>
                          <span style={{ margin: '0 8px', whiteSpace: 'nowrap' }}>giờ</span>
                        </Col>
                        <Col xs={24} sm={12} style={{ display: 'flex', alignItems: 'center' }}>
                          <Form.Item
                            {...restField}
                            name={[name, 'minWorkMinutes']}
                            rules={[{ required: true, message: 'Vui lòng nhập số phút!' }]}
                            noStyle
                          >
                            <InputNumber
                              min={0}
                              max={59}
                              placeholder="Phút"
                              disabled={!isEditing}
                              style={{ width: '100%' }}
                              onChange={(value) => handleWorkTypeChange(index, 'minWorkMinutes', value)}
                            />
                          </Form.Item>
                          <span style={{ margin: '0 8px', whiteSpace: 'nowrap' }}>phút</span>
                        </Col>
                      </Row>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={2} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {isEditing && (
                      <DeleteButton onClick={() => handleDeleteWorkType(index)}>
                        Xóa
                      </DeleteButton>
                    )}
                  </Col>
                </Row>
              ))}
              {isEditing && (
                <Form.Item>
                  <AddButton onClick={handleAddWorkType} block>
                    Thêm mới loại hình làm việc
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

export default WorkType;