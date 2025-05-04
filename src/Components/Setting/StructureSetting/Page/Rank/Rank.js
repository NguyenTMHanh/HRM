import React, { useState } from "react";
import TableComponent from "../../../../../Shared/Table/Table";
import { useNavigate } from "react-router-dom";
import RankDlg from "./RankDlg/RankDlg";
import { Form, message } from "antd";
import styles from "./styles.module.css";

const Rank = () => {
  const navigate = useNavigate();
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [form] = Form.useForm();
  const [selectedRank, setSelectedRank] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [rankData, setRankData] = useState([
    {
      rankCode: "R004",
      priority: 1,
      rankName: "Cấp 1",
      description: "Quản lý toàn bộ chi nhánh hoặc khu vực.",
    },
    {
      rankCode: "R003",
      priority: 2,
      rankName: "Cấp 2",
      description: "Chịu trách nhiệm quản lý một bộ phận.",
    },
    {
      rankCode: "R002",
      priority: 3,
      rankName: "Cấp 3",
      description: "Quản lý một nhóm nhỏ nhân viên.",
    },
    {
      rankCode: "R001",
      priority: 4,
      rankName: "Cấp 4",
      description: "Cấp bậc cơ bản cho nhân viên mới.",
    },
  ]);

  const columns = [
    { label: "Mã số cấp bậc", key: "rankCode" },
    { label: "Mức độ ưu tiên", key: "priority" },
    { label: "Tên cấp bậc", key: "rankName" },
    { label: "Mô tả", key: "description" },
  ];

  const handleEdit = (item) => {
    setSelectedRank(item);
    setIsViewMode(false);
    setIsDialogVisible(true);
  };

  const handleDelete = (item) => {
    alert(`Deleting rank: ${item.rankName}`);
  };

  const handleCreate = () => {
    setSelectedRank(null);
    setIsViewMode(false);
    setIsDialogVisible(true);
  };

  const handleView = (item) => {
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

  const handleDialogSubmit = (values) => {
    if (selectedRank) {
      console.log("Call Api edit");
      message.success("Cập nhật cấp bậc thành công!");
    } else {
      message.success("Tạo cấp bậc thành công!");
    }
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

  return (
    <div className={styles.tableContent}>
      <TableComponent
        data={rankData}
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
      />
      <RankDlg
        visible={isDialogVisible}
        onClose={handleDialogClose}
        onSubmit={handleDialogSubmit}
        form={form}
        selectedRank={selectedRank}
        isViewMode={isViewMode}
      />
    </div>
  );
};

export default Rank;