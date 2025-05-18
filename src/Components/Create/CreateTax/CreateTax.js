import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, message } from 'antd';
import TaxInfo from './Section/TaxInfo';
import Dependent from './Section/Dependent';
import Collapse from '../../../Shared/Collapse/Collapse';
import FooterBar from '../../Footer/Footer';
import moment from 'moment';

function CreateTax({ initialData, onSave, onCancel, isModalFooter = false }) {
  const [form] = Form.useForm();
  const [isSavedSuccessfully, setIsSavedSuccessfully] = useState(false);
  const navigate = useNavigate();

  const initialValues = useMemo(
    () => ({
      hasTax: false,
      taxCode: '',
      dependents: [],
    }),
    []
  );

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue({
        hasTax: initialData.hasTax || initialValues.hasTax,
        taxCode: initialData.taxCode || initialValues.taxCode,
        dependents: initialData.dependents
          ? initialData.dependents.map((dependent) => ({
              registered: dependent.registered,
              taxCode: dependent.taxCode,
              fullName: dependent.fullName,
              birthDate: dependent.birthDate
                ? moment(dependent.birthDate, 'YYYY-MM-DD')
                : null,
              relationship: dependent.relationship,
              proofFile: dependent.proofFile || [],
            }))
          : initialValues.dependents,
      });
    } else {
      form.setFieldsValue(initialValues);
    }
  }, [initialData, form, initialValues]);

  const handleCancel = () => {
    form.resetFields();
    setIsSavedSuccessfully(false);
  };

  const handleSave = () => {
    form
      .validateFields()
      .then(() => {
        const formData = form.getFieldsValue();

        const processedDependents = formData.dependents
          ? formData.dependents.map((dependent) => ({
              registered: dependent.registered,
              taxCode: dependent.taxCode,
              fullName: dependent.fullName,
              birthDate: dependent.birthDate && moment.isMoment(dependent.birthDate)
                ? dependent.birthDate.format('YYYY-MM-DD')
                : null,
              relationship: dependent.relationship,
              proofFile: dependent.proofFile
                ? dependent.proofFile.map((file) => ({
                    uid: file.uid || `-${Math.random().toString(36).substr(2, 9)}`,
                    name: file.name,
                    status: file.status || 'done',
                  }))
                : [],
            }))
          : [];

        const dataToSend = {
          hasTax: formData.hasTax,
          taxCode: formData.taxCode,
          dependents: processedDependents,
        };

        console.log('Data to send: ', dataToSend);
        setIsSavedSuccessfully(true);

        if (typeof onSave === 'function') {
          onSave(dataToSend);
          message.success('Cập nhật thông tin thuế thành công!');
        } else {
          message.success('Tạo mới thông tin thuế thành công!');
        }
      })
      .catch((errorInfo) => {
        message.error('Lưu thất bại! Vui lòng nhập đầy đủ các trường bắt buộc.');
        console.log('Error saving data: ', errorInfo);
        setIsSavedSuccessfully(false);
      });
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
      >
        <div className="scroll-container">
          <div className="collapse-container">
            <Collapse
              item={{
                key: '1',
                header: 'Thông tin Thuế TNCN',
                children: <TaxInfo form={form} />,
              }}
            />
          </div>

          <div className="collapse-container">
            <Collapse
              item={{
                key: '2',
                header: 'Thông tin người phụ thuộc',
                children: <Dependent form={form} />,
              }}
            />
          </div>
        </div>
      </Form>

      <FooterBar
        onSave={handleSave}
        onCancel={handleCancel}
        onBack={handleBack}
        showBack={!isModalFooter}
        showCancel={true}
        showSave={true}
        isModalFooter={isModalFooter}
        style={{ flexShrink: 0 }}
      />
    </div>
  );
}

export default CreateTax;