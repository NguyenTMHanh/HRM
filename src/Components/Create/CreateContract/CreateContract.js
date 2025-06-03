import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, message } from 'antd';
import Collapse from '../../../Shared/Collapse/Collapse';
import Allowance from './Section/Allowance';
import ContractInfo from './Section/ContractInfo';
import FooterBar from '../../Footer/Footer';
import moment from 'moment';
import './styles.css';

function CreateContract({ initialData, onSave, isModalFooter = false }) {
  const [form] = Form.useForm();
  const [isSavedSuccessfully, setIsSavedSuccessfully] = useState(false);
  const navigate = useNavigate();

  const initialValues = {
    contractId: '20250203/HĐCTV-PRI-0058',
    startDate: moment(),
    hourlyWage: '25 000 VNĐ',
    workHoursPerDay: '8 giờ/ngày',
    position: 'Nhân viên nhân sự',
    salaryCoefficient: '1.5',
    standardWorkingDays: '25 ngày',
    basicSalary: '7 500 000 VNĐ',
    allowances: [],
  };

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue({
        contractId: initialData.contractId || initialValues.contractId,
        contractType: initialData.contractType,
        startDate: initialData.startDate
          ? moment(initialData.startDate, 'DD/MM/YYYY')
          : initialValues.startDate,
        endDate: initialData.endDate
          ? moment(initialData.endDate, 'DD/MM/YYYY')
          : null,
        status: initialData.status,
        hourlyWage: initialData.hourlyWage || initialValues.hourlyWage,
        workHoursPerDay: initialData.workHoursPerDay || initialValues.workHoursPerDay,
        position: initialData.position || initialValues.position,
        salaryCoefficient: initialData.salaryCoefficient || initialValues.salaryCoefficient,
        standardWorkingDays: initialData.standardWorkingDays || initialValues.standardWorkingDays,
        basicSalary: initialData.basicSalary || initialValues.basicSalary,
        allowances: initialData.allowances || initialValues.allowances,
      });
    } else {
      form.setFieldsValue(initialValues);
    }
  }, [initialData, form]);

  const handleCancel = () => {
    form.resetFields();
    setIsSavedSuccessfully(false);
  };

  const handleSave = () => {
    form
      .validateFields()
      .then(() => {
        const formData = form.getFieldsValue();

        const dataToSend = {
          contractId: formData.contractId,
          contractType: formData.contractType,
          startDate: formData.startDate && moment.isMoment(formData.startDate)
            ? formData.startDate.format('DD/MM/YYYY')
            : null,
          endDate: formData.endDate && moment.isMoment(formData.endDate)
            ? formData.endDate.format('DD/MM/YYYY')
            : null,
          status: formData.status,
          hourlyWage: formData.hourlyWage,
          workHoursPerDay: formData.workHoursPerDay,
          position: formData.position,
          salaryCoefficient: formData.salaryCoefficient,
          standardWorkingDays: formData.standardWorkingDays,
          basicSalary: formData.basicSalary,
          allowances: formData.allowances || [],
        };

        console.log('Data to send: ', dataToSend);
        setIsSavedSuccessfully(true);

        if (typeof onSave === 'function') {
          onSave(dataToSend);
          message.success('Cập nhật thông tin hợp đồng thành công!');
        } else {
          message.success('Tạo mới thông tin hợp đồng thành công!');
        }
      })
      .catch((errorInfo) => {
        message.error('Lưu thất bại! Vui lòng nhập đầy đủ các trường bắt buộc.');
        console.log('Error saving data: ', errorInfo);
        setIsSavedSuccessfully(false);
      });
  };

  const handleNext = () => {
    if (isSavedSuccessfully) {
      navigate('/create/insurance');
    }
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
      >
        <div className="scroll-container">
          <div className="collapse-container">
            <Collapse
              item={{
                key: '1',
                header: 'Thông tin HĐLĐ',
                children: <ContractInfo form={form} />,
              }}
            />
          </div>
          <div className="collapse-container">
            <Collapse
              item={{
                key: '2',
                header: 'Thông tin phụ cấp',
                children: <Allowance form={form} />,
              }}
            />
          </div>
        </div>
      </Form>

      <FooterBar
        onSave={handleSave}
        onCancel={handleCancel}
        onNext={handleNext}
        onBack={handleBack}
        showNext={true}
        showBack={!isModalFooter}
        showCancel={true}
        showSave={true}
        isModalFooter={isModalFooter}
        style={{ flexShrink: 0 }}
      />
    </div>
  );
}

export default CreateContract;