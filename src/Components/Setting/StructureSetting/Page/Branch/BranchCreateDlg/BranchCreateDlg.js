import React, { useEffect, useState } from "react";
import { Modal, Form, message } from "antd";
import Collapse from "../../../../../../Shared/Collapse/Collapse";
import BranchInfo from "./Section/BranchInfo";
import FooterBar from "../../../../../Footer/Footer";
import axios from "axios";

const BranchCreateDlg = ({ visible, onClose, onSubmit, form, selectedBranch, isViewMode, departments, canUpdate, canCreate }) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    if (visible && !isViewMode && !selectedBranch) {
      const fetchBranchCode = async () => {
        try {
          setIsLoading(true);
          const response = await axios.get("/api/Branch/GetCodeBranch");
          const { code, data, errors } = response.data;

          if (isMounted && code === 0 && data) {
            form.setFieldsValue({
              branchCode: data,
              branchName: "",
              address: "",
              status: "Active",
              departmentName: [],
            });
          } else {
            throw new Error(errors?.[0] || "Failed to fetch branch code");
          }
        } catch (err) {
          console.error("Fetch branch code error:", {
            message: err.message,
            response: err.response?.data,
            status: err.response?.status,
          });
          const errorMessage =
            err.response?.data?.errors?.[0] ||
            err.response?.data?.message ||
            err.message ||
            "An error occurred while fetching branch code";
          message.error(errorMessage);
          if (isMounted) {
            form.setFieldsValue({
              branchCode: `BR${Math.floor(Math.random() * 1000).toString().padStart(3, "0")}`,
              branchName: "",
              address: "",
              status: "Active",
              departmentName: [],
            });
          }
        } finally {
          if (isMounted) setIsLoading(false);
        }
      };

      fetchBranchCode();
    } else if (visible) {
      const initialValues = {
        branchCode: selectedBranch
          ? selectedBranch.id
          : `BR${Math.floor(Math.random() * 1000).toString().padStart(3, "0")}`,
        branchName: selectedBranch ? selectedBranch.branchName : "",
        address: selectedBranch ? selectedBranch.address : "",
        status: selectedBranch ? selectedBranch.status : "Active",
        departmentName: selectedBranch ? selectedBranch.departmentName : [],
      };
      form.setFieldsValue(initialValues);
    }

    return () => {
      isMounted = false;
    };
  }, [visible, form, selectedBranch, isViewMode]);

  const handleSave = async () => {
    if (isViewMode || isLoading) return;
    if (selectedBranch && !canUpdate) {
      message.error("Bạn không có quyền chỉnh sửa chi nhánh.");
      return;
    }
    if (!selectedBranch && !canCreate) {
      message.error("Bạn không có quyền tạo mới chi nhánh.");
      return;
    }

    setIsLoading(true);

    try {
      // Validate all fields
      const values = await form.validateFields();
      
      // If validation passes, proceed with API call
      const branchData = {
        Id: values.branchCode,
        BranchName: values.branchName,
        Address: values.address,
        Status: values.status,
        DepartmentName: values.departmentName,
      };

      let response;
      if (selectedBranch) {
        response = await axios.put(`/api/Branch/${branchData.Id}`, branchData);
      } else {
        response = await axios.post("/api/Branch", branchData);
      }

      if (response.status === 200) {
        message.success(
          selectedBranch ? "Cập nhật chi nhánh thành công!" : "Tạo chi nhánh thành công!"
        );
        onSubmit(branchData);
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
      console.error("Branch operation error:", err);
      if (err.response) {
        const { status, data } = err.response;
        const { code, errors } = data || {};
        const errorMsg = errors?.[0] || "Không thể xử lý yêu cầu.";
        message.error(
          status === 400
            ? code === 1011
              ? "Chi nhánh đã tồn tại, không thể tạo."
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
    <Modal
      open={visible}
      title={
        isViewMode
          ? "Thông tin chi nhánh"
          : selectedBranch
          ? "Chỉnh sửa thông tin chi nhánh"
          : "Cài đặt thông tin chi nhánh"
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
      width={1200}
      centered={true}
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
                ? "Thông tin chi nhánh"
                : selectedBranch
                ? "Chỉnh sửa thông tin chi nhánh"
                : "Cài đặt thông tin chi nhánh",
              children: <BranchInfo form={form} isViewMode={isViewMode} departments={departments} />,
            }}
          />
        </div>
      </Form>
    </Modal>
  );
};

export default BranchCreateDlg;