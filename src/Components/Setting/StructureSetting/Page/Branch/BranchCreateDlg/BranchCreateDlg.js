import React, { useEffect } from "react";
import { Modal, Form, message } from "antd";
import Collapse from "../../../../../../Shared/Collapse/Collapse";
import BranchInfo from "./Section/BranchInfo";
import FooterBar from "../../../../../Footer/Footer";

const BranchCreateDlg = ({ visible, onClose, onSubmit, form, selectedBranch, isViewMode }) => {
  const getInitialValues = () => ({
    branchCode: selectedBranch
      ? selectedBranch.branchCode
      : `BR${Math.floor(Math.random() * 1000).toString().padStart(3, "0")}`,
    branchName: selectedBranch ? selectedBranch.branchName : "",
    address: selectedBranch ? selectedBranch.address : "",
    status: selectedBranch ? selectedBranch.status : "active",
    departments: selectedBranch ? selectedBranch.departments : [],
  });

  useEffect(() => {
    if (visible) {
      form.resetFields(); // Reset form before setting new values
      form.setFieldsValue(getInitialValues()); // Set initial values
    }
  }, [visible, form, selectedBranch]);

  const handleSave = () => {
    if (isViewMode) return;
    form
      .validateFields()
      .then((values) => {
        const dataToSend = {
          branchCode: values.branchCode,
          branchName: values.branchName,
          address: values.address,
          status: values.status,
          departments: values.departments,
        };
        onSubmit(dataToSend);
        form.resetFields(); // Reset form after submission
        onClose(); // Close dialog
      })
      .catch((errorInfo) => {
        message.error("Vui lòng nhập đầy đủ các trường bắt buộc.");
        console.log("Validation failed:", errorInfo);
      });
  };

  const handleCancel = () => {
    if (isViewMode) return;
    const currentBranchCode = form.getFieldValue("branchCode");
    form.resetFields(); // Reset form to clear all fields
    form.setFieldsValue({
      branchCode: currentBranchCode, // Preserve branchCode
      branchName: "",
      address: "",
      status: "active",
      departments: [],
    }); // Reset to empty/default values, keeping branchCode
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
      width={1200}
      centered={true}
    >
      <Form form={form} layout="vertical" initialValues={getInitialValues()}>
        <div className="collapse-container">
          <Collapse
            item={{
              key: "1",
              header: isViewMode
                ? "Xem chi nhánh"
                : selectedBranch
                ? "Chỉnh sửa chi nhánh"
                : "Cài đặt chi nhánh",
              children: <BranchInfo form={form} isViewMode={isViewMode} />,
            }}
          />
        </div>
      </Form>
    </Modal>
  );
};

export default BranchCreateDlg;