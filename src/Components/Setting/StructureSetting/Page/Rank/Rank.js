import React, { useState, useEffect } from "react";
import TableComponent from "../../../../../Shared/Table/Table";
import { useNavigate } from "react-router-dom";
import RankDlg from "./RankDlg/RankDlg";
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

const Rank = () => {
  const navigate = useNavigate();
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [form] = Form.useForm();
  const [selectedRank, setSelectedRank] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [rankData, setRankData] = useState([]);
  const [permissions, setPermissions] = useState([]);

  // Fetch permissions from localStorage
  useEffect(() => {
    const storedPermissions = JSON.parse(localStorage.getItem("permissions")) || [];
    setPermissions(storedPermissions);
  }, []);

  // Fetch ranks from API
  const fetchRanks = async () => {
    try {
      const response = await axios.get("/api/Rank");
      const ranks = response.data.map((rank) => ({
        rankCode: rank.id,
        priorityLevel: parseInt(rank.priorityLevel, 10), // Renamed to priorityLevel
        rankName: rank.rankName,
        description: rank.description,
      }));
      setRankData(ranks);
    } catch (err) {
      console.error("Error fetching ranks:", err);
      message.error("Không thể tải danh sách cấp bậc.");
    }
  };

  useEffect(() => {
    fetchRanks();
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
      message.error("Bạn không có quyền chỉnh sửa cấp bậc.");
      return;
    }
    setSelectedRank(item);
    setIsViewMode(false);
    setIsDialogVisible(true);
  };

  const handleDelete = async (item) => {
    if (!canDelete) {
      message.error("Bạn không có quyền xóa cấp bậc.");
      return;
    }
    try {
      const response = await axios.delete(`/api/Rank/${item.rankCode}`);
      if (response.status === 200) {
        message.success("Xóa cấp bậc thành công!");
        fetchRanks();
      } else {
        message.error("Xóa cấp bậc thất bại!");
      }
    } catch (err) {
      console.error("Error deleting rank:", err);
      message.error("Không thể xóa cấp bậc!");
    }
  };

  const handleCreate = () => {
    if (!canCreate) {
      message.error("Bạn không có quyền tạo mới cấp bậc.");
      return;
    }
    setSelectedRank(null);
    setIsViewMode(false);
    setIsDialogVisible(true);
  };

  const handleView = (item) => {
    if (!canView) {
      message.error("Bạn không có quyền xem chi tiết cấp bậc.");
      return;
    }
    setSelectedRank(item);
    setIsViewMode(true);
    setIsDialogVisible(true);
  };

  const handleDialogClose = () => {
    form.resetFields();
    setIsDialogVisible(false);
    setSelectedRank(null);
    setIsViewMode(false);
  };

  const handleDialogSubmit = async (values) => {
    fetchRanks();
    setIsDialogVisible(false);
    form.resetFields();
  };

  const filterData = (data, searchTerm) => {
    return data.filter((item) => {
      const search = searchTerm.toLowerCase();
      return (
        (item.rankCode || "").toLowerCase().includes(search) ||
        (item.rankName || "").toLowerCase().includes(search)
      );
    });
  };

  const columns = [
    { label: "Mã số cấp bậc", key: "rankCode" },
    { label: "Mức độ ưu tiên", key: "priorityLevel" },
    { label: "Tên cấp bậc", key: "rankName" },
    { label: "Mô tả", key: "description" },
  ];

  return (
    <div className={styles.tableContent}>
      <TableComponent
        data={rankData}
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
        sortField="priorityLevel"
        canCreate={canCreate}
        canUpdate={canUpdate}
        canDelete={canDelete}
        canView={canView}
      />
      <RankDlg
        visible={isDialogVisible}
        onClose={handleDialogClose}
        onSubmit={handleDialogSubmit}
        form={form}
        selectedRank={selectedRank}
        isViewMode={isViewMode}
        canUpdate={canUpdate}
        canCreate={canCreate}
      />
    </div>
  );
};

export default Rank;