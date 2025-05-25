import React, { useEffect, useState } from "react";
import { Modal, Form, message } from "antd";
import Collapse from "../../../../../../Shared/Collapse/Collapse";
import Department from "./Section/Department";
import FooterBar from "../../../../../Footer/Footer";
import axios from "axios";

// Axios configuration
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

const DepartmentDlg = ({ visible, onClose, onSubmit, form, selectedDepartment, isViewMode, canUpdate, canCreate }) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    if (visible && !isViewMode && !selectedDepartment) {
      const fetchDepartmentCode = async () => {
        try {
          setIsLoading(true);
          const response = await axios.get("/api/Department/GetCodeDepartment");
          const { code, data, errors } = response.data;

          if (isMounted && code === 0 && data) {
            form.setFieldsValue({ departments: [{ departmentCode: data, name: "", description: "" }] });
          } else {
            throw new Error(errors?.[0] || "Failed to fetch department code");
          }
        } catch (err) {
          console.error("Fetch department code error:", {
            message: err.message,
            response: err.response?.data,
            status: err.response?.status,
          });
          const errorMessage =
            err.response?.data?.errors?.[0] ||
            err.response?.data?.message ||
            err.message ||
            "An error occurred while fetching department code";
          message.error(errorMessage);
          if (isMounted) {
            form.setFieldsValue({
              departments: [
                { departmentCode: `D${Math.floor(Math.random() * 1000).toString().padStart(3, "0")}`, name: "", description: "" },
              ],
            });
          }
        } finally {
          if (isMounted) setIsLoading(false);
        }
      };

      fetchDepartmentCode();
    } else if (visible) {
      const initialValues = {
        departments: [
          {
            departmentCode: selectedDepartment
              ? selectedDepartment.departmentCode
              : `D${Math.floor(Math.random() * 1000).toString().padStart(3, "0")}`,
            name: selectedDepartment ? selectedDepartment.departmentName : "",
            description: selectedDepartment ? selectedDepartment.description : "",
          },
        ],
      };
      form.setFieldsValue(initialValues);
    }

    return () => {
      isMounted = false;
    };
  }, [visible, form, selectedDepartment, isViewMode]);

  const handleSave = async () => {
    if (isViewMode || isLoading) return;
    if (selectedDepartment && !canUpdate) {
      message.error("Bạn không có quyền chỉnh sửa bộ phận.");
      return;
    }
    if (!selectedDepartment && !canCreate) {
      message.error("Bạn không có quyền tạo mới bộ phận.");
      return;
    }

    setIsLoading(true);

    try {
      // Validate all fields
      const values = await form.validateFields();
      const departmentData = values.departments[0];

      const dataToSend = {
        id: departmentData.departmentCode,
        departmentName: departmentData.name,
        description: departmentData.description || "",
      };

      let response;
      if (selectedDepartment) {
        response = await axios.put(`/api/Department/${departmentData.departmentCode}`, dataToSend);
      } else {
        response = await axios.post("/api/Department", dataToSend);
      }

      if (response.status === 200) {
        message.success(
          selectedDepartment ? "Cập nhật bộ phận thành công!" : "Tạo bộ phận thành công!"
        );
        onSubmit();
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
      console.error("Department operation error:", err);
      if (err.response) {
        const { status, data } = err.response;
        const { code, errors } = data || {};
        const errorMsg = errors?.[0] || "Không thể xử lý yêu cầu.";
        message.error(
          status === 400
            ? code === 1011
              ? "Bộ phận đã tồn tại, không thể tạo."
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
    if (isViewMode) return;
    const currentDepartmentCode = form.getFieldValue(["departments", 0, "departmentCode"]);
    form.resetFields();
    form.setFieldsValue({ departments: [{ departmentCode: currentDepartmentCode, name: "", description: "" }] });
  };

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  return (
    <div style={{ position: "relative" }}>
      <Modal
        open={visible}
        title={
          isViewMode
            ? "Thông tin bộ phận"
            : selectedDepartment
            ? "Chỉnh sửa thông tin bộ phận"
            : "Cài đặt thông tin bộ phận"
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
                  ? "Thông tin bộ phận"
                  : selectedDepartment
                  ? "Chỉnh sửa thông tin bộ phận"
                  : "Cài đặt thông tin bộ phận",
                children: <Department form={form} isViewMode={isViewMode} />,
              }}
            />
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default DepartmentDlg;