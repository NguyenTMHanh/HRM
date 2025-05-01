import React from "react";
import { Modal, Form, message } from "antd";
import Collapse from "../../../../../../Shared/Collapse/Collapse";
import BranchInfo from "./Section/BranchInfo";
import FooterBar from "../../../../../Footer/Footer";

const BranchCreateDlg = ({ visible, onClose, onSubmit }) => {
  const [formInstance] = Form.useForm();

  const handleSave = () => {
    formInstance
      .validateFields()
      .then((values) => {
        const dataToSend = {
          branchCode: values.branchCode, // Add branchCode
          branchName: values.branchName,
          address: values.address,
          status: values.status,
          departments: values.departments,
        };
        console.log("Form Data:", dataToSend);
        onSubmit(dataToSend);
        formInstance.resetFields();
        message.success("Tạo chi nhánh thành công!");
      })
      .catch((errorInfo) => {
        message.error("Vui lòng nhập đầy đủ các trường bắt buộc.");
        console.log("Validation failed:", errorInfo);
      });
  };

  const handleCancel = () => {
    formInstance.resetFields();
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
      onCancel={handleCancel}
      width={1200}
    >
      <Form form={formInstance} layout="vertical">
        <div className="collapse-container">
          <Collapse
            item={{
              key: "1",
              header: "Cài đặt chi nhánh",
              children: <BranchInfo form={formInstance} />,
            }}
          />
        </div>
      </Form>
    </Modal>
  );
};

export default BranchCreateDlg;