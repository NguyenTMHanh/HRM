import React, { useEffect } from "react";
import { Modal, Form, message } from "antd";
import Collapse from "../../../../../../Shared/Collapse/Collapse";
import JobTitle from "./Section/JobTitle";
import FooterBar from "../../../../../Footer/Footer";

const JobTitleDlg = ({ visible, onClose, onSubmit, form }) => {
  const initialValues = {
    jobTitles: [
      {
        id: 1,
        jobTitleCode: "JT001",
        title: "",
        rank: null,
        permissionGroup: null, // Add permissionGroup
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
          jobTitles: values.jobTitles || [],
        };
        console.log("Form Data:", dataToSend);
        onSubmit(dataToSend);
        form.resetFields();
        message.success("Tạo chức vụ thành công!");
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
      width={1200}
    >
      <Form form={form} layout="vertical" initialValues={initialValues}>
        <div className="collapse-container">
          <Collapse
            item={{
              key: "1",
              header: "Cài đặt chức vụ",
              children: <JobTitle form={form} />,
            }}
          />
        </div>
      </Form>
    </Modal>
  );
};

export default JobTitleDlg;