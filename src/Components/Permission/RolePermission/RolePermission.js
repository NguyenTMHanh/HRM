import React, { useState, useEffect } from "react";
import TableComponent from "../../../Shared/Table/Table";
import { useNavigate } from "react-router-dom";
import RolePermissionDlg from "./Dialog/RolePermissionDlg";
import styles from "./styles.module.css";
import { Form, message } from "antd";
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

const RolePermission = () => {
  const navigate = useNavigate();
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [form] = Form.useForm();
  const [selectedRole, setSelectedRole] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [roleData, setRoleData] = useState([]);

  const fetchRoles = async () => {
    try {
      const response = await axios.get("/api/Role");
      const roles = response.data.map((role) => ({
        roleCode: role.id,
        roleName: role.name,
        description: role.description,
        permissions: role.roleModuleActions.reduce((acc, action) => {
          acc[`${action.moduleId}_${action.actionId}`] = true;
          return acc;
        }, {}),
      }));
      setRoleData(roles);
    } catch (err) {
      console.error("Error fetching roles:", err);
      message.error("Không thể tải danh sách quyền.");
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleEdit = (item) => {
    setSelectedRole(item);
    setIsViewMode(false);
    setIsDialogVisible(true);
  };

  const handleDelete = async (item) => {
    try {
      const response = await axios.delete(`/api/Role/${item.roleCode}`);
      if (response.status === 200) {
        message.success("Xóa nhóm quyền thành công!");
        fetchRoles();
      } else {
        message.error("Xóa nhóm quyền thất bại!");
      }
    } catch (err) {
      console.error("Error deleting role:", err);
      message.error("Không thể xóa nhóm quyền!");
    }
  };

  const handleCreate = () => {
    setSelectedRole(null);
    setIsViewMode(false);
    setIsDialogVisible(true);
  };

  const handleView = (item) => {
    setSelectedRole(item);
    setIsViewMode(true);
    setIsDialogVisible(true);
  };

  const handleDialogClose = () => {
    form.resetFields();
    setIsDialogVisible(false);
    setSelectedRole(null);
    setIsViewMode(false);
  };

  const handleDialogSubmit = async (values) => {
    // Chỉ cần làm mới danh sách sau khi tạo mới hoặc cập nhật
    fetchRoles();
    setIsDialogVisible(false);
    form.resetFields();
  };

  const filterData = (data, searchTerm) => {
    return data.filter((item) => {
      const search = searchTerm.toLowerCase();
      return (
        (item.roleCode || "").toLowerCase().includes(search) ||
        (item.roleName || "").toLowerCase().includes(search)
      );
    });
  };

  const columns = [
    { label: "Mã nhóm quyền", key: "roleCode" },
    { label: "Tên nhóm quyền", key: "roleName" },
    { label: "Mô tả", key: "description" },
  ];

  return (
    <div className={styles.tableContent}>
      <TableComponent
        data={roleData}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        showAdd={false}
        showCreate={true}
        showView={true}
        onCreate={handleCreate}
        onBranchShow={false}
        onDepartmentShow={false}
        filterData={filterData}
      />
      <RolePermissionDlg
        visible={isDialogVisible}
        onClose={handleDialogClose}
        onSubmit={handleDialogSubmit}
        form={form}
        selectedRole={selectedRole}
        isViewMode={isViewMode}
      />
    </div>
  );
};

export default RolePermission;