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
    const token = localStorage.getItem("accessToken");
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
  const [permissions, setPermissions] = useState([]);

  // Fetch permissions from localStorage
  useEffect(() => {
    const storedPermissions = JSON.parse(localStorage.getItem("permissions")) || [];
    setPermissions(storedPermissions);
  }, []);

  // Fetch roles from API
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

  const hasAllModuleAuthority = permissions.some(
    (p) => p.moduleId === "allModule" && p.actionId === "fullAuthority"
  );
  const canCreate = hasAllModuleAuthority || permissions.some(
    (p) => p.moduleId === "permission" && p.actionId === "create"
  );
  const canUpdate = hasAllModuleAuthority || permissions.some(
    (p) => p.moduleId === "permission" && p.actionId === "update"
  );
  const canDelete = hasAllModuleAuthority || permissions.some(
    (p) => p.moduleId === "permission" && p.actionId === "delete"
  );
  const canView = hasAllModuleAuthority || permissions.some(
    (p) => p.moduleId === "permission" && p.actionId === "view"
  );

  const handleEdit = (item) => {
    if (!canUpdate) {
      message.error("Bạn không có quyền chỉnh sửa nhóm quyền.");
      return;
    }
    setSelectedRole(item);
    setIsViewMode(false);
    setIsDialogVisible(true);
  };

  const handleDelete = async (item) => {
    if (!canDelete) {
      message.error("Bạn không có quyền xóa nhóm quyền.");
      return;
    }
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
    if (!canCreate) {
      message.error("Bạn không có quyền tạo mới nhóm quyền.");
      return;
    }
    setSelectedRole(null);
    setIsViewMode(false);
    setIsDialogVisible(true);
  };

  const handleView = (item) => {
    if (!canView) {
      message.error("Bạn không có quyền xem chi tiết nhóm quyền.");
      return;
    }
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
        disableCreate={!canCreate} 
        showView={true}
        disableView = {!canView}
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
        canUpdate={canUpdate}
        canCreate={canCreate}
      />
    </div>
  );
};

export default RolePermission;