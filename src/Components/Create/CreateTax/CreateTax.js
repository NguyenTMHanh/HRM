import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, message } from 'antd';
import TaxInfo from './Section/TaxInfo';
import Dependent from './Section/Dependent';
import Collapse from '../../../Shared/Collapse/Collapse';
import FooterBar from '../../Footer/Footer';
import moment from 'moment';
import axios from 'axios';
import BasicInfo from './Section/BasicInfo';

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

function CreateTax({ initialData, onSave, onCancel, isModalFooter = false, isEditMode = false, isViewMode = false }) {
  const [form] = Form.useForm();
  const [isSavedSuccessfully, setIsSavedSuccessfully] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const initialValues = useMemo(
    () => ({
      hasTax: false,
      taxCode: '',
      dependents: [],
      fullName: null,
      gender: null,
      dateOfBirth: null,
    }),
    []
  );

  // Permission check
  useEffect(() => {
    const storedPermissions = JSON.parse(localStorage.getItem('permissions')) || [];
    setPermissions(storedPermissions);
  }, []);

  const hasAllModuleAuthority = permissions.some(
    (p) => p.moduleId === 'allModule' && p.actionId === 'fullAuthority'
  );
  const canCreateTax = hasAllModuleAuthority || permissions.some(
    (p) => p.moduleId === 'profileTax' && p.actionId === 'create'
  );
  const canUpdateTax = hasAllModuleAuthority || permissions.some(
    (p) => p.moduleId === 'profileTax' && p.actionId === 'update'
  );

  // Fetch employees without tax information
  const fetchEmployees = useCallback(async () => {
    try {
      const response = await axios.get('/api/Employee/CodeNameEmployeeUnTax');
      setEmployees(response.data || []);
    } catch (err) {
      console.error('Error fetching employees without tax info:', err);
      message.error('Không thể tải danh sách nhân viên.');
      setEmployees([]);
    }
  }, []);

  useEffect(() => {
    if (!isEditMode && !isViewMode) {
      fetchEmployees();
    }
  }, [fetchEmployees, isEditMode, isViewMode]);

  useEffect(() => {
    if (initialData) {
      const fullName = initialData.employeeCode && initialData.fullName
        ? `${initialData.employeeCode} - ${initialData.fullName.split(' - ')[1] || initialData.fullName}`
        : initialData.fullName || null;

      const formValues = {
        fullName,
        dateOfBirth: initialData.dateOfBirth ? moment(initialData.dateOfBirth, 'DD/MM/YYYY') : null,
        gender: initialData.gender,
        hasTax: initialData.hasTax || initialValues.hasTax,
        taxCode: initialData.taxCode || initialValues.taxCode,
        dependents: initialData.dependents
          ? initialData.dependents.map((dependent) => ({
              registered: dependent.registered || '',
              taxCode: dependent.taxCode || '',
              fullName: dependent.fullName || '',
              birthDate: dependent.birthDate ? moment(dependent.birthDate, 'DD/MM/YYYY') : null,
              relationship: dependent.relationship || '',
              proofFile: dependent.proofFile || [],
            }))
          : initialValues.dependents,
      };

      form.setFieldsValue(formValues);
    } else {
      form.setFieldsValue(initialValues);
    }
  }, [initialData, form, initialValues]);

  const handleCancel = () => {
    if (typeof onCancel === 'function') {
      onCancel();
    } else {
      form.resetFields();
      setIsSavedSuccessfully(false);
    }
  };

  const handleSave = async () => {
    if (isEditMode && !canUpdateTax) {
      message.error('Bạn không có quyền cập nhật thông tin thuế.');
      return;
    }
    if (!isEditMode && !canCreateTax) {
      message.error('Bạn không có quyền tạo thông tin thuế.');
      return;
    }

    try {
      setIsLoading(true);
      const formData = await form.validateFields();

      const employeeCode = formData.fullName ? formData.fullName.split(' - ')[0] : null;
      const nameEmployee = formData.fullName ? formData.fullName.split(' - ')[1] : null;

      const processedDependents = formData.dependents
        ? formData.dependents.map((dependent) => ({
            registerDependentStatus: dependent.registered || '',
            taxCode: dependent.taxCode || '',
            nameDependent: dependent.fullName || '',
            dayOfBirthDependent: dependent.birthDate ? dependent.birthDate.toISOString() : null,
            relationship: dependent.relationship || '',
            evidencePath: dependent.proofFile && dependent.proofFile.length > 0
              ? dependent.proofFile[0].fileId || dependent.proofFile // Sử dụng fileId nếu có
              : '',
          }))
        : [];

      const dataToSend = {
        employeeCode: employeeCode || '',
        nameEmployee: nameEmployee || '',
        gender: formData.gender || '',
        dateOfBirth: formData.dateOfBirth ? formData.dateOfBirth.toISOString() : null,
        hasTaxCode: formData.hasTax || false,
        taxCode: formData.taxCode || '',
        dependents: processedDependents,
      };

      console.log('data send: ', dataToSend);
      let response;
      let successMessage;

      if (isEditMode) {
        response = await axios.put('/api/Employee/UpdateTax', dataToSend);
        successMessage = 'Cập nhật thông tin thuế thành công!';
      } else {
        response = await axios.post('/api/Employee/CreateTax', dataToSend);
        successMessage = 'Tạo mới thông tin thuế thành công!';
      }

      if (response.status === 200 && response.data.code === 0) {
        message.success(successMessage);
        setIsSavedSuccessfully(true);
        if (!isEditMode) {
          form.resetFields();
          fetchEmployees();
        }
        if (typeof onSave === 'function') {
          onSave(dataToSend);
        }
      } else {
        message.error(response.data.message || `${isEditMode ? 'Cập nhật' : 'Tạo'} thông tin thuế thất bại!`);
      }
    } catch (err) {
      if (err.errorFields) {
        message.error('Vui lòng nhập đầy đủ các trường bắt buộc!');
        return;
      }

      console.error(`${isEditMode ? 'Update' : 'Create'} tax info error:`, err);
      if (err.response) {
        const { status, data } = err.response;
        const { code, errors } = data || {};
        const errorMsg = errors?.[0] || data?.message || 'Không thể xử lý yêu cầu.';

        switch (status) {
          case 400:
            switch (code) {
              case 1022:
                message.error('Nhân viên không tồn tại! Vui lòng tạo thông tin cá nhân trước!');
                break;
              case 1026:
                message.error('Thông tin thuế đã tồn tại trong hệ thống!');
                break;
              default:
                message.error(errorMsg);
                break;
            }
            break;
          case 401:
            message.error('Bạn không có quyền thực hiện hành động này!');
            break;
          case 500:
            message.error('Lỗi server! Vui lòng thử lại sau!');
            break;
          default:
            message.error(`Lỗi không xác định với mã trạng thái: ${status}`);
            break;
        }
      } else {
        message.error('Không thể kết nối đến server! Vui lòng kiểm tra kết nối mạng!');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/create/insurance');
  };

  return (
    <div className="modal-content-wrapper" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        style={{ flex: '1 1 auto', overflowY: 'auto' }}
        disabled={isViewMode}
      >
        <div className="scroll-container">
          <div className="collapse-container">
            <Collapse
              item={{
                key: '1',
                header: 'Thông tin cơ bản',
                children: (
                  <BasicInfo
                    form={form}
                    initialData={initialData}
                    employees={employees}
                    isModalFooter={isModalFooter}
                    isEditMode={isEditMode}
                    disabled={isViewMode}
                  />
                ),
              }}
            />
          </div>

          <div className="collapse-container">
            <Collapse
              item={{
                key: '2',
                header: 'Thông tin Thuế TNCN',
                children: <TaxInfo form={form} disabled={isViewMode} />,
              }}
            />
          </div>

          <div className="collapse-container">
            <Collapse
              item={{
                key: '3',
                header: 'Thông tin người phụ thuộc',
                children: <Dependent form={form} disabled={isViewMode} />,
              }}
            />
          </div>
        </div>
      </Form>

      {!isViewMode && (
        <FooterBar
          onSave={handleSave}
          onCancel={handleCancel}
          onBack={handleBack}
          showBack={!isModalFooter}
          showCancel={true}
          showSave={true}
          isModalFooter={isModalFooter}
          loading={isLoading}
          style={{ flexShrink: 0 }}
        />
      )}
    </div>
  );
}

export default CreateTax;