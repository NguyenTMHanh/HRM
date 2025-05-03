import React, { useEffect } from "react";
import { Modal, Form, message } from "antd";
import Collapse from "../../../../Shared/Collapse/Collapse";
import RolePermissionCreate from "./Section/RolePermissionCreate";
import FooterBar from "../../../Footer/Footer";

const RolePermissionDlg = ({ visible, onClose, onSubmit, form, selectedRole }) => {
  const initialValues = {
    roleCode: selectedRole ? selectedRole.roleCode : `ROLE${Math.floor(Math.random() * 1000)}`,
    roleName: selectedRole ? selectedRole.roleName : "",
    description: selectedRole ? selectedRole.description : "",
    position: selectedRole ? selectedRole.position : "",
  };

  useEffect(() => {
    if (visible) {
      form.setFieldsValue(initialValues);
    }
  }, [visible, form, selectedRole]);

  const handleSave = () => {
    form
      .validateFields()
      .then((values) => {
        const dataToSend = {
          roleCode: values.roleCode,
          roleName: values.roleName,
          description: values.description,
          position: values.position,
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
              header: selectedRole ? "Chỉnh sửa nhóm quyền" : "Cài đặt nhóm quyền",
              children: <RolePermissionCreate form={form} />,
            }}
          />
        </div>
      </Form>
    </Modal>
  );
};

export default RolePermissionDlg;