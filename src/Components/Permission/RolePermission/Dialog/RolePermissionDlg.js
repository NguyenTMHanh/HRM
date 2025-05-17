import React, { useEffect, useState } from "react";
import { Modal, Form, message } from "antd";
import Collapse from "../../../../Shared/Collapse/Collapse";
import RolePermissionCreate from "./Section/RolePermissionCreate";
import PermissionSelector from "./Section/PermissionSelector";
import FooterBar from "../../../Footer/Footer";
import axios from "axios";

axios.defaults.baseURL = 'https://localhost:7239';
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers['Content-Type'] = 'application/json';
    return config;
  },
  (error) => Promise.reject(error)
);

const RolePermissionDlg = ({ visible, onClose, onSubmit, form, selectedRole, isViewMode }) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (visible && !isViewMode && !selectedRole) {
      const fetchRoleCode = async () => {
        try {
          const response = await axios.get('/api/Role/GetCodeRole');
          const { code, data, errors } = response.data;

          if (code === 0 && data) {
            form.setFieldsValue({ roleCode: data });
          } else {
            throw new Error(errors?.[0] || 'Failed to fetch role code');
          }
        } catch (err) {
          console.error("Fetch role code error:", {
            message: err.message,
            response: err.response?.data,
            status: err.response?.status,
          });
          const errorMessage =
            err.response?.data?.errors?.[0] ||
            err.response?.data?.message ||
            err.message ||
            'An error occurred while fetching role code';
          message.error(errorMessage);
          form.setFieldsValue({ roleCode: `ROLE${Math.floor(Math.random() * 1000)}` });
        }
      };

      fetchRoleCode();
    } else if (visible) {
      const initialValues = {
        roleCode: selectedRole ? selectedRole.roleCode : `ROLE${Math.floor(Math.random() * 1000)}`,
        roleName: selectedRole ? selectedRole.roleName : "",
        description: selectedRole ? selectedRole.description : "",
        position: selectedRole ? selectedRole.position : "",
        permissions: selectedRole ? selectedRole.permissions : {},
      };
      form.setFieldsValue(initialValues);
    }
  }, [visible, form, selectedRole, isViewMode]);

  const handleSave = async () => {
    if (isViewMode || isLoading) return;
    setIsLoading(true);

    try {
      const values = await form.validateFields();
      const roleModuleActions = Object.entries(values.permissions || {})
        .filter(([key, value]) => value === true && !key.endsWith('_selectAll'))
        .map(([key]) => {
          const [moduleId, actionId] = key.split('_');
          return {
            moduleId,
            actionId,
            roleId: values.roleCode,
          };
        });

      const dataToSend = {
        id: values.roleCode,
        name: values.roleName,
        normalizedName: values.roleName.toUpperCase(),
        concurrencyStamp: "",
        description: values.description || "",
        roleModuleActions,
      };

      let response;
      if (selectedRole) {
        response = await axios.put(`/api/Role/${values.roleCode}`, dataToSend);
      } else {
        response = await axios.post('/api/Role/', dataToSend);
      }

      if (response.status === 200) {
        message.success(selectedRole ? 'Cập nhật nhóm quyền thành công!' : 'Tạo nhóm quyền thành công!');
        onSubmit(dataToSend);
        form.resetFields();
        onClose();
      } else {
        message.error(`Yêu cầu không thành công với mã trạng thái: ${response.status}`);
      }
    } catch (err) {
      console.error("Role operation error:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });

      if (err.response) {
        const { status, data } = err.response;
        const { code, errors } = data || {};

        if (status === 400) {
          if (code === 1006) {
            message.error('Nhóm quyền đã tồn tại, không thể tạo.');
          } else if (code === 1007) {
            message.error('Module không tồn tại trong hệ thống.');
          } else if (code === 1008) {
            message.error('Hành động không tồn tại trong hệ thống.');
          } else {
            message.error(errors?.[0] || 'Không thể xử lý yêu cầu.');
          }
        } else if (status === 401) {
          message.error('Bạn không có quyền thực hiện hành động này.');
        } else if (status === 500) {
          message.error('Lỗi server. Vui lòng thử lại sau.');
        } else {
          message.error(`Lỗi không xác định với mã trạng thái: ${status}`);
        }
      } else {
        message.error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    const currentRoleCode = form.getFieldValue('roleCode');

    form.resetFields();

    form.setFieldsValue({ roleCode: currentRoleCode });
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
            loading={isLoading}
          />
        )
      }
      onCancel={handleClose}
      width={1000}
    >
      <Form form={form} layout="vertical">
        <div className="collapse-container">
          <Collapse
            item={{
              key: "1",
              header: isViewMode
                ? "Thông tin nhóm quyền"
                : selectedRole
                  ? "Chỉnh sửa thông tin nhóm quyền"
                  : "Cài đặt thông tin nhóm quyền",
              children: <RolePermissionCreate form={form} isViewMode={isViewMode} />,
            }}
          />
        </div>

        <div className="collapse-container">
          <Collapse
            item={{
              key: "2",
              header: isViewMode
                ? "Quyền hạn"
                : selectedRole
                  ? "Chỉnh sửa quyền hạn"
                  : "Cài đặt quyền hạn",
              children: <PermissionSelector form={form} isViewMode={isViewMode} />,
            }}
          />
        </div>
      </Form>
    </Modal>
  );
};

export default RolePermissionDlg;