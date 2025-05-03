import React, { useEffect } from "react";
import { Modal, Form, message } from "antd";
import Collapse from "../../../../../../Shared/Collapse/Collapse";
import Department from "./Section/Department";
import FooterBar from "../../../../../Footer/Footer";

const DepartmentDlg = ({ visible, onClose, onSubmit, form, selectedDepartment }) => {
  const initialValues = {
    departments: [
      {
        id: selectedDepartment ? selectedDepartment.departmentCode : 1,
        departmentCode: selectedDepartment ? selectedDepartment.departmentCode : `D${Math.floor(Math.random() * 1000).toString().padStart(3, "0")}`,
        name: selectedDepartment ? selectedDepartment.departmentName : "",
        description: selectedDepartment ? selectedDepartment.description : "",
      },
    ],
  };

  useEffect(() => {
    if (visible) {
      form.setFieldsValue(initialValues);
    }
  }, [visible, form, selectedDepartment]);

  const handleSave = () => {
    form
      .validateFields()
      .then((values) => {
        const dataToSend = {
          departments: values.departments || [],
        };
        console.log("Form Data:", dataToSend);
        onSubmit(dataToSend);
        form.resetFields();
      })
      .catch((errorInfo) => {
        message.error("Vui lòng nhập đầy đủ các trường bắt buộc.");
        console.log("Validation failed:", errorInfo);
      });
  };

  const handleCancel = () => {
    form.resetFields();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal
      open={visible}
      footer={
        <FooterBar
          onSave={handleSave}
          onCancel={handleCancel}
          showCancel={true}
          showSave={true}
          isModalFooter={true}
        />
      }
      onCancel={handleClose}
      width={1000}
    >
      <Form form={form} layout="vertical" initialValues={initialValues}>
        <div className="collapse-container">
          <Collapse
            item={{
              key: "1",
              header: selectedDepartment ? "Chỉnh sửa bộ phận" : "Cài đặt bộ phận",
              children: <Department form={form} />,
            }}
          />
        </div>
      </Form>
    </Modal>
  );
};

export default DepartmentDlg;