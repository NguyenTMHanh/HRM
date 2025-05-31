import React, { useEffect, useState } from "react";
import { Modal, Form, message } from "antd";
import Collapse from "../../../../../../Shared/Collapse/Collapse";
import JobTitle from "./Section/JobTitle";
import FooterBar from "../../../../../Footer/Footer";
import axios from "axios";

axios.defaults.baseURL = "https://localhost:7239";
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers["Content-Type"] = "application/json";
    return config;
  },
  (error) => Promise.reject(error)
);

const JobTitleDlg = ({ visible, onClose, onSubmit, form, selectedJobTitle, isViewMode, ranks, roles, canUpdate, canCreate }) => {
  const [isLoading, setIsLoading] = useState(false);

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
          if (isMounted) {
            form.setFieldsValue({
              jobTitles: [{ jobTitleCode: `JT${Math.floor(Math.random() * 1000).toString().padStart(3, "0")}`, title: "", rank: null, permissionGroup: null, description: "" }],
            });
          }
        } finally {
          if (isMounted) setIsLoading(false);
        }
      };

      fetchJobTitleCode();
    } else if (visible) {
      const initialValues = {
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
      };
      form.setFieldsValue(initialValues);
    }

    return () => {
      isMounted = false;
    };
  }, [visible, form, selectedJobTitle, isViewMode]);

  const handleSave = async () => {
    if (isViewMode || isLoading) return;
    if (selectedJobTitle && !canUpdate) {
      message.error("Bạn không có quyền chỉnh sửa chức vụ.");
      return;
    }
    if (!selectedJobTitle && !canCreate) {
      message.error("Bạn không có quyền tạo mới chức vụ.");
      return;
    }

    setIsLoading(true);

    try {
      // Validate all fields
      const values = await form.validateFields();
      const jobTitleData = values.jobTitles[0];

      const dataToSend = {
        Id: jobTitleData.jobTitleCode,
        JobtitleName: jobTitleData.title,
        Description: jobTitleData.description || "",
        RankName: jobTitleData.rank,
        RoleName: jobTitleData.permissionGroup,
      };

      let response;
      if (selectedJobTitle) {
        response = await axios.put(`/api/JobTitle/${jobTitleData.jobTitleCode}`, dataToSend);
      } else {
        response = await axios.post("/api/JobTitle", dataToSend);
      }

      if (response.status === 200) {
        message.success(
          selectedJobTitle ? "Cập nhật chức vụ thành công!" : "Tạo chức vụ thành công!"
        );
        onSubmit(dataToSend);
        form.resetFields();
        onClose();
      } else {
        message.error(`Yêu cầu không thành công với mã trạng thái: ${response.status}`);
      }
    } catch (err) {
      // Handle validation errors
      if (err.errorFields) {
        message.error("Vui lòng nhập đầy đủ các trường bắt buộc!");
        return;
      }

      // Handle API errors
      console.error("JobTitle operation error:", err);
      if (err.response) {
        const { status, data } = err.response;
        const { code, errors } = data || {};
        const errorMsg = errors?.[0] || "Không thể xử lý yêu cầu.";
        message.error(
          status === 400
            ? code === 1011
              ? "Chức vụ đã tồn tại, không thể tạo."
              : errorMsg
            : status === 401
            ? "Bạn không có quyền thực hiện hành động này."
            : status === 500
            ? "Lỗi server. Vui lòng thử lại sau."
            : `Lỗi không xác định với mã trạng thái: ${status}`
        );
      } else {
        message.error("Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <div style={{ position: "relative" }}>
      <Modal
        open={visible}
        title={
          isViewMode
            ? "Thông tin chức vụ"
            : selectedJobTitle
            ? "Chỉnh sửa thông tin chức vụ"
            : "Cài đặt thông tin chức vụ"
        }
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
        style={{ top: "50%", transform: "translateY(-50%)" }}
        styles={{
          body: {
            maxHeight: "70vh",
            overflowY: "auto",
            padding: "16px",
          },
        }}
      >
        <Form form={form} layout="vertical">
          <div className="collapse-container">
            <Collapse
              item={{
                key: "1",
                header: isViewMode
                  ? "Thông tin chức vụ"
                  : selectedJobTitle
                  ? "Chỉnh sửa thông tin chức vụ"
                  : "Cài đặt thông tin chức vụ",
                children: <JobTitle form={form} isViewMode={isViewMode} ranks={ranks} roles={roles} />,
              }}
            />
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default JobTitleDlg;