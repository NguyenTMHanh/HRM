import React, { useEffect } from "react";
import { Modal, Form, message } from "antd";
import Collapse from "../../../../../../Shared/Collapse/Collapse";
import Rank from "./Section/Rank";
import FooterBar from "../../../../../Footer/Footer";

const RankDlg = ({ visible, onClose, onSubmit }) => {
  const [formInstance] = Form.useForm();

  const initialValues = {
    ranks: [
      {
        rankCode: "R001",
        priority: 1,
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
          ranks: values.ranks || [],
        };
        console.log("Form Data:", dataToSend);
        onSubmit(dataToSend);
        formInstance.resetFields();
        message.success("Tạo cấp bậc thành công!");
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
              header: "Cài đặt cấp bậc",
              children: <Rank form={formInstance} />,
            }}
          />
        </div>
      </Form>
    </Modal>
  );
};

export default RankDlg;