import React, { useEffect } from "react";
import { Modal, Form, message } from "antd";
import Collapse from "../../../../../../Shared/Collapse/Collapse";
import Position from "./Section/Position";
import FooterBar from "../../../../../Footer/Footer";

const PositionDlg = ({ visible, onClose, onSubmit, form, selectedPosition, isViewMode }) => {
  const getInitialValues = () => ({
    positions: [
      {
        positionCode: selectedPosition
          ? selectedPosition.positionCode
          : `POS${Math.floor(Math.random() * 1000).toString().padStart(3, "0")}`,
        name: selectedPosition ? selectedPosition.positionName : "",
        departmentId: selectedPosition ? selectedPosition.department : null,
        description: selectedPosition ? selectedPosition.description : "",
      },
    ],
  });

  useEffect(() => {
    if (visible) {
      form.resetFields(); // Reset form trước
      form.setFieldsValue(getInitialValues()); // Set giá trị mới
    }
  }, [visible, form, selectedPosition]);

  const handleSave = () => {
    if (isViewMode) return;
    form
      .validateFields()
      .then((values) => {
        const dataToSend = {
          positions: values.positions || [],
        };
        onSubmit(dataToSend);
        form.resetFields(); // Reset form sau khi submit
        onClose(); // Đóng dialog
      })
      .catch((errorInfo) => {
        message.error("Vui lòng nhập đầy đủ các trường bắt buộc.");
        console.log("Validation failed:", errorInfo);
      });
  };

  const handleCancel = () => {
    const currentPositionCode = form.getFieldValue(["positions", 0, "positionCode"]);
    form.resetFields(); // Reset form về trạng thái trống
    form.setFieldsValue({
      positions: [{ positionCode: currentPositionCode }], // Giữ lại positionCode
    });
  };

  const handleClose = () => {
    form.resetFields(); // Reset form khi đóng
    onClose(); // Gọi hàm onClose từ parent
  };

  return (
    <Modal
      open={visible}
      footer={
        isViewMode ? null : (
          <FooterBar
            onSave={handleSave}
            onCancel={handleCancel}
            showCancel={true}
            showSave={true}
            isModalFooter={true}
          />
        )
      }
      onCancel={handleClose}
      width={1000}
      centered={true}
    >
      <Form form={form} layout="vertical" initialValues={getInitialValues()}>
        <div className="collapse-container">
          <Collapse
            item={{
              key: "1",
              header: isViewMode
                ? "Xem vị trí"
                : selectedPosition
                ? "Chỉnh sửa vị trí"
                : "Cài đặt vị trí",
              children: <Position form={form} isViewMode={isViewMode} />,
            }}
          />
        </div>
      </Form>
    </Modal>
  );
};

export default PositionDlg;