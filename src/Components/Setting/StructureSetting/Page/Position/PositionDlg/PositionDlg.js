import React, { useEffect } from "react";
import { Modal, Form, message } from "antd";
import Collapse from "../../../../../../Shared/Collapse/Collapse";
import Position from "./Section/Position";
import FooterBar from "../../../../../Footer/Footer";

const PositionDlg = ({ visible, onClose, onSubmit, form }) => {
  const initialValues = {
    positions: [
      {
        positionCode: "POS001",
        name: "",
        departmentId: null,
        description: "",
      },
    ],
  };

  useEffect(() => {
    if (visible) {
      form.setFieldsValue(initialValues);
    }
  }, [visible, form]);

  const handleSave = () => {
    form
      .validateFields()
      .then((values) => {
        const dataToSend = {
          positions: values.positions || [],
        };
        console.log("Form Data:", dataToSend);
        onSubmit(dataToSend);
        form.resetFields();
        message.success("Tạo vị trí thành công!");
      })
      .catch((errorInfo) => {
        message.error("Vui lòng nhập đầy đủ các trường bắt buộc.");
        console.log("Validation failed:", errorInfo);
      });
  };

  const handleCancel = () => {
    form.resetFields();
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
      <Form form={form} layout="vertical" initialValues={initialValues}>
        <div className="collapse-container">
          <Collapse
            item={{
              key: "1",
              header: "Cài đặt vị trí",
              children: <Position form={form} />,
            }}
          />
        </div>
      </Form>
    </Modal>
  );
};

export default PositionDlg;