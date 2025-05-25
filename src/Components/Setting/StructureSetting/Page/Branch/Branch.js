import React, { useState, useEffect } from "react";
import TableComponent from "../../../../../Shared/Table/Table";
import Status from "../../../../../Shared/Status/Status";
import { useNavigate } from "react-router-dom";
import BranchCreateDlg from "./BranchCreateDlg/BranchCreateDlg";
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

const Branch = () => {
  const navigate = useNavigate();
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [form] = Form.useForm();
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [branchData, setBranchData] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [permissions, setPermissions] = useState([]);

  // Fetch permissions from localStorage
  useEffect(() => {
    const storedPermissions = JSON.parse(localStorage.getItem("permissions")) || [];
    setPermissions(storedPermissions);
  }, []);

  // Fetch branches from API
  const fetchBranches = async () => {
    try {
      const response = await axios.get("/api/Branch");
      const branches = response.data.map((branch) => ({
        id: branch.id || "",
        branchName: branch.branchName || "",
        address: branch.address || "",
        status: branch.status || "",
        departmentName: branch.departmentName || [],
      }));
      setBranchData(branches);
    } catch (err) {
      console.error("Error fetching branches:", err);
      message.error("Không thể tải danh sách chi nhánh.");
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
    fetchBranches();
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
      message.error("Bạn không có quyền chỉnh sửa chi nhánh.");
      return;
    }
    setSelectedBranch(item);
    setIsViewMode(false);
    setIsDialogVisible(true);
  };

  const handleDelete = async (item) => {
    if (!canDelete) {
      message.error("Bạn không có quyền xóa chi nhánh.");
      return;
    }
    try {
      const response = await axios.delete(`/api/Branch/${item.id}`);
      if (response.status === 200) {
        message.success("Xóa chi nhánh thành công!");
        fetchBranches();
      } else {
        message.error("Xóa chi nhánh thất bại!");
      }
    } catch (err) {
      console.error("Error deleting branch:", err);
      message.error("Không thể xóa chi nhánh!");
    }
  };

  const handleCreate = () => {
    if (!canCreate) {
      message.error("Bạn không có quyền tạo mới chi nhánh.");
      return;
    }
    setSelectedBranch(null);
    setIsViewMode(false);
    setIsDialogVisible(true);
  };

  const handleView = (item) => {
    if (!canView) {
      message.error("Bạn không có quyền xem chi tiết chi nhánh.");
      return;
    }
    setSelectedBranch(item);
    setIsViewMode(true);
    setIsDialogVisible(true);
  };

  const handleDialogClose = () => {
    form.resetFields();
    setSelectedBranch(null);
    setIsViewMode(false);
    setIsDialogVisible(false);
  };

  const handleDialogSubmit = async (values) => {
    fetchBranches();
    setIsDialogVisible(false);
    form.resetFields();
  };

  const filterData = (data, searchTerm) => {
    return data.filter((item) => {
      const search = searchTerm.toLowerCase();
      return (
        (item.id || "").toLowerCase().includes(search) ||
        (item.branchName || "").toLowerCase().includes(search) ||
        (item.address || "").toLowerCase().includes(search) ||
        (item.status === "Active" ? "đang hoạt động" : "ngừng hoạt động").toLowerCase().includes(search) ||
        (item.departmentName || []).some((dept) => (dept || "").toLowerCase().includes(search))
      );
    });
  };

  const columns = [
    { label: "Mã chi nhánh", key: "id" },
    { label: "Tên chi nhánh", key: "branchName" },
    { label: "Địa chỉ", key: "address" },
    {
      label: "Bộ phận",
      key: "departmentName",
      render: (departmentName) => (
        <div>
          {departmentName.map((dept, index) => (
            <div key={index}>{dept}</div>
          ))}
        </div>
      ),
    },
    {
      label: "Trạng thái",
      key: "status",
      render: (status) => <Status status={status === "Active" ? "active" : "inactive"} />,
    },
  ];

  return (
    <div className={styles.tableContent}>
      <TableComponent
        data={branchData}
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
      <BranchCreateDlg
        visible={isDialogVisible}
        onClose={handleDialogClose}
        onSubmit={handleDialogSubmit}
        form={form}
        selectedBranch={selectedBranch}
        isViewMode={isViewMode}
        departments={departments}
        canUpdate={canUpdate}
        canCreate={canCreate}
      />
    </div>
  );
};

export default Branch;