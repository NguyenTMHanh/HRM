import React, { useEffect, useState } from "react";
import { Modal, Form, message } from "antd";
import Collapse from "../../../../../../Shared/Collapse/Collapse";
import JobTitle from "./Section/JobTitle";
import FooterBar from "../../../../../Footer/Footer";
import axios from "axios";

const JobTitleDlg = ({ visible, onClose, onSubmit, form, selectedJobTitle, isViewMode, ranks, roles }) => {
  const [isLoading, setIsLoading] = useState(false);

  const getInitialValues = () => ({
    jobTitles: [
      {
        jobTitleCode: selectedJobTitle
          ? selectedJobTitle.jobTitleCode
          : `JT${Math.floor(Math.random() * 1000).toString().padStart(3, "0")}`,
        title: selectedJobTitle ? selectedJobTitle.jobTitleName : "",
        rank: selectedJobTitle ? selectedJobTitle.rank : null,
        permissionGroup: selectedJobTitle ? selectedJobTitle.permissionGroup : null,
        description: selectedJobTitle ? selectedJobTitle.description : "",
      },
    ],
  });

  useEffect(() => {
    let isMounted = true;

    if (visible && !isViewMode && !selectedJobTitle) {
      const fetchJobTitleCode = async () => {
        try {
          setIsLoading(true);
          const response = await axios.get("/api/JobTitle/GetCodeJobTitle");
          const { code, data, errors } = response.data;

          if (isMounted && code === 0 && data) {
            form.setFieldsValue({ jobTitles: [{ jobTitleCode: data, title: "", rank: null, permissionGroup: null, description: "" }] });
          } else {
            throw new Error(errors?.[0] || "Failed to fetch job title code");
          }
        } catch (err) {
          console.error("Fetch job title code error:", {
            message: err.message,
            response: err.response?.data,
            status: err.response?.status,
          });
          const errorMessage =
            err.response?.data?.errors?.[0] ||
            err.response?.data?.message ||
            err.message ||
            "An error occurred while fetching job title code";
          message.error(errorMessage);
          if (isMounted) form.setFieldsValue({ jobTitles: [{ jobTitleCode: `JT${Math.floor(Math.random() * 1000).toString().padStart(3, "0")}`, title: "", rank: null, permissionGroup: null, description: "" }] });
        } finally {
          if (isMounted) setIsLoading(false);
        }
      };

      fetchJobTitleCode();
    } else if (visible) {
      form.setFieldsValue(getInitialValues());
    }

    return () => {
      isMounted = false;
    };
  }, [visible, form, selectedJobTitle, isViewMode]);

  const handleSave = () => {
    if (isViewMode || isLoading) return;

    form
      .validateFields()
      .then((values) => {
        const dataToSend = {
          jobTitles: values.jobTitles || [],
        };
        onSubmit(dataToSend);
        form.resetFields();
        onClose();
      })
      .catch((errorInfo) => {
        message.error("Vui lòng nhập đầy đủ các trường bắt buộc.");
        console.log("Validation failed:", errorInfo);
      });
  };

  const handleCancel = () => {
    const currentJobTitleCode = form.getFieldValue(["jobTitles", 0, "jobTitleCode"]);
    form.resetFields();
    form.setFieldsValue({
      jobTitles: [{ jobTitleCode: currentJobTitleCode }],
    });
  };

  const handleClose = () => {
    form.resetFields();
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
            loading={isLoading}
          />
        )
      }
      onCancel={handleClose}
      width={1000}
      centered={true}
    >
      <Form form={form} layout="vertical" initialValues={getInitialValues()}>
        <div className="collapse-container">
          <Collapse
            item={{
              key: "1",
              header: isViewMode
                ? "Xem chức vụ"
                : selectedJobTitle
                ? "Chỉnh sửa chức vụ"
                : "Cài đặt chức vụ",
              children: <JobTitle form={form} isViewMode={isViewMode} ranks={ranks} roles={roles} />,
            }}
          />
        </div>
      </Form>
    </Modal>
  );
};

export default JobTitleDlg;