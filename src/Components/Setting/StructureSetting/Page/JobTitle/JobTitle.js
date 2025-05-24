import React, { useState, useEffect } from "react";
import TableComponent from "../../../../../Shared/Table/Table";
import { useNavigate } from "react-router-dom";
import JobTitleDlg from "./JobTitleDlg/JobTitleDlg";
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

const JobTitle = () => {
  const navigate = useNavigate();
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [form] = Form.useForm();
  const [selectedJobTitle, setSelectedJobTitle] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [jobTitleData, setJobTitleData] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [ranks, setRanks] = useState([]);
  const [roles, setRoles] = useState([]);

  // Fetch permissions from localStorage
  useEffect(() => {
    const storedPermissions = JSON.parse(localStorage.getItem("permissions")) || [];
    setPermissions(storedPermissions);
  }, []);

  // Fetch job titles from API
  const fetchJobTitles = async () => {
    try {
      const response = await axios.get("/api/JobTitle");
      const jobTitles = response.data.map((job) => ({
        jobTitleCode: job.id || "", // Corrected to lowercase "id"
        jobTitleName: job.jobtitleName || "", // Corrected to lowercase "jobtitleName"
        rank: job.rankName || "", // Corrected to lowercase "rankName"
        permissionGroup: job.roleName || "", // Corrected to lowercase "roleName"
        description: job.description || "", // Corrected to lowercase "description"
      }));
      setJobTitleData(jobTitles);
    } catch (err) {
      console.error("Error fetching job titles:", err);
      message.error("Không thể tải danh sách chức vụ.");
    }
  };

  // Fetch ranks from API
  const fetchRanks = async () => {
    try {
      const response = await axios.get("/api/Rank");
      setRanks(response.data);
    } catch (err) {
      console.error("Error fetching ranks:", err);
      message.error("Không thể tải danh sách cấp bậc.");
    }
  };

  // Fetch roles from API
  const fetchRoles = async () => {
    try {
      const response = await axios.get("/api/Role");
      setRoles(response.data);
    } catch (err) {
      console.error("Error fetching roles:", err);
      message.error("Không thể tải danh sách vai trò.");
    }
  };

  useEffect(() => {
    fetchJobTitles();
    fetchRanks();
    fetchRoles();
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
      message.error("Bạn không có quyền chỉnh sửa chức vụ.");
      return;
    }
    setSelectedJobTitle(item);
    setIsViewMode(false);
    setIsDialogVisible(true);
  };

  const handleDelete = async (item) => {
    if (!canDelete) {
      message.error("Bạn không có quyền xóa chức vụ.");
      return;
    }
    try {
      const response = await axios.delete(`/api/JobTitle/${item.jobTitleCode}`);
      if (response.status === 200) {
        message.success("Xóa chức vụ thành công!");
        fetchJobTitles();
      } else {
        message.error("Xóa chức vụ thất bại!");
      }
    } catch (err) {
      console.error("Error deleting job title:", err);
      message.error("Không thể xóa chức vụ!");
    }
  };

  const handleCreate = () => {
    if (!canCreate) {
      message.error("Bạn không có quyền tạo mới chức vụ.");
      return;
    }
    setSelectedJobTitle(null);
    setIsViewMode(false);
    setIsDialogVisible(true);
  };

  const handleView = (item) => {
    if (!canView) {
      message.error("Bạn không có quyền xem chi tiết chức vụ.");
      return;
    }
    setSelectedJobTitle(item);
    setIsViewMode(true);
    setIsDialogVisible(true);
  };

  const handleDialogClose = () => {
    form.resetFields();
    setIsDialogVisible(false);
    setSelectedJobTitle(null);
    setIsViewMode(false);
  };

  const handleDialogSubmit = async (values) => {
    const jobTitleData = values.jobTitles[0];
    const dataToSend = {
      Id: jobTitleData.jobTitleCode,
      JobtitleName: jobTitleData.title,
      Description: jobTitleData.description,
      RankName: jobTitleData.rank,
      RoleName: jobTitleData.permissionGroup,
    };

    try {
      if (selectedJobTitle) {
        const response = await axios.put(`/api/JobTitle/${jobTitleData.jobTitleCode}`, dataToSend);
        if (response.status === 200) {
          message.success("Cập nhật chức vụ thành công!");
          fetchJobTitles();
        }
      } else {
        const response = await axios.post("/api/JobTitle", dataToSend);
        if (response.status === 200) {
          message.success("Tạo chức vụ thành công!");
          fetchJobTitles();
        }
      }
    } catch (err) {
      console.error("Error submitting job title:", err);
      message.error("Không thể xử lý yêu cầu!");
    }
    handleDialogClose();
  };

  const filterData = (data, searchTerm) => {
    return data.filter((item) => {
      const search = searchTerm.toLowerCase();
      return (
        (item.jobTitleCode || "").toLowerCase().includes(search) ||
        (item.jobTitleName || "").toLowerCase().includes(search)
      );
    });
  };

  const columns = [
    { label: "Mã chức vụ", key: "jobTitleCode" },
    { label: "Tên chức vụ", key: "jobTitleName" },
    { label: "Cấp bậc", key: "rank" },
    { label: "Nhóm quyền", key: "permissionGroup" },
    { label: "Mô tả", key: "description" },
  ];

  return (
    <div className={styles.tableContent}>
      <TableComponent
        data={jobTitleData}
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
      <JobTitleDlg
        visible={isDialogVisible}
        onClose={handleDialogClose}
        onSubmit={handleDialogSubmit}
        form={form}
        selectedJobTitle={selectedJobTitle}
        isViewMode={isViewMode}
        ranks={ranks}
        roles={roles}
      />
    </div>
  );
};

export default JobTitle;