import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, message } from 'antd';
import Collapse from '../../../Shared/Collapse/Collapse';
import BHYTInfo from './Section/BHYTInfo';
import BHXHInfo from './Section/BHXHInfo';
import BHTNInfo from './Section/BHTNInfo';
import GeneralInfo from './Section/GeneralInfo';
import BasicInfo from './Section/BasicInfo';
import FooterBar from '../../Footer/Footer';
import moment from 'moment';
import axios from 'axios';
import debounce from 'lodash/debounce';
import './styles.css';

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

function CreateInsurance({ initialData, onSave, onCancel, isModalFooter = false, isEditMode = false, isViewMode = false, isIndividual = false }) {
  const [form] = Form.useForm();
  const [isSavedSuccessfully, setIsSavedSuccessfully] = useState(false);
  const [bhxhCode, setBhxhCode] = useState('');
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [permissions, setPermissions] = useState([]);
  const [insuranceRates, setInsuranceRates] = useState(null);
  const navigate = useNavigate();
  const selectedEmployee = Form.useWatch('fullName', form);

  // Format rate as "X% NLĐ / Y% DN"
  const formatRate = (empRate, businessRate) => {
    return `${empRate}% NLĐ / ${businessRate}% DN`;
  };

  const initialValues = useMemo(
    () => ({
      bhytCode: '',
      bhytRate: insuranceRates
        ? formatRate(insuranceRates.bhytEmpRate, insuranceRates.bhytBusinessRate)
        : '',
      bhytStartDate: moment(),
      bhxhStartDate: moment(),
      bhxhRate: insuranceRates
        ? formatRate(insuranceRates.bhxhEmpRate, insuranceRates.bhxhBusinessRate)
        : '',
      bhtnStartDate: moment(),
      bhtnRate: insuranceRates
        ? formatRate(insuranceRates.bhtnEmpRate, insuranceRates.bhtnBusinessRate)
        : '',
      bhEndDate: moment(),
      bhxhCode: '',
      fullName: null,
    }),
    [insuranceRates]
  );

  // Permission check
  useEffect(() => {
    const storedPermissions = JSON.parse(localStorage.getItem('permissions')) || [];
    setPermissions(storedPermissions);
  }, []);

  const hasAllModuleAuthority = permissions.some(
    (p) => p.moduleId === 'allModule' && p.actionId === 'fullAuthority'
  );
  const canCreateInsurance = hasAllModuleAuthority || permissions.some(
    (p) => p.moduleId === 'HrPersonel' && p.actionId === 'create'
  );
  const canUpdateInsurance = hasAllModuleAuthority || permissions.some(
    (p) => p.moduleId === 'profileInsurance' && p.actionId === 'update'
  ) || permissions.some(
    (p) => p.moduleId === 'HrPersonel' && p.actionId === 'update');

  // Fetch employees
  const fetchEmployees = useCallback(async () => {
    try {
      const response = await axios.get('/api/Employee/CodeNameEmployeeUnInsurance');
      setEmployees(response.data || []);
    } catch (err) {
      console.error('Error fetching employees without insurance:', err);
      message.error('Không thể tải danh sách nhân viên.');
      setEmployees([]);
    }
  }, []);

  // Fetch insurance rates
  const fetchInsuranceRates = useCallback(async () => {
    try {
      const response = await axios.get('/api/Employee/GetRateInsurance');
      if (response.status === 200) {
        setInsuranceRates(response.data);
        form.setFieldsValue({
          bhytRate: formatRate(response.data.bhytEmpRate, response.data.bhytBusinessRate),
          bhxhRate: formatRate(response.data.bhxhEmpRate, response.data.bhxhBusinessRate),
          bhtnRate: formatRate(response.data.bhtnEmpRate, response.data.bhtnBusinessRate),
        });
      } else {
        message.error('Không thể tải tỷ lệ bảo hiểm.');
      }
    } catch (err) {
      console.error('Error fetching insurance rates:', err);
      message.error('Không thể tải tỷ lệ bảo hiểm.');
    }
  }, [form]);

  useEffect(() => {
    if (!isEditMode && !isViewMode) {
      fetchEmployees();
    }
    fetchInsuranceRates();
  }, [fetchEmployees, fetchInsuranceRates, isEditMode, isViewMode]);

  useEffect(() => {
    if (initialData) {
      const fullName = initialData.employeeCode && initialData.fullName
        ? `${initialData.employeeCode} - ${initialData.fullName.split(' - ')[1] || initialData.fullName}`
        : initialData.fullName || null;
      const bhxhCodeFromBHYT = getBHXHCodeFromBHYT(initialData.bhytCode);
      setBhxhCode(initialData.bhxhCode || bhxhCodeFromBHYT);

      form.setFieldsValue({
        fullName,
        dateOfBirth: initialData.dateOfBirth ? moment(initialData.dateOfBirth, 'DD/MM/YYYY') : null,
        gender: initialData.gender,
        bhytCode: initialData.bhytCode || initialValues.bhytCode,
        bhytRate: initialData.bhytRate || initialValues.bhytRate,
        registeredHospital: initialData.registeredHospital,
        bhytStartDate: initialData.bhytStartDate
          ? moment(initialData.bhytStartDate, 'DD/MM/YYYY')
          : initialValues.bhytStartDate,
        hasJoined: initialData.hasJoined === 'Có tham gia' ? true : false,
        bhxhCode: initialData.bhxhCode || bhxhCodeFromBHYT,
        bhxhRate: initialData.bhxhRate || initialValues.bhxhRate,
        bhxhStartDate: initialData.bhxhStartDate
          ? moment(initialData.bhxhStartDate, 'DD/MM/YYYY')
          : initialValues.bhxhStartDate,
        bhtnRate: initialData.bhtnRate || initialValues.bhtnRate,
        bhtnStartDate: initialData.bhtnStartDate
          ? moment(initialData.bhtnStartDate, 'DD/MM/YYYY')
          : initialValues.bhtnStartDate,
        bhStatus: initialData.bhStatus,
        bhEndDate: initialData.bhEndDate
          ? moment(initialData.bhEndDate, 'DD/MM/YYYY')
          : initialValues.bhEndDate,
      });
    } else {
      form.setFieldsValue(initialValues);
      const code = getBHXHCodeFromBHYT(initialValues.bhytCode);
      setBhxhCode(code);
      form.setFieldsValue({ bhxhCode: code });
    }
  }, [initialData, form, initialValues]);

  const handleBHYTCodeChange = (changedValues, allValues) => {
    if (changedValues.bhytCode && !isViewMode) {
      const code = getBHXHCodeFromBHYT(changedValues.bhytCode);
      setBhxhCode(code);
      form.setFieldsValue({ bhxhCode: code });
    }
  };

  const getBHXHCodeFromBHYT = (bhytCode) => {
    if (!bhytCode) return '';
    const digits = bhytCode.replace(/\D/g, '');
    return digits.slice(-10);
  };

  const handleCancel = () => {
    if (typeof onCancel === 'function') {
      onCancel();
    } else {
      form.resetFields();
      setIsSavedSuccessfully(false);
    }
  };

  const parseRate = (rateString) => {
    if (!rateString) return { empRate: 0, businessRate: 0 };
    const [emp, business] = rateString.split(' / ').map(part => parseFloat(part.replace(/[^\d.]/g, '')) || 0);
    return { empRate: emp, businessRate: business };
  };

  const handleSave = async () => {
    if (isEditMode && !canUpdateInsurance) {
      message.error('Bạn không có quyền cập nhật thông tin bảo hiểm.');
      return;
    }
    if (!isEditMode && !canCreateInsurance) {
      message.error('Bạn không có quyền tạo thông tin bảo hiểm.');
      return;
    }

    try {
      setIsLoading(true);
      const formData = await form.validateFields();

      const employeeCode = formData.fullName ? formData.fullName.split(' - ')[0] : null;
      const nameEmployee = formData.fullName ? formData.fullName.split(' - ')[1] : null;

      const bhytRates = parseRate(formData.bhytRate);
      const bhxhRates = parseRate(formData.bhxhRate);
      const bhtnRates = parseRate(formData.bhtnRate);

      const dataToSend = {
        employeeCode: employeeCode,
        nameEmployee: nameEmployee,
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth ? formData.dateOfBirth.toISOString() : null,
        codeBHYT: formData.bhytCode || '',
        rateBHYTEmpt: bhytRates.empRate,
        rateBHYTBussiness: bhytRates.businessRate,
        registerMedical: formData.registeredHospital || '',
        dateStartParticipateBHYT: formData.bhytStartDate ? formData.bhytStartDate.toISOString() : null,
        hasBHXH: formData.hasJoined || false,
        codeBHXH: formData.bhxhCode || '',
        rateBHXHEmpt: bhxhRates.empRate,
        rateBHXHBussiness: bhxhRates.businessRate,
        dateStartParticipateBHXH: formData.bhxhStartDate ? formData.bhxhStartDate.toISOString() : null,
        rateBHTNEmpt: bhtnRates.empRate,
        rateBHTNBussiness: bhtnRates.businessRate,
        dateStartParticipateBHTN: formData.bhtnStartDate ? formData.bhtnStartDate.toISOString() : null,
        insuranceStatus: formData.bhStatus || '',
        dateEndParticipateInsurance: formData.bhEndDate ? formData.bhEndDate.toISOString() : null,
      };

      let response;
      let successMessage;

      if (isEditMode && !isIndividual) {
        response = await axios.put('/api/Employee/UpdateInsurance', dataToSend);
        successMessage = 'Cập nhật thông tin bảo hiểm thành công!';
      } else if (isEditMode && isIndividual) {
        response = await axios.put('/api/Employee/UpdateInsuranceIndividual', dataToSend);
        successMessage = 'Cập nhật thông tin bảo hiểm thành công!';
      }
      else {
        response = await axios.post('/api/Employee/CreateInsurance', dataToSend);
        successMessage = 'Tạo mới thông tin bảo hiểm thành công!';
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
        message.error(response.data.message || `${isEditMode ? 'Cập nhật' : 'Tạo'} thông tin bảo hiểm thất bại!`);
      }
    } catch (err) {
      if (err.errorFields) {
        message.error('Vui lòng nhập đầy đủ các trường bắt buộc!');
        return;
      }

      console.error(`${isEditMode ? 'Update' : 'Create'} insurance error:`, err);
      if (err.response) {
        const { status, data } = err.response;
        const { code, errors } = data || {};
        const errorMsg = errors?.[0] || data?.message || 'Không thể xử lý lỗi.';

        switch (status) {
          case 400:
            switch (code) {
              case 5:
                message.error('Yêu cầu không hợp lệ.');
                break;
              case 1022:
                message.error('Nhân viên không tồn tại! Vui lòng tạo thông tin cá nhân trước!');
                break;
              case 1025:
                message.error('Thông tin bảo hiểm đã tồn tại trong hệ thống!');
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
        message.error('Không thể kết nối đến server! Vui lòng kiểm tra kết nối mạng.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    navigate('/create/tax');
  };

  const handleBack = () => {
    navigate('/create/contract');
  };

  return (
    <div className="modal-content-wrapper" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        onValuesChange={handleBHYTCodeChange}
        style={{ flex: '1 auto', overflowY: 'auto' }}
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
                header: 'Thông tin BHYT',
                children: <BHYTInfo form={form} disabled={isViewMode} />,
              }}
            />
          </div>

          <div className="collapse-container">
            <Collapse
              item={{
                key: '3',
                header: 'Thông tin BHXH',
                children: <BHXHInfo bhxhCode={bhxhCode} form={form} disabled={isViewMode} />,
              }}
            />
          </div>

          <div className="collapse-container">
            <Collapse
              item={{
                key: '4',
                header: 'Thông tin BHTN',
                children: <BHTNInfo form={form} disabled={isViewMode} />,
              }}
            />
          </div>

          <div className="collapse-container">
            <Collapse
              item={{
                key: '5',
                header: 'Thông tin BH chung',
                children: <GeneralInfo form={form} disabled={isViewMode} />,
              }}
            />
          </div>
        </div>
      </Form>

      {!isViewMode && (
        <FooterBar
          onSave={handleSave}
          onCancel={handleCancel}
          onNext={handleNext}
          onBack={handleBack}
          showNext={!isModalFooter}
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

export default CreateInsurance;