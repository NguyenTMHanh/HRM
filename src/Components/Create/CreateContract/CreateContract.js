import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, message } from "antd";
import Collapse from "../../../Shared/Collapse/Collapse";
import Allowance from "./Section/Allowance";
import ContractInfo from "./Section/ContractInfo";
import FooterBar from "../../Footer/Footer";
import moment from "moment";

function CreateContract() {
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
  };

  useEffect(() => {
    form.setFieldsValue(initialValues); 
  });

  const handleCancel = () => {
    form.resetFields();
    setIsSavedSuccessfully(false);
  };

  const handleSave = () => {
    form
      .validateFields()
      .then(() => {
        const formData = form.getFieldsValue();

        const convertDateToObject = (date) => {
          if (date) {
            return {
              date: date.date(),
              month: date.month() + 1,
              year: date.year()
            };
          }
          return null;
        };

        const startDate = convertDateToObject(formData.startDate);
        const endDate = convertDateToObject(formData.endDate);

        const allowancesData = formData.allowances || [];

        const dataToSend = {
          ...formData,
          allowances: allowancesData, 
          startDate: startDate,
          endDate: endDate,
        };

        console.log("Dữ liệu cần gửi đi: ", dataToSend);

        setIsSavedSuccessfully(true);
        message.success("Lưu dữ liệu thành công!");
      })
      .catch((errorInfo) => {
        message.error("Lưu thất bại! Vui lòng nhập đầy đủ các trường bắt buộc.");
        console.log("Lỗi khi lưu dữ liệu: ", errorInfo);
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
    <>
      <Form form={form} layout="vertical" initialValues={initialValues}>
        <div className="scroll-container">
        <div className='collapse-container'>
            <Collapse
              item={{
                key: '1',
                header: 'Thông tin HĐLĐ',
                children: <ContractInfo form={form} />,
              }}
            />
          </div>
          <div className='collapse-container'>
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
        showNext={isSavedSuccessfully}
        showBack={true}
        showCancel={true}
        showSave={true}
      />
    </>
  );
}

export default CreateContract;
