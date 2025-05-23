import React, { useState } from "react";
import TableComponent from "../../../../../Shared/Table/Table";
import { useNavigate } from "react-router-dom";
import JobTitleDlg from "./JobTitleDlg/JobTitleDlg";
import { Form, message } from "antd";
import styles from "./styles.module.css";

const JobTitle = () => {
  const navigate = useNavigate();
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [form] = Form.useForm();
  const [selectedJobTitle, setSelectedJobTitle] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [jobTitleData, setJobTitleData] = useState([
    {
      jobTitleCode: "JT001",
      jobTitleName: "Nhân viên Kế toán",
      rank: "Cấp 4",
      description: "Thực hiện các công việc kế toán cơ bản.",
      permissionGroup: "Quản trị viên",
    },
    {
      jobTitleCode: "JT002",
      jobTitleName: "Chuyên viên Nhân sự",
      rank: "Cấp 3",
      description: "Quản lý hồ sơ nhân sự và tuyển dụng.",
      permissionGroup: "Người dùng",
    },
    {
      jobTitleCode: "JT003",
      jobTitleName: "Nhân viên Marketing",
      rank: "Cấp 4",
      description: "Hỗ trợ xây dựng chiến lược quảng bá.",
      permissionGroup: "Người dùng",
    },
    {
      jobTitleCode: "JT004",
      jobTitleName: "Kỹ sư Phần mềm",
      rank: "Cấp 3",
      description: "Phát triển và bảo trì phần mềm.",
      permissionGroup: "Quản trị viên",
    },
  ]);

  const columns = [
    { label: "Mã chức vụ", key: "jobTitleCode" },
    { label: "Tên chức vụ", key: "jobTitleName" },
    { label: "Cấp bậc", key: "rank" },
    { label: "Nhóm quyền", key: "permissionGroup" },
    { label: "Mô tả", key: "description" },
  ];

  const handleEdit = (item) => {
    setSelectedJobTitle(item);
    setIsViewMode(false);
    setIsDialogVisible(true);
  };

  const handleDelete = (item) => {
    alert(`Deleting job title: ${item.jobTitleName}`);
  };

  const handleCreate = () => {
    setSelectedJobTitle(null);
    setIsViewMode(false);
    setIsDialogVisible(true);
  };

  const handleView = (item) => {
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

  const handleDialogSubmit = (values) => {
    if (selectedJobTitle) {
      // Update existing job title
      setJobTitleData((prev) =>
        prev.map((item) =>
          item.jobTitleCode === values.jobTitles[0].jobTitleCode
            ? {
                ...item,
                jobTitleName: values.jobTitles[0].title,
                rank: values.jobTitles[0].rank,
                permissionGroup: values.jobTitles[0].permissionGroup,
                description: values.jobTitles[0].description,
              }
            : item
        )
      );
      message.success("Cập nhật chức vụ thành công!");
    } else {
      // Add new job title
      setJobTitleData((prev) => [
        ...prev,
        {
          jobTitleCode: values.jobTitles[0].jobTitleCode,
          jobTitleName: values.jobTitles[0].title,
          rank: values.jobTitles[0].rank,
          permissionGroup: values.jobTitles[0].permissionGroup,
          description: values.jobTitles[0].description,
        },
      ]);
      message.success("Tạo chức vụ thành công!");
    }
    handleDialogClose();
  };

  const filterData = (data, searchTerm) => {
    return data.filter(
      (item) =>
        (item.jobTitleCode || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.jobTitleName || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

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
      />
      <JobTitleDlg
        visible={isDialogVisible}
        onClose={handleDialogClose}
        onSubmit={handleDialogSubmit}
        form={form}
        selectedJobTitle={selectedJobTitle}
        isViewMode={isViewMode}
      />
    </div>
  );
};

export default JobTitle;