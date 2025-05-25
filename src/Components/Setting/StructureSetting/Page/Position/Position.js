import React, { useState, useEffect } from "react";
import TableComponent from "../../../../../Shared/Table/Table";
import { useNavigate } from "react-router-dom";
import PositionDlg from "./PositionDlg/PositionDlg";
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

const Position = () => {
  const navigate = useNavigate();
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [form] = Form.useForm();
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [positionData, setPositionData] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [departments, setDepartments] = useState([]);

  // Fetch permissions from localStorage
  useEffect(() => {
    const storedPermissions = JSON.parse(localStorage.getItem("permissions")) || [];
    setPermissions(storedPermissions);
  }, []);

  // Fetch positions from API
  const fetchPositions = async () => {
    try {
      const response = await axios.get("/api/Position");
      const positions = response.data.map((pos) => ({
        positionCode: pos.id || "",
        positionName: pos.positionName || "",
        department: pos.departmentName || "",
        description: pos.description || "",
      }));
      setPositionData(positions);
    } catch (err) {
      console.error("Error fetching positions:", err);
      message.error("Không thể tải danh sách vị trí.");
    }
  };

  // Fetch departments from API
  const fetchDepartments = async () => {
    try {
      const response = await axios.get("/api/Department");
      setDepartments(response.data);
    } catch (err) {
      console.error("Error fetching departments:", err);
      message.error("Không thể tải danh sách bộ phận.");
    }
  };

  useEffect(() => {
    fetchPositions();
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
      message.error("Bạn không có quyền chỉnh sửa vị trí.");
      return;
    }
    setSelectedPosition(item);
    setIsViewMode(false);
    setIsDialogVisible(true);
  };

  const handleDelete = async (item) => {
    if (!canDelete) {
      message.error("Bạn không có quyền xóa vị trí.");
      return;
    }
    try {
      const response = await axios.delete(`/api/Position/${item.positionCode}`);
      if (response.status === 200) {
        message.success("Xóa vị trí thành công!");
        fetchPositions();
      } else {
        message.error("Xóa vị trí thất bại!");
      }
    } catch (err) {
      console.error("Error deleting position:", err);
      message.error("Không thể xóa vị trí!");
    }
  };

  const handleCreate = () => {
    if (!canCreate) {
      message.error("Bạn không có quyền tạo mới vị trí.");
      return;
    }
    setSelectedPosition(null);
    setIsViewMode(false);
    setIsDialogVisible(true);
  };

  const handleView = (item) => {
    if (!canView) {
      message.error("Bạn không có quyền xem chi tiết vị trí.");
      return;
    }
    setSelectedPosition(item);
    setIsViewMode(true);
    setIsDialogVisible(true);
  };

  const handleDialogClose = () => {
    form.resetFields();
    setIsDialogVisible(false);
    setSelectedPosition(null);
    setIsViewMode(false);
  };

  const handleDialogSubmit = async (values) => {
    fetchPositions();
    setIsDialogVisible(false);
    form.resetFields();
  };

  const filterData = (data, searchTerm) => {
    return data.filter((item) => {
      const search = searchTerm.toLowerCase();
      return (
        (item.positionCode || "").toLowerCase().includes(search) ||
        (item.positionName || "").toLowerCase().includes(search) ||
        (item.department || "").toLowerCase().includes(search) ||
        (item.description || "").toLowerCase().includes(search)
      );
    });
  };

  const columns = [
    { label: "Mã vị trí", key: "positionCode" },
    { label: "Tên vị trí", key: "positionName" },
    { label: "Bộ phận", key: "department" },
    { label: "Mô tả", key: "description" },
  ];

  return (
    <div className={styles.tableContent}>
      <TableComponent
        data={positionData}
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
        canCreate={canCreate}
        canUpdate={canUpdate}
        canDelete={canDelete}
        canView={canView}
      />
      <PositionDlg
        visible={isDialogVisible}
        onClose={handleDialogClose}
        onSubmit={handleDialogSubmit}
        form={form}
        selectedPosition={selectedPosition}
        isViewMode={isViewMode}
        departments={departments}
        canUpdate={canUpdate}
        canCreate={canCreate}
      />
    </div>
  );
};

export default Position;