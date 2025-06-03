import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, message } from 'antd';
import Collapse from '../../../Shared/Collapse/Collapse';
import BHYTInfo from './Section/BHYTInfo';
import BHXHInfo from './Section/BHXHInfo';
import BHTNInfo from './Section/BHTNInfo';
import GeneralInfo from './Section/GeneralInfo';
import FooterBar from '../../Footer/Footer';
import moment from 'moment';
import './styles.css';

function CreateInsurance({ initialData, onSave, onCancel, isModalFooter = false }) {
  const [form] = Form.useForm();
  const [isSavedSuccessfully, setIsSavedSuccessfully] = useState(false);
  const [bhxhCode, setBhxhCode] = useState('');
  const navigate = useNavigate();

  const initialValues = useMemo(
    () => ({
      bhytCode: 'DN-4-01 1234567890123',
      bhytRate: '1% NLĐ / 17% DN',
      bhytStartDate: moment(),
      bhxhStartDate: moment(),
      bhxhRate: '1% NLĐ / 17% DN',
      bhtnStartDate: moment(),
      bhtnRate: '1% NLĐ / 17% DN',
      bhEndDate: moment(),
      bhxhCode: '',
    }),
    []
  );

  useEffect(() => {
    if (initialData) {
      const bhxhCodeFromBHYT = getBHXHCodeFromBHYT(initialData.bhytCode);
      setBhxhCode(initialData.bhxhCode || bhxhCodeFromBHYT);
      form.setFieldsValue({
        bhytCode: initialData.bhytCode || initialValues.bhytCode,
        bhytRate: initialData.bhytRate || initialValues.bhytRate,
        registeredHospital: initialData.registeredHospital,
        bhytStartDate: initialData.bhytStartDate
          ? moment(initialData.bhytStartDate, 'DD/MM/YYYY')
          : initialValues.bhytStartDate,
        hasJoined: initialData.hasJoined,
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
    if (changedValues.bhytCode) {
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
    form.resetFields();
    setIsSavedSuccessfully(false);
  };

  const handleSave = () => {
    form
      .validateFields()
      .then(() => {
        const formData = form.getFieldsValue();
        const dataToSend = {
          bhytCode: formData.bhytCode,
          bhytRate: formData.bhytRate,
          registeredHospital: formData.registeredHospital,
          bhytStartDate: formData.bhytStartDate && moment.isMoment(formData.bhytStartDate)
            ? formData.bhytStartDate.format('DD/MM/YYYY')
            : null,
          hasJoined: formData.hasJoined,
          bhxhCode: formData.bhxhCode,
          bhxhRate: formData.bhxhRate,
          bhxhStartDate: formData.bhxhStartDate && moment.isMoment(formData.bhxhStartDate)
            ? formData.bhxhStartDate.format('DD/MM/YYYY')
            : null,
          bhtnRate: formData.bhtnRate,
          bhtnStartDate: formData.bhtnStartDate && moment.isMoment(formData.bhtnStartDate)
            ? formData.bhtnStartDate.format('DD/MM/YYYY')
            : null,
          bhStatus: formData.bhStatus,
          bhEndDate: formData.bhEndDate && moment.isMoment(formData.bhEndDate)
            ? formData.bhEndDate.format('DD/MM/YYYY')
            : null,
        };

        console.log('Data to send: ', dataToSend);
        setIsSavedSuccessfully(true);

        if (typeof onSave === 'function') {
          onSave(dataToSend);
          message.success('Cập nhật thông tin bảo hiểm thành công!');
        } else {
          message.success('Tạo mới thông tin bảo hiểm thành công!');
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
      navigate('/create/tax');
    }
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
        style={{ flex: '1 1 auto', overflowY: 'auto' }}
      >
        <div className="scroll-container">
          <div className="collapse-container">
            <Collapse
              item={{
                key: '1',
                header: 'Thông tin BHYT',
                children: <BHYTInfo form={form} />,
              }}
            />
          </div>

          <div className="collapse-container">
            <Collapse
              item={{
                key: '2',
                header: 'Thông tin BHXH',
                children: <BHXHInfo bhxhCode={bhxhCode} form={form} />,
              }}
            />
          </div>

          <div className="collapse-container">
            <Collapse
              item={{
                key: '3',
                header: 'Thông tin BHTN',
                children: <BHTNInfo form={form} />,
              }}
            />
          </div>

          <div className="collapse-container">
            <Collapse
              item={{
                key: '4',
                header: 'Thông tin BH chung',
                children: <GeneralInfo form={form} />,
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

export default CreateInsurance;