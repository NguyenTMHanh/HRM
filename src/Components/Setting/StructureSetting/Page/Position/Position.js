import React, { useState } from "react";
import TableComponent from "../../../../../Shared/Table/Table";
import { useNavigate } from "react-router-dom";
import PositionDlg from "./PositionDlg/PositionDlg";
import { Form, message } from "antd";
import styles from "./styles.module.css";

const Position = () => {
  const navigate = useNavigate();
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [form] = Form.useForm();
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [positionData, setPositionData] = useState([
    {
      positionCode: "POS001",
      positionName: "Nhân viên Kế toán",
      department: "Bộ phận Kế toán",
      description: "Thực hiện các công việc kế toán cơ bản.",
    },
    {
      positionCode: "POS002",
      positionName: "Chuyên viên Nhân sự",
      department: "Bộ phận Nhân sự",
      description: "Quản lý hồ sơ nhân sự và tuyển dụng.",
    },
    {
      positionCode: "POS003",
      positionName: "Nhân viên Marketing",
      department: "Bộ phận Marketing",
      description: "Hỗ trợ xây dựng chiến lược quảng bá.",
    },
    {
      positionCode: "POS004",
      positionName: "Kỹ sư Phần mềm",
      department: "Bộ phận Công nghệ",
      description: "Phát triển và bảo trì phần mềm.",
    },
  ]);

  const columns = [
    { label: "Mã vị trí", key: "positionCode" },
    { label: "Tên vị trí", key: "positionName" },
    { label: "Bộ phận", key: "department" },
    { label: "Mô tả", key: "description" },
  ];

  const handleEdit = (item) => {
    setSelectedPosition(item);
    setIsViewMode(false);
    setIsDialogVisible(true);
  };

  const handleDelete = (item) => {
    alert(`Deleting position: ${item.positionName}`);
  };

  const handleCreate = () => {
    setSelectedPosition(null);
    setIsViewMode(false);
    setIsDialogVisible(true);
  };

  const handleView = (item) => {
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

  const handleDialogSubmit = (values) => {
    if (selectedPosition) {
      console.log("Call API edit");
      message.success("Cập nhật vị trí thành công!");
    } else {
      message.success("Tạo vị trí thành công!");
    }
    setIsDialogVisible(false);
    form.resetFields();
  };

  const filterData = (data, searchTerm) => {
    return data.filter(
      (item) =>
        item.positionCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.positionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <div className={styles.tableContent}>
      <TableComponent
        data={positionData}
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
      <PositionDlg
        visible={isDialogVisible}
        onClose={handleDialogClose}
        onSubmit={handleDialogSubmit}
        form={form}
        selectedPosition={selectedPosition}
        isViewMode={isViewMode}
      />
    </div>
  );
};

export default Position;