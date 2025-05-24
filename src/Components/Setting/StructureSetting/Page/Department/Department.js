import React, { useState, useEffect } from "react";
import TableComponent from "../../../../../Shared/Table/Table";
import { useNavigate } from "react-router-dom";
import DepartmentDlg from "./DepartmentDlg/DepartmentDlg";
import { Form, message } from "antd";
import styles from "./styles.module.css";
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

const Department = () => {
  const navigate = useNavigate();
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [form] = Form.useForm();
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [departmentData, setDepartmentData] = useState([]);
  const [permissions, setPermissions] = useState([]);

  // Fetch permissions from localStorage
  useEffect(() => {
    const storedPermissions = JSON.parse(localStorage.getItem("permissions")) || [];
    setPermissions(storedPermissions);
  }, []);

  // Fetch departments from API
  const fetchDepartments = async () => {
    try {
      const response = await axios.get("/api/Department");
      const departments = response.data.map((department) => ({
        departmentCode: department.id,
        departmentName: department.departmentName,
        description: department.description,
      }));
      setDepartmentData(departments);
    } catch (err) {
      console.error("Error fetching departments:", err);
      message.error("Không thể tải danh sách bộ phận.");
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // Permission checks
  const hasAllModuleAuthority = permissions.some(
    (p) => p.moduleId === "allModule" && p.actionId === "fullAuthority"
  );
  const canCreate = hasAllModuleAuthority || permissions.some(
    (p) => p.moduleId === "setting" && p.actionId === "create"
  );
  const canUpdate = hasAllModuleAuthority || permissions.some(
    (p) => p.moduleId === "setting" && p.actionId === "update"
  );
  const canDelete = hasAllModuleAuthority || permissions.some(
    (p) => p.moduleId === "setting" && p.actionId === "delete"
  );
  const canView = hasAllModuleAuthority || permissions.some(
    (p) => p.moduleId === "setting" && p.actionId === "view"
  );

  const handleEdit = (item) => {
    if (!canUpdate) {
      message.error("Bạn không có quyền chỉnh sửa bộ phận.");
      return;
    }
    setSelectedDepartment(item);
    setIsViewMode(false);
    setIsDialogVisible(true);
  };

  const handleDelete = async (item) => {
    if (!canDelete) {
      message.error("Bạn không có quyền xóa bộ phận.");
      return;
    }
    try {
      const response = await axios.delete(`/api/Department/${item.departmentCode}`);
      if (response.status === 200) {
        message.success("Xóa bộ phận thành công!");
        fetchDepartments();
      } else {
        message.error("Xóa bộ phận thất bại!");
      }
    } catch (err) {
      console.error("Error deleting department:", err);
      message.error("Không thể xóa bộ phận!");
    }
  };

  const handleCreate = () => {
    if (!canCreate) {
      message.error("Bạn không có quyền tạo mới bộ phận.");
      return;
    }
    setSelectedDepartment(null);
    setIsViewMode(false);
    setIsDialogVisible(true);
  };

  const handleView = (item) => {
    if (!canView) {
      message.error("Bạn không có quyền xem chi tiết bộ phận.");
      return;
    }
    setSelectedDepartment(item);
    setIsViewMode(true);
    setIsDialogVisible(true);
  };

  const handleDialogClose = () => {
    setSelectedDepartment(null);
    setIsViewMode(false);
    setIsDialogVisible(false);
    form.resetFields();
  };

  const handleDialogSubmit = () => {
    fetchDepartments();
    handleDialogClose();
  };

  const filterData = (data, searchTerm) => {
    return data.filter((item) => {
      const search = searchTerm.toLowerCase();
      return (
        (item.departmentCode || "").toLowerCase().includes(search) ||
        (item.departmentName || "").toLowerCase().includes(search) ||
        (item.description || "").toLowerCase().includes(search)
      );
    });
  };

  const columns = [
    { label: "Mã bộ phận", key: "departmentCode" },
    { label: "Tên bộ phận", key: "departmentName" },
    { label: "Mô tả", key: "description" },
  ];

  return (
    <div className={styles.tableContent}>
      <TableComponent
        data={departmentData}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        showAdd={false}
        showView={true}
        showCreate={true}
        onCreate={handleCreate}
        onBranchShow={false}
        onDepartmentShow={false}
        filterData={filterData}
        canCreate={canCreate}
        canUpdate={canUpdate}
        canDelete={canDelete}
        canView={canView}
      />
      <DepartmentDlg
        visible={isDialogVisible}
        onClose={handleDialogClose}
        onSubmit={handleDialogSubmit}
        form={form}
        selectedDepartment={selectedDepartment}
        isViewMode={isViewMode}
        canUpdate={canUpdate}
        canCreate={canCreate}
      />
    </div>
  );
};

export default Department;