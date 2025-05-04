import React, { useEffect } from "react";
import { Modal, Form, message } from "antd";
import Collapse from "../../../../../../Shared/Collapse/Collapse";
import Position from "./Section/Position";
import FooterBar from "../../../../../Footer/Footer";

const PositionDlg = ({ visible, onClose, onSubmit, form, selectedPosition, isViewMode }) => {
  const initialValues = {
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
  };

  useEffect(() => {
    if (visible) {
      form.setFieldsValue(initialValues);
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
        console.log("Form Data:", dataToSend);
        onSubmit(dataToSend);
        form.resetFields();
      })
      .catch((errorInfo) => {
        message.error("Vui lòng nhập đầy đủ các trường bắt buộc.");
        console.log("Validation failed:", errorInfo);
      });
  };

  const handleCancel = () => {
    form.resetFields();
  };

  const handleClose = () => {
    onClose();
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
    >
      <Form form={form} layout="vertical" initialValues={initialValues}>
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