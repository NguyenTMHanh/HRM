import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Form, message } from "antd";
import Collapse from "../../../Shared/Collapse/Collapse";
import BHYTInfo from "./Section/BHYTInfo";
import BHXHInfo from "./Section/BHXHInfo";
import BHTNInfo from "./Section/BHTNInfo";
import GeneralInfo from "./Section/GeneralInfo";
import FooterBar from "../../Footer/Footer";
import moment from "moment";

function CreateInsurance() {
  const [form] = Form.useForm();
  const [isSavedSuccessfully, setIsSavedSuccessfully] = useState(false);
  const [bhxhCode, setBhxhCode] = useState("");
  const navigate = useNavigate();

  // Memoize initialValues
  const initialValues = useMemo(
    () => ({
      bhytCode: "DN-4-01 1234567890123",
      bhytRate: "1% NLĐ / 17% DN",
      bhytStartDate: moment(),
      bhxhStartDate: moment(),
      bhxhRate: "1% NLĐ / 17% DN",
      bhtnStartDate: moment(),
      bhtnRate: "1% NLĐ / 17% DN",
      bhEndDate: moment(),
      bhxhCode: "", // Thêm để tránh xung đột
    }),
    []
  );

  useEffect(() => {
    form.setFieldsValue(initialValues);
    const code = getBHXHCodeFromBHYT(initialValues.bhytCode);
    setBhxhCode(code);
    form.setFieldsValue({ bhxhCode: code });
  }, [form, initialValues]);

  // Handle BHYT code change
  const handleBHYTCodeChange = (changedValues, allValues) => {
    if (changedValues.bhytCode) {
      const code = getBHXHCodeFromBHYT(changedValues.bhytCode);
      setBhxhCode(code);
      form.setFieldsValue({ bhxhCode: code });
    }
  };

  const getBHXHCodeFromBHYT = (bhytCode) => {
    if (!bhytCode) return "";
    const digits = bhytCode.replace(/\D/g, "");
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
        const convertDateToObject = (date) => {
          if (date) {
            return {
              date: date.date(),
              month: date.month() + 1,
              year: date.year(),
            };
          }
          return null;
        };

        const dataToSend = {
          bhytCode: formData.bhytCode,
          bhytRate: formData.bhytRate,
          registeredHospital: formData.registeredHospital,
          bhytStartDate: convertDateToObject(formData.bhytStartDate),
          hasJoined: formData.hasJoined,
          bhxhCode: formData.bhxhCode,
          bhxhRate: formData.bhxhRate,
          bhxhStartDate: convertDateToObject(formData.bhxhStartDate),
          bhtnRate: formData.bhtnRate,
          bhtnStartDate: convertDateToObject(formData.bhtnStartDate),
          bhStatus: formData.bhStatus === "Đang tham gia" ? true : false,
          bhEndDate: convertDateToObject(formData.bhEndDate),
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
      navigate("/create/tax");
    }
  };

  const handleBack = () => {
    navigate("/create/contract");
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onValuesChange={handleBHYTCodeChange}
    >
      <div className="scroll-container">
        <div className="collapse-container">
          <Collapse
            item={{
              key: "1",
              header: "Thông tin BHYT",
              children: <BHYTInfo />,
            }}
          />
        </div>

        <div className="collapse-container">
          <Collapse
            item={{
              key: "2",
              header: "Thông tin BHXH",
              children: <BHXHInfo bhxhCode={bhxhCode} form={form} />,
            }}
          />
        </div>

        <div className="collapse-container">
          <Collapse
            item={{
              key: "3",
              header: "Thông tin BHTN",
              children: <BHTNInfo form={form} />,
            }}
          />
        </div>

        <div className="collapse-container">
          <Collapse
            item={{
              key: "4",
              header: "Thông tin BH chung",
              children: <GeneralInfo form={form} />,
            }}
          />
        </div>
      </div>

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
    </Form>
  );
}

export default CreateInsurance;