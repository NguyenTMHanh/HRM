import React, { useEffect } from "react";
import { Modal, Form, message } from "antd";
import Collapse from "../../../../../../Shared/Collapse/Collapse";
import JobTitle from "./Section/JobTitle";
import FooterBar from "../../../../../Footer/Footer";

const JobTitleDlg = ({ visible, onClose, onSubmit, form, selectedJobTitle, isViewMode }) => {
  const initialValues = {
    jobTitles: [
      {
        id: selectedJobTitle ? selectedJobTitle.jobTitleCode : 1,
        jobTitleCode: selectedJobTitle ? selectedJobTitle.jobTitleCode : `JT${Math.floor(Math.random() * 1000).toString().padStart(3, "0")}`,
        title: selectedJobTitle ? selectedJobTitle.jobTitleName : "",
        rank: selectedJobTitle ? selectedJobTitle.rank : null,
        permissionGroup: selectedJobTitle ? selectedJobTitle.permissionGroup : null,
        description: selectedJobTitle ? selectedJobTitle.description : "",
      },
    ],
  };

  useEffect(() => {
    if (visible) {
      form.setFieldsValue(initialValues);
    }
  }, [visible, form, selectedJobTitle]);

  const handleSave = () => {
    if (isViewMode) return;
    form
      .validateFields()
      .then((values) => {
        const dataToSend = {
          jobTitles: values.jobTitles || [],
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
    >
      <Form form={form} layout="vertical" initialValues={initialValues}>
        <div className="collapse-container">
          <Collapse
            item={{
              key: "1",
              header: isViewMode
                ? "Xem chức vụ"
                : selectedJobTitle
                ? "Chỉnh sửa chức vụ"
                : "Cài đặt chức vụ",
              children: <JobTitle form={form} isViewMode={isViewMode} />,
            }}
          />
        </div>
      </Form>
    </Modal>
  );
};

export default JobTitleDlg;