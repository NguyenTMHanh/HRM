import React, { useEffect, useState } from "react";
import { Modal, Form, message } from "antd";
import Collapse from "../../../../../../Shared/Collapse/Collapse";
import Position from "./Section/Position";
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

const PositionDlg = ({ visible, onClose, onSubmit, form, selectedPosition, isViewMode, departments, canUpdate, canCreate }) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    if (visible && !isViewMode && !selectedPosition) {
      const fetchPositionCode = async () => {
        try {
          setIsLoading(true);
          const response = await axios.get("/api/Position/GetCodePosition");
          const { code, data, errors } = response.data;

          if (isMounted && code === 0 && data) {
            form.setFieldsValue({ positions: [{ positionCode: data, name: "", departmentId: null, description: "" }] });
          } else {
            throw new Error(errors?.[0] || "Failed to fetch position code");
          }
        } catch (err) {
          console.error("Fetch position code error:", {
            message: err.message,
            response: err.response?.data,
            status: err.response?.status,
          });
          const errorMessage =
            err.response?.data?.errors?.[0] ||
            err.response?.data?.message ||
            err.message ||
            "An error occurred while fetching position code";
          message.error(errorMessage);
          if (isMounted) form.setFieldsValue({ positions: [{ positionCode: `POS${Math.floor(Math.random() * 1000).toString().padStart(3, "0")}`, name: "", departmentId: null, description: "" }] });
        } finally {
          if (isMounted) setIsLoading(false);
        }
      };

      fetchPositionCode();
    } else if (visible) {
      const initialValues = {
        positions: [
          {
            positionCode: selectedPosition
              ? selectedPosition.positionCode
              : `POS${Math.floor(Math.random() * 1000).toString().padStart(3, "0")}`,
            name: selectedPosition ? selectedPosition.positionName : "",
            departmentId: selectedPosition ? selectedPosition.department : null,
            description: selectedPosition ? selectedPosition.description : "",
          },
        ],
      };
      form.setFieldsValue(initialValues);
    }

    return () => {
      isMounted = false;
    };
  }, [visible, form, selectedPosition, isViewMode]);

  const handleSave = async () => {
    if (isViewMode || isLoading) return;
    if (selectedPosition && !canUpdate) {
      message.error("Bạn không có quyền chỉnh sửa vị trí.");
      return;
    }
    if (!selectedPosition && !canCreate) {
      message.error("Bạn không có quyền tạo mới vị trí.");
      return;
    }

    setIsLoading(true);

    try {
      const values = await form.validateFields();
      const positionData = values.positions[0];

      const dataToSend = {
        Id: positionData.positionCode,
        PositionName: positionData.name,
        Description: positionData.description || "",
        DepartmentName: positionData.departmentId,
      };

      let response;
      if (selectedPosition) {
        response = await axios.put(`/api/Position/${positionData.positionCode}`, dataToSend);
      } else {
        response = await axios.post("/api/Position", dataToSend);
      }

      if (response.status === 200) {
        message.success(
          selectedPosition ? "Cập nhật vị trí thành công!" : "Tạo vị trí thành công!"
        );
        onSubmit(dataToSend);
        form.resetFields();
        onClose();
      } else {
        message.error(`Yêu cầu không thành công với mã trạng thái: ${response.status}`);
      }
    } catch (err) {
      console.error("Position operation error:", err);
      if (err.response) {
        const { status, data } = err.response;
        const { code, errors } = data || {};
        const errorMsg = errors?.[0] || "Không thể xử lý yêu cầu.";
        message.error(
          status === 400
            ? code === 1011
              ? "Vị trí đã tồn tại, không thể tạo."
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
    const currentPositionCode = form.getFieldValue(["positions", 0, "positionCode"]);
    form.resetFields();
    form.setFieldsValue({ positions: [{ positionCode: currentPositionCode, name: "", departmentId: null, description: "" }] });
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
            ? "Thông tin vị trí"
            : selectedPosition
            ? "Chỉnh sửa thông tin vị trí"
            : "Cài đặt thông tin vị trí"
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
                  ? "Thông tin vị trí"
                  : selectedPosition
                  ? "Chỉnh sửa thông tin vị trí"
                  : "Cài đặt thông tin vị trí",
                children: <Position form={form} isViewMode={isViewMode} departments={departments} />,
              }}
            />
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default PositionDlg;