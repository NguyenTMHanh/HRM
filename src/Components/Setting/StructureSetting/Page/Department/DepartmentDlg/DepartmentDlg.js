import React, { useEffect } from "react";
import { Modal, Form, message } from "antd";
import Collapse from "../../../../../../Shared/Collapse/Collapse";
import Department from "./Section/Department";
import FooterBar from "../../../../../Footer/Footer";

const DepartmentDlg = ({ visible, onClose, onSubmit, form, selectedDepartment, isViewMode }) => {
  const getInitialValues = () => ({
    departments: [
      {
        departmentCode: selectedDepartment
          ? selectedDepartment.departmentCode
          : `D${Math.floor(Math.random() * 1000).toString().padStart(3, "0")}`,
        name: selectedDepartment ? selectedDepartment.departmentName : "",
        description: selectedDepartment ? selectedDepartment.description : "",
      },
    ],
  });

  useEffect(() => {
    if (visible) {
      form.resetFields(); // Reset form before setting new values
      form.setFieldsValue(getInitialValues()); // Set initial values
    }
  }, [visible, form, selectedDepartment]);

  const handleSave = () => {
    if (isViewMode) return;
    form
      .validateFields()
      .then((values) => {
        const dataToSend = {
          departments: values.departments || [],
        };
        onSubmit(dataToSend);
        form.resetFields(); // Reset form after submit
        onClose(); // Close dialog
      })
      .catch((errorInfo) => {
        message.error("Vui lòng nhập đầy đủ các trường bắt buộc.");
        console.log("Validation failed:", errorInfo);
      });
  };

  const handleCancel = () => {
    const currentDepartmentCode = form.getFieldValue(["departments", 0, "departmentCode"]);
    form.resetFields(); // Reset form to empty state
    form.setFieldsValue({
      departments: [{ departmentCode: currentDepartmentCode }], // Preserve departmentCode
    });
  };

  const handleClose = () => {
    form.resetFields(); // Reset form when closing
    onClose(); // Call parent onClose
  };

  return (
    <Modal
      open={visible}
      footer={
        isViewMode ? null : (
          <FooterBar
            onSave={handleSave}
            onCancel={handleCancel}
            showCancel={true}
            showSave={true}
            isModalFooter={true}
          />
        )
      }
      onCancel={handleClose}
      width={1000}
      centered={true} // Center the dialog
    >
      <Form form={form} layout="vertical" initialValues={getInitialValues()}>
        <div className="collapse-container">
          <Collapse
            item={{
              key: "1",
              header: isViewMode
                ? "Xem bộ phận"
                : selectedDepartment
                ? "Chỉnh sửa bộ phận"
                : "Cài đặt bộ phận",
              children: <Department form={form} isViewMode={isViewMode} />,
            }}
          />
        </div>
      </Form>
    </Modal>
  );
};

export default DepartmentDlg;