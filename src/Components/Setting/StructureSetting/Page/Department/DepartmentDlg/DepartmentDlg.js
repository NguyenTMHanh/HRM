import React, { useEffect } from "react";
import { Modal, Form, message } from "antd";
import Collapse from "../../../../../../Shared/Collapse/Collapse";
import Department from "./Section/Department";
import FooterBar from "../../../../../Footer/Footer";

const DepartmentDlg = ({ visible, onClose, onSubmit }) => {
  const [formInstance] = Form.useForm();

  const initialValues = {
    departments: [
      {
        id: 1,
        departmentCode: "D001",
        name: "",
        description: "",
      },
    ],
  };

  useEffect(() => {
    if (visible) {
      formInstance.setFieldsValue(initialValues);
    }
  }, [visible, formInstance]);

  const handleSave = () => {
    formInstance
      .validateFields()
      .then((values) => {
        const dataToSend = {
          departments: values.departments || [],
        };
        console.log("Form Data:", dataToSend);
        onSubmit(dataToSend);
        message.success("Tạo bộ phận thành công!");
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
      width={1000}
    >
      <Form form={formInstance} layout="vertical" initialValues={initialValues}>
        <div className="collapse-container">
          <Collapse
            item={{
              key: "1",
              header: "Cài đặt bộ phận",
              children: <Department form={formInstance} />,
            }}
          />
        </div>
      </Form>
    </Modal>
  );
};

export default DepartmentDlg;