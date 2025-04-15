import React, { useState } from "react";
import { Form, message } from "antd";
import { useNavigate } from "react-router-dom";
import Collapse from "../../../Shared/Collapse/Collapse";
import WorkInfo from "./Section/WorkInfo";
import FooterBar from "../../Footer/Footer";
import AccountInfo from "./Section/AccountInfo";
import moment from "moment";
function CreatePersonel() {
  const [form] = Form.useForm();
  const [isSavedSuccessfully, setIsSavedSuccessfully] = useState(false);
  const [avatarImage, setAvatarImage] = useState(null);
  const navigate = useNavigate();

  const initialValues = {
    fullName: 'Nguyễn Văn A',
    dateOfBirth: '1/1/2002',
    gender: 'Nữ',
    username: '0058', 
    password: '12345678', 
    joinDate: moment(),
  };

  const handleCancel = () => {
    form.resetFields();
    setAvatarImage(null);
    setIsSavedSuccessfully(false);
  };

  const handleSave = () => {
    form
      .validateFields()
      .then(() => {
        const formData = form.getFieldsValue();

        const convertDateToObject = (date) => {
          if (date) {
            return {
              date: date.date(),
              month: date.month() + 1,
              year: date.year(),
            };
          }
          return null;
        };

        const joinDate = convertDateToObject(formData.joinDate);

        const dataToSend = {
          joinDate: joinDate,
          department: formData.department,
          jobTitle: formData.jobTitle,
          level: formData.level,
          position: formData.position,
          managedBy: formData.managedBy,
          workLocation: formData.workLocation,
          workMode: formData.workMode,
          lunchBreak: formData.lunchBreak,
          avatar: formData.avatar,
          username: formData.username,
          password: formData.password,
          roleGroup: formData.roleGroup,
        };

        console.log("Dữ liệu cần gửi đi: ", dataToSend);
        setIsSavedSuccessfully(true);
        message.success("Lưu dữ liệu thành công!");
      })
      .catch((errorInfo) => {
        message.error("Lưu thất bại! Vui lòng nhập đầy đủ các trường bắt buộc.");
        console.log("Lỗi khi lưu dữ liệu: ", errorInfo);
        setIsSavedSuccessfully(false);
      });
  };

  const handleNext = () => {
    if (isSavedSuccessfully) {
      navigate('/create/contract');
    }
  };
  const handleBack = () => {
    navigate('/create/personal')
  };

  return (
    <>
      <Form form={form} layout="vertical" initialValues={initialValues}>
        <div className="scroll-container">
          <div className="collapse-container">
            <Collapse
              item={{
                key: "1",
                header: "Thông tin công việc",
                children: <WorkInfo />,
              }}
            />
          </div>

          <div className="collapse-container">
            <Collapse
              item={{
                key: "2",
                header: "Thông tin tài khoản",
                children: (
                  <AccountInfo
                    setAvatarImage={setAvatarImage}
                    avatarImage={avatarImage}
                  />
                ),
              }}
            />
          </div>
        </div>
      </Form>

      <FooterBar
        onSave={handleSave}
        onCancel={handleCancel}
        onNext={handleNext}
        onBack={handleBack}
        showNext={isSavedSuccessfully}
        showBack={true}
        showCancel={true}
        showSave={true}
      />
    </>
  );
}

export default CreatePersonel;