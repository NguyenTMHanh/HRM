import React, { useState, useEffect } from "react";
import { Form, message } from "antd";
import { useNavigate } from "react-router-dom";
import Collapse from "../../../Shared/Collapse/Collapse";
import WorkInfo from "./Section/WorkInfo";
import AccountInfo from "./Section/AccountInfo";
import FooterBar from "../../Footer/Footer";
import moment from "moment";
import "./styles.css";

function CreatePersonel({ initialData, onSave, isModalFooter = false }) {
  const [form] = Form.useForm();
  const [isSavedSuccessfully, setIsSavedSuccessfully] = useState(false);
  const [avatarImage, setAvatarImage] = useState(null);
  const navigate = useNavigate();

  // Define default values for the form
  const initialValues = {
    fullName: 'Nguyễn Văn A',
    dateOfBirth: moment('01/01/2002', 'DD/MM/YYYY'),
    gender: 'Nữ',
    username: '0058',
    password: '12345678',
    joinDate: moment(),
  };

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue({
        fullName: initialData.fullName || initialValues.fullName,
        dateOfBirth: initialData.dateOfBirth
          ? moment(initialData.dateOfBirth, 'DD/MM/YYYY')
          : initialValues.dateOfBirth,
        gender: initialData.gender || initialValues.gender,
        username: initialData.username || initialValues.username,
        password: initialData.password || initialValues.password,
        joinDate: initialData.joinDate
          ? moment(initialData.joinDate, 'DD/MM/YYYY')
          : initialValues.joinDate,
        department: initialData.department,
        jobTitle: initialData.jobTitle,
        level: initialData.level,
        position: initialData.position,
        managedBy: initialData.managedBy,
        workLocation: initialData.workLocation,
        workMode: initialData.workMode,
        lunchBreak: initialData.lunchBreak,
        avatar: initialData.avatar,
        roleGroup: initialData.roleGroup,
      });
      setAvatarImage(initialData.avatar);
    } else {
      form.setFieldsValue(initialValues);
    }
  }, [initialData, form]);

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

        const dataToSend = {
          fullName: formData.fullName,
          dateOfBirth: formData.dateOfBirth && moment.isMoment(formData.dateOfBirth)
            ? formData.dateOfBirth.format('DD/MM/YYYY')
            : null,
          gender: formData.gender,
          username: formData.username,
          password: formData.password,
          joinDate: formData.joinDate && moment.isMoment(formData.joinDate)
            ? formData.joinDate.format('DD/MM/YYYY')
            : null,
          department: formData.department,
          jobTitle: formData.jobTitle,
          level: formData.level,
          position: formData.position,
          managedBy: formData.managedBy,
          workLocation: formData.workLocation,
          workMode: formData.workMode,
          lunchBreak: formData.lunchBreak,
          avatar: avatarImage || formData.avatar,
          roleGroup: formData.roleGroup,
        };

        console.log("Data to send: ", dataToSend);
        setIsSavedSuccessfully(true);

        if (typeof onSave === 'function') {
          onSave(dataToSend);
          message.success("Cập nhật thông tin nhân sự thành công!");
        } else {
          message.success("Tạo mới thông tin nhân sự thành công!");
        }
      })
      .catch((errorInfo) => {
        message.error("Lưu thất bại! Vui lòng nhập đầy đủ các trường bắt buộc.");
        console.log("Error saving data: ", errorInfo);
        setIsSavedSuccessfully(false);
      });
  };

  const handleNext = () => {
    if (isSavedSuccessfully) {
      navigate('/create/contract');
    }
  };

  const handleBack = () => {
    navigate('/create/personal');
  };

  return (
    <div className="modal-content-wrapper" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        style={{ flex: '1 1 auto', overflowY: 'auto' }}
      >
        <div className="scroll-container">
          <div className="collapse-container">
            <Collapse
              item={{
                key: "1",
                header: "Thông tin công việc",
                children: <WorkInfo form={form} />,
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
                    form={form}
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
        showNext={isModalFooter ? false : isSavedSuccessfully}
        showBack={!isModalFooter} 
        showCancel={true}
        showSave={true}
        isModalFooter={isModalFooter}
        style={{ flexShrink: 0 }}
      />
    </div>
  );
}

export default CreatePersonel;