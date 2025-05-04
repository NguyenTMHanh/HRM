import React, { useEffect } from "react";
import { Modal, Form, message } from "antd";
import Collapse from "../../../../../../Shared/Collapse/Collapse";
import Rank from "./Section/Rank";
import FooterBar from "../../../../../Footer/Footer";

const RankDlg = ({ visible, onClose, onSubmit, form, selectedRank, isViewMode }) => {
  const initialValues = {
    ranks: [
      {
        rankCode: selectedRank
          ? selectedRank.rankCode
          : `R${Math.floor(Math.random() * 1000)}`.padStart(4, "0"),
        priority: selectedRank ? selectedRank.priority : 1,
        name: selectedRank ? selectedRank.rankName : "",
        description: selectedRank ? selectedRank.description : "",
      },
    ],
  };

  useEffect(() => {
    if (visible) {
      form.setFieldsValue(initialValues);
    }
  }, [visible, form, selectedRank]);

  const handleSave = () => {
    if (isViewMode) return;
    form
      .validateFields()
      .then((values) => {
        const dataToSend = {
          ranks: values.ranks || [],
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
                ? "Xem cấp bậc"
                : selectedRank
                ? "Chỉnh sửa cấp bậc"
                : "Cài đặt cấp bậc",
              children: <Rank form={form} isViewMode={isViewMode} />,
            }}
          />
        </div>
      </Form>
    </Modal>
  );
};

export default RankDlg;