import React, { useState } from "react";
import { Form, message } from 'antd';
import { useNavigate } from 'react-router-dom'; 
import Collapse from "../../../Shared/Collapse/Collapse";
import PersonalInfo from "./Section/PersonalInfo";
import Identification from "./Section/Identification";
import ResidentInfo from "./Section/ResidentInfo";
import ContactInfo from "./Section/ContactInfo";
import Bank from "./Section/Bank";
import FooterBar from "../../Footer/Footer";
import "./styles.css";

function CreatePersonal() {
  const [form] = Form.useForm();
  const [frontImage, setFrontImage] = useState(null);  
  const [backImage, setBackImage] = useState(null);    
  const [isSavedSuccessfully, setIsSavedSuccessfully] = useState(false); 
  const [provinceMap, setProvinceMap] = useState({});
  const [districtMap, setDistrictMap] = useState({});
  const [wardMap, setWardMap] = useState({});
  const navigate = useNavigate();

  const handleCancel = () => {
    form.resetFields();
    setFrontImage(null);
    setBackImage(null);
    setIsSavedSuccessfully(false); 
  };

  const handleSave = () => {
    form.validateFields()
      .then(() => {
        const formData = form.getFieldsValue();
        
        const convertDateToObject = (date) => {
          if (date) {
            return {
              date: date.date(),
              month: date.month() + 1,
              year: date.year()
            };
          }
          return null;
        };

        const dateOfBirth = convertDateToObject(formData.dateOfBirth);
        const issuedDate = convertDateToObject(formData.issuedDate);

        const dataToSend = {
          fullName: formData.fullName,
          gender: formData.gender,
          dateOfBirth: dateOfBirth,
          nationality: formData.nationality,
          ethnicity: formData.ethnicity,
          identityNumber: formData.identityNumber,
          issuedDate: issuedDate,
          issuedPlace: formData.issuedPlace,
          frontImage: formData.frontImage,
          backImage: formData.backImage,
          provinceResident: provinceMap[formData.provinceResident] || formData.provinceResident,
          districtResident: districtMap[formData.districtResident] || formData.districtResident,
          wardResident: wardMap[formData.wardResident] || formData.wardResident,
          houseNumberResident: formData.houseNumberResident,
          provinceContact: provinceMap[formData.provinceContact] || formData.provinceContact,
          districtContact: districtMap[formData.districtContact] || formData.districtContact,
          wardContact: wardMap[formData.wardContact] || formData.wardContact,
          houseNumberContact: formData.houseNumberContact,
          phoneNumber: formData.phoneNumber,
          email: formData.email,
          accountNumber: formData.accountNumber,
          bank: formData.bank,
          bankBranch: formData.bankBranch
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
      navigate('/create/personel');
    }
  };

  return (
    <>
      <Form form={form} layout="vertical">
        <div className="scroll-container">
          <div className='collapse-container'>
            <Collapse
              item={{
                key: '1',
                header: 'Thông tin cá nhân',
                children: <PersonalInfo />,
              }}
            />
          </div>

          <div className='collapse-container'>
            <Collapse
              item={{
                key: '2',
                header: 'Ảnh chụp CCCD/CMND',
                children: <Identification
                  setFrontImage={setFrontImage}
                  setBackImage={setBackImage}
                  frontImage={frontImage}
                  backImage={backImage}
                />,
              }}
            />
          </div>

          <div className='collapse-container'>
            <Collapse
              item={{
                key: '3',
                header: 'Thông tin thường trú',
                children: <ResidentInfo
                  setProvinceMap={setProvinceMap}
                  setDistrictMap={setDistrictMap}
                  setWardMap={setWardMap}
                />,
              }}
            />
          </div>

          <div className='collapse-container'>
            <Collapse
              item={{
                key: '4',
                header: 'Thông tin liên hệ',
                children: <ContactInfo
                  setProvinceMap={setProvinceMap}
                  setDistrictMap={setDistrictMap}
                  setWardMap={setWardMap}
                />,
              }}
            />
          </div>

          <div className='collapse-container'>
            <Collapse
              item={{
                key: '5',
                header: 'Thông tin tài khoản ngân hàng',
                children: <Bank />,
              }}
            />
          </div>
        </div>
      </Form>

      <FooterBar
        onSave={handleSave}
        onCancel={handleCancel}
        onNext={handleNext}
        showNext={isSavedSuccessfully}
      />
    </>
  );
}

export default CreatePersonal;