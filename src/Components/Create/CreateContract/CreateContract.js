import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, message } from 'antd';
import Collapse from '../../../Shared/Collapse/Collapse';
import Allowance from './Section/Allowance';
import ContractInfo from './Section/ContractInfo';
import BasicInfo from './Section/BasicInfo';
import FooterBar from '../../Footer/Footer';
import moment from 'moment';
import axios from 'axios';
import debounce from 'lodash/debounce';
import './styles.css';

// Custom function to format numbers with spaces as thousand separators
const formatWithSpaces = (number) => {
  if (number == null) return undefined;
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

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

function CreateContract({ initialData, onSave, onCancel, isModalFooter = false, isEditMode = false, isViewMode = false, isIndividual = false }) {
  const [form] = Form.useForm();
  const [isSavedSuccessfully, setIsSavedSuccessfully] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const selectedEmployee = Form.useWatch('fullName', form);
  const [permissions, setPermissions] = useState([]);

  const initialValues = {
    startDate: moment(),
    hourlyWage: undefined,
    workHoursPerDay: undefined,
    standardWorkingDays: undefined,
    basicSalary: undefined,
    allowances: [],
  };

  // Permission check
  useEffect(() => {
    const storedPermissions = JSON.parse(localStorage.getItem('permissions')) || [];
    setPermissions(storedPermissions);
  }, []);

  const hasAllModuleAuthority = permissions.some(
    (p) => p.moduleId === 'allModule' && p.actionId === 'fullAuthority'
  );
  const canCreateContract = hasAllModuleAuthority || permissions.some(
    (p) => p.moduleId === 'HrPersonel' && p.actionId === 'create'
  );
  const canUpdateContract = hasAllModuleAuthority || permissions.some(
    (p) => p.moduleId === 'profileContract' && p.actionId === 'update'
  ) || permissions.some(
    (p) => p.moduleId === 'HrPersonel' && p.actionId === 'update');


  const fetchEmployees = useCallback(async () => {
    try {
      const response = await axios.get('/api/Employee/CodeNameEmployeeUnContract');
      setEmployees(response.data);
    } catch (err) {
      console.error('Error fetching employees:', err);
      message.error('Không thể tải danh sách nhân viên.');
    }
  }, [isEditMode]);

  const fetchContractCode = useCallback(async (employeeCode) => {
    try {
      const response = await axios.get('/api/Employee/GetCodeContract', {
        params: { employeeCode },
      });
      if (response.status === 200) {
        form.setFieldsValue({
          contractId: response.data,
        });
      } else {
        message.error('Không thể tải mã số hợp đồng lao động.');
        form.setFieldsValue({
          contractId: undefined,
        });
      }
    } catch (err) {
      console.error('Error fetching contract code:', err);
      message.error('Không thể tải mã số hợp đồng lao động.');
      form.setFieldsValue({
        contractId: undefined,
      });
    }
  }, [form]);

  const fetchPositionAndCoefficient = useCallback(async (employeeCode) => {
    try {
      const response = await axios.get('/api/Employee/GetPositionCoefficientEmployee', {
        params: { employeeCode },
      });
      if (response.status === 200 && response.data && typeof response.data === 'object') {
        const {
          positionName,
          coefficient,
          hourlySalary,
          dayWorkStandard,
          hourWorkStandard,
          basicSalary,
        } = response.data;

        form.setFieldsValue({
          position: positionName || undefined,
          salaryCoefficient: coefficient != null ? coefficient.toString() : undefined,
          hourlyWage: hourlySalary != null ? `${formatWithSpaces(hourlySalary)} VNĐ` : undefined,
          workHoursPerDay: hourWorkStandard != null ? `${hourWorkStandard} giờ/ngày` : undefined,
          standardWorkingDays: dayWorkStandard != null ? `${dayWorkStandard} ngày` : undefined,
          basicSalary: basicSalary != null ? `${formatWithSpaces(basicSalary)} VNĐ` : undefined,
        });
      } else {
        message.error('Không thể tải thông tin vị trí và lương.');
        form.setFieldsValue({
          position: undefined,
          salaryCoefficient: undefined,
          hourlyWage: undefined,
          workHoursPerDay: undefined,
          standardWorkingDays: undefined,
          basicSalary: undefined,
        });
      }
    } catch (err) {
      console.error('Error fetching position and coefficient:', err);
      message.error('Không thể tải thông tin vị trí và lương.');
      form.setFieldsValue({
        position: undefined,
        salaryCoefficient: undefined,
        hourlyWage: undefined,
        workHoursPerDay: undefined,
        standardWorkingDays: undefined,
        basicSalary: undefined,
      });
    }
  }, [form]);

  const debouncedFetch = useMemo(
    () =>
      debounce((employeeCode) => {
        if (employeeCode) {
          if (!isEditMode && !isViewMode) {
            fetchContractCode(employeeCode);
            fetchPositionAndCoefficient(employeeCode);
          }
        } else {
          form.setFieldsValue({
            contractId: undefined,
            position: undefined,
            salaryCoefficient: undefined,
            hourlyWage: undefined,
            workHoursPerDay: undefined,
            standardWorkingDays: undefined,
            basicSalary: undefined,
          });
        }
      }, 300),
    [fetchContractCode, fetchPositionAndCoefficient, form, isEditMode, initialData]
  );

  useEffect(() => {
    if (!isEditMode) {
      fetchEmployees();
    }
  }, [fetchEmployees, isEditMode]);

  useEffect(() => {
    if (!isEditMode && selectedEmployee && typeof selectedEmployee === 'string') {
      const employeeCode = selectedEmployee.split(' - ')[0];
      debouncedFetch(employeeCode);
    } else if (!isEditMode) {
      debouncedFetch(null);
    }

    return () => {
      debouncedFetch.cancel();
    };
  }, [selectedEmployee, debouncedFetch, isEditMode]);

  useEffect(() => {
    if (initialData) {
      const fullName = initialData.employeeCode && initialData.fullName
        ? `${initialData.employeeCode} - ${initialData.fullName.split(" - ")[1] || initialData.fullName}`
        : null;

      const parseFormattedValue = (formattedValue) => {
        if (!formattedValue) return undefined;
        return formattedValue.toString().replace(/[^\d.]/g, '');
      };

      form.setFieldsValue({
        fullName,
        dateOfBirth: initialData.dateOfBirth ? moment(initialData.dateOfBirth, "DD/MM/YYYY") : null,
        gender: initialData.gender === 'Nữ' ? 'Female' : initialData.gender === 'Nam' ? 'Male' : initialData.gender,
        contractId: initialData.contractId,
        contractType: initialData.contractType,
        startDate: initialData.startDate
          ? moment(initialData.startDate, 'DD/MM/YYYY')
          : initialValues.startDate,
        endDate: initialData.endDate
          ? moment(initialData.endDate, 'DD/MM/YYYY')
          : null,
        status: initialData.status,
        hourlyWage: parseFormattedValue(initialData.hourlyWage),
        workHoursPerDay: parseFormattedValue(initialData.workHoursPerDay),
        position: initialData.position,
        salaryCoefficient: parseFormattedValue(initialData.salaryCoefficient),
        standardWorkingDays: parseFormattedValue(initialData.standardWorkingDays),
        basicSalary: parseFormattedValue(initialData.basicSalary),
        allowances: initialData.allowances?.map(allowance => ({
          name: allowance.name,
          amount: parseFormattedValue(allowance.amount)
        })) || initialValues.allowances,
      });
    } else {
      form.setFieldsValue(initialValues);
    }
  }, [initialData, form]);

  const handleCancel = () => {
    if (typeof onCancel === "function") {
      onCancel();
    } else {
      form.resetFields();
      setIsSavedSuccessfully(false);
    }
  };

  const parseNumber = (value) => {
    if (!value) return 0;
    return parseFloat(value.toString().replace(/[^\d.]/g, '')) || 0;
  };

  const handleSave = async () => {
    // Check permissions based on mode
    if (isEditMode && !canUpdateContract) {
      message.error('Bạn không có quyền cập nhật hợp đồng lao động.');
      return;
    }

    if (!isEditMode && !canCreateContract) {
      message.error('Bạn không có quyền tạo hợp đồng lao động.');
      return;
    }

    try {
      setIsLoading(true);
      const formData = await form.validateFields();

      const employeeCode = formData.fullName ? formData.fullName.split(' - ')[0] : null;
      const nameEmployee = formData.fullName ? formData.fullName.split(' - ')[1] : null;

      const dataToSend = {
        employeeCode,
        nameEmployee,
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth ? formData.dateOfBirth.toISOString() : null,
        codeContract: formData.contractId,
        typeContract: formData.contractType === 'HĐLĐ không xác định thời hạn' ? 'NoLimitedContract' : formData.contractType === 'HĐLĐ xác định thời hạn' ? 'LimitedContract' : formData.contractType,
        startContract: formData.startDate ? formData.startDate.toISOString() : null,
        endContract: formData.endDate ? formData.endDate.toISOString() : null,
        statusContract: formData.status === 'Còn hiệu lực' ? 'Valid' : formData.status === 'Hết hiệu lực' ? 'expire' : formData.status,
        hourlySalary: parseNumber(formData.hourlyWage),
        hourWorkStandard: parseNumber(formData.workHoursPerDay),
        namePosition: formData.position,
        coefficientSalary: parseNumber(formData.salaryCoefficient),
        dayWorkStandard: parseNumber(formData.standardWorkingDays),
        basicSalary: parseNumber(formData.basicSalary),
        allowances: (formData.allowances || []).map((allowance) => ({
          nameAllowance: allowance.name,
          moneyAllowance: parseNumber(allowance.amount),
        })),
      };

      console.log('Data to send:', dataToSend);

      let response;
      let successMessage;

      if (isEditMode && !isIndividual) {
        response = await axios.put('/api/Employee/UpdateContract', dataToSend);
        successMessage = 'Cập nhật hợp đồng lao động thành công!';
      } else if (isEditMode && isIndividual) {
        response = await axios.put('/api/Employee/UpdateContractIndividual', dataToSend);
        successMessage = 'Cập nhật hợp đồng lao động thành công!';
      }
      else {
        response = await axios.post('/api/Employee/CreateContract', dataToSend);
        successMessage = 'Tạo mới hợp đồng lao động thành công!';
      }

      if (response.status === 200 && response.data.code === 0) {
        message.destroy();
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
        message.destroy();
        message.error(response.data.message || `${isEditMode ? 'Cập nhật' : 'Tạo'} hợp đồng lao động thất bại!`);
      }
    } catch (err) {
      message.destroy();
      if (err.errorFields) {
        message.error('Vui lòng nhập đầy đủ các trường bắt buộc!');
        return;
      }

      console.error(`${isEditMode ? 'Update' : 'Create'} contract employee error:`, err);
      if (err.response) {
        const { status, data } = err.response;
        const { code, errors } = data || {};
        const errorMsg = errors?.[0] || data?.message || 'Không thể xử lý yêu cầu.';

        switch (status) {
          case 400:
            switch (code) {
              case 5:
                message.error('Yêu cầu không hợp lệ.');
                break;
              case 1022:
                message.error('Nhân viên không tồn tại! Vui lòng tạo thông tin cá nhân trước!');
                break;
              case 1024:
                message.error('Hợp đồng lao động đã tồn tại trong hệ thống!');
                break;
              case 1019:
                message.error('Vị trí không tồn tại!');
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
        console.error('Network error:', err.message);
        message.error('Không thể kết nối đến server! Vui lòng kiểm tra kết nối mạng!');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    navigate('/create/insurance');
  };

  const handleBack = () => {
    navigate('/create/personel');
  };

  return (
    <div className="modal-content-wrapper" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        style={{ flex: '1 1 auto', overflowY: 'auto' }}
        disabled={isViewMode} // Disable form when in view mode
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
                    disabled={isViewMode} // Pass disabled prop to BasicInfo
                  />
                ),
              }}
            />
          </div>

          <div className="collapse-container">
            <Collapse
              item={{
                key: '2',
                header: 'Thông tin HĐLĐ',
                children: (
                  <ContractInfo
                    form={form}
                    disabled={isViewMode} // Pass disabled prop to ContractInfo
                  />
                ),
              }}
            />
          </div>
          <div className="collapse-container">
            <Collapse
              item={{
                key: '3',
                header: 'Thông tin phụ cấp',
                children: (
                  <Allowance
                    form={form}
                    disabled={isViewMode} // Pass disabled prop to Allowance
                  />
                ),
              }}
            />
          </div>
        </div>
      </Form>

      {!isViewMode && ( // Hide FooterBar in view mode, similar to CreatePersonel
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

export default CreateContract;