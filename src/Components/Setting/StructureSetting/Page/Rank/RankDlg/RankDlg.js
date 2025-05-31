import React, { useEffect, useState } from "react";
import { Modal, Form, message } from "antd";
import Collapse from "../../../../../../Shared/Collapse/Collapse";
import Rank from "./Section/Rank";
import FooterBar from "../../../../../Footer/Footer";
import axios from "axios";

axios.defaults.baseURL = "https://localhost:7239";
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers["Content-Type"] = "application/json";
    return config;
  },
  (error) => Promise.reject(error)
);

const RankDlg = ({ visible, onClose, onSubmit, form, selectedRank, isViewMode, canUpdate, canCreate }) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    if (visible && !isViewMode && !selectedRank) {
      const fetchRankCode = async () => {
        try {
          setIsLoading(true);
          const response = await axios.get("/api/Rank/GetCodeRank");
          const { code, data, errors } = response.data;

          if (isMounted && code === 0 && data) {
            form.setFieldsValue({ ranks: [{ rankCode: data, priorityLevel: 1, name: "", description: "" }] });
          } else {
            throw new Error(errors?.[0] || "Failed to fetch rank code");
          }
        } catch (err) {
          console.error("Fetch rank code error:", {
            message: err.message,
            response: err.response?.data,
            status: err.response?.status,
          });
          const errorMessage =
            err.response?.data?.errors?.[0] ||
            err.response?.data?.message ||
            err.message ||
            "An error occurred while fetching rank code";
          message.error(errorMessage);
          if (isMounted) {
            form.setFieldsValue({
              ranks: [{ rankCode: `R${Math.floor(Math.random() * 1000).toString().padStart(4, "0")}`, priorityLevel: 1, name: "", description: "" }],
            });
          }
        } finally {
          if (isMounted) setIsLoading(false);
        }
      };

      fetchRankCode();
    } else if (visible) {
      const initialValues = {
        ranks: [
          {
            rankCode: selectedRank ? selectedRank.rankCode : `R${Math.floor(Math.random() * 1000).toString().padStart(4, "0")}`,
            priorityLevel: selectedRank ? parseInt(selectedRank.priorityLevel, 10) : 1,
            name: selectedRank ? selectedRank.rankName : "",
            description: selectedRank ? selectedRank.description : "",
          },
        ],
      };
      form.setFieldsValue(initialValues);
    }

    return () => {
      isMounted = false;
    };
  }, [visible, form, selectedRank, isViewMode]);

  const handleSave = async () => {
    if (isViewMode || isLoading) return;
    if (selectedRank && !canUpdate) {
      message.error("Bạn không có quyền chỉnh sửa cấp bậc.");
      return;
    }
    if (!selectedRank && !canCreate) {
      message.error("Bạn không có quyền tạo mới cấp bậc.");
      return;
    }

    setIsLoading(true);

    try {
      // Validate all fields
      const values = await form.validateFields();
      const rankData = values.ranks[0];
      const priorityLevelValue = parseInt(rankData.priorityLevel, 10);

      if (isNaN(priorityLevelValue)) {
        throw new Error("Mức độ ưu tiên phải là một số nguyên hợp lệ.");
      }

      const dataToSend = {
        id: rankData.rankCode,
        priorityLevel: priorityLevelValue,
        rankName: rankData.name,
        description: rankData.description || "",
      };

      let response;
      if (selectedRank) {
        response = await axios.put(`/api/Rank/${rankData.rankCode}`, dataToSend);
      } else {
        response = await axios.post("/api/Rank", dataToSend);
      }

      if (response.status === 200) {
        message.success(
          selectedRank ? "Cập nhật cấp bậc thành công!" : "Tạo cấp bậc thành công!"
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
      console.error("Rank operation error:", err);
      if (err.response) {
        const { status, data } = err.response;
        const { code, errors } = data || {};
        const errorMsg = errors?.[0] || "Không thể xử lý yêu cầu.";
        message.error(
          status === 400
            ? code === 1011
              ? "Cấp bậc đã tồn tại, không thể tạo."
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
            ? "Thông tin cấp bậc"
            : selectedRank
            ? "Chỉnh sửa thông tin cấp bậc"
            : "Cài đặt thông tin cấp bậc"
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
                  ? "Thông tin cấp bậc"
                  : selectedRank
                  ? "Chỉnh sửa thông tin cấp bậc"
                  : "Cài đặt thông tin cấp bậc",
                children: <Rank form={form} isViewMode={isViewMode} />,
              }}
            />
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default RankDlg;