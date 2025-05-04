import React, { useEffect } from "react";
import { Modal, Form, message } from "antd";
import Collapse from "../../../../Shared/Collapse/Collapse";
import RolePermissionCreate from "./Section/RolePermissionCreate";
import PermissionSelector from "./Section/PermissionSelector";
import FooterBar from "../../../Footer/Footer";

const RolePermissionDlg = ({ visible, onClose, onSubmit, form, selectedRole, isViewMode }) => {
  const initialValues = {
    roleCode: selectedRole ? selectedRole.roleCode : `ROLE${Math.floor(Math.random() * 1000)}`,
    roleName: selectedRole ? selectedRole.roleName : "",
    description: selectedRole ? selectedRole.description : "",
    position: selectedRole ? selectedRole.position : "",
    permissions: selectedRole ? selectedRole.permissions : {},
  };

  useEffect(() => {
    if (visible) {
      form.setFieldsValue(initialValues);
    }
  }, [visible, form, selectedRole]);

  const handleSave = () => {
    if (isViewMode) return;
    form
      .validateFields()
      .then((values) => {
        const dataToSend = {
          roleCode: values.roleCode,
          roleName: values.roleName,
          description: values.description,
          position: values.position,
          permissions: values.permissions,
        };
        onSubmit(dataToSend);
        form.resetFields();
      })
      .catch((errorInfo) => {
        message.error("Vui lòng nhập đầy đủ các trường bắt buộc.");
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
    >
      <Form form={form} layout="vertical" initialValues={initialValues}>
        <div className="collapse-container">
          <Collapse
            item={{
              key: "1",
              header: isViewMode
                ? "Thông tin nhóm quyền"
                : selectedRole
                ? "Chỉnh sửa thông tin nhóm quyền"
                : "Cài đặt thông tin nhóm quyền",
              children: <RolePermissionCreate form={form} isViewMode={isViewMode} />,
            }}
          />
        </div>

        <div className="collapse-container">
          <Collapse
            item={{
              key: "2",
              header: isViewMode
                ? "Quyền hạn"
                : selectedRole
                ? "Chỉnh sửa quyền hạn"
                : "Cài đặt quyền hạn",
              children: <PermissionSelector form={form} isViewMode={isViewMode} />,
            }}
          />
        </div>
      </Form>
    </Modal>
  );
};

export default RolePermissionDlg;