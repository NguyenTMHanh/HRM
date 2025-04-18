import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Form, message } from "antd";
import TaxInfo from "./Section/TaxInfo";
import Dependent from "./Section/Dependent";
import Collapse from "../../../Shared/Collapse/Collapse";
import FooterBar from "../../Footer/Footer";
import moment from "moment";

function CreateTax() {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleCancel = () => {
    form.resetFields();
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

        const processedDependents = formData.dependents
          ? formData.dependents.map((dependent) => ({
              registered: dependent.registered === "Đã đăng ký" ? true : false, // Convert to boolean
              taxCode: dependent.taxCode,
              fullName: dependent.fullName,
              birthDate: convertDateToObject(dependent.birthDate),
              relationship: dependent.relationship,
              proofFile: dependent.proofFile
                ? dependent.proofFile.map((file) => ({
                    name: file.name,
                    status: file.status,
                  }))
                : [],
            }))
          : [];

        const dataToSend = {
          hasTax: formData.hasTax,
          taxCode: formData.taxCode,
          dependents: processedDependents,
        };

        console.log("Dữ liệu cần gửi đi: ", dataToSend);
        message.success("Lưu dữ liệu thành công!");
      })
      .catch((errorInfo) => {
        message.error("Lưu thất bại! Vui lòng nhập đầy đủ các trường bắt buộc.");
        console.log("Lỗi khi lưu dữ liệu: ", errorInfo);
      });
  };

  const handleBack = () => {
    navigate('/create/insurance');
  };

  return (
    <>
      <Form form={form} layout="vertical">
        <div className="scroll-container">
          <div className="collapse-container">
            <Collapse
              item={{
                key: "1",
                header: "Thông tin Thuế TNCN",
                children: <TaxInfo />,
              }}
            />
          </div>

          <div className="collapse-container">
            <Collapse
              item={{
                key: "2",
                header: "Thông tin người phụ thuộc",
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
        showBack={true}
        showCancel={true}
        showSave={true}
      />
    </>
  );
}

export default CreateTax;