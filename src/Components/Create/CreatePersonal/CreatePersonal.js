import React, { useState, useEffect } from "react";
import { Form, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import Collapse from "../../../Shared/Collapse/Collapse";
import PersonalInfo from "./Section/PersonalInfo";
import Identification from "./Section/Identification";
import ResidentInfo from "./Section/ResidentInfo";
import ContactInfo from "./Section/ContactInfo";
import Bank from "./Section/Bank";
import FooterBar from "../../Footer/Footer";
import "./styles.css";

function CreatePersonal({ initialData, onSave, isModalFooter = false }) {
  const [form] = Form.useForm();
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const [isSavedSuccessfully, setIsSavedSuccessfully] = useState(false);
  const [provinceMap, setProvinceMap] = useState({});
  const [districtMap, setDistrictMap] = useState({});
  const [wardMap, setWardMap] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue({
        fullName: initialData.fullName,
        gender: initialData.gender,
        dateOfBirth: initialData.dateOfBirth ? moment(initialData.dateOfBirth, 'DD/MM/YYYY') : null,
        nationality: initialData.nationality,
        ethnicity: initialData.ethnicity,
        identityNumber: initialData.identityNumber,
        issuedDate: initialData.issuedDate ? moment(initialData.issuedDate, 'DD/MM/YYYY') : null,
        issuedPlace: initialData.issuedPlace,
        frontImage: initialData.frontImage,
        backImage: initialData.backImage,
        provinceResident: initialData.provinceResident,
        districtResident: initialData.districtResident,
        wardResident: initialData.wardResident,
        houseNumberResident: initialData.houseNumberResident,
        provinceContact: initialData.provinceContact,
        districtContact: initialData.districtContact,
        wardContact: initialData.wardContact,
        houseNumberContact: initialData.houseNumberContact,
        phoneNumber: initialData.phoneNumber,
        email: initialData.email,
        accountNumber: initialData.accountNumber,
        bank: initialData.bank,
        bankBranch: initialData.bankBranch,
      });
      setFrontImage(initialData.frontImage);
      setBackImage(initialData.backImage);
    }
  }, [initialData, form]);

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
        const dataToSend = {
          fullName: formData.fullName,
          gender: formData.gender,
          dateOfBirth: formData.dateOfBirth && moment.isMoment(formData.dateOfBirth)
            ? formData.dateOfBirth.format('DD/MM/YYYY')
            : null,
          nationality: formData.nationality,
          ethnicity: formData.ethnicity,
          identityNumber: formData.identityNumber,
          issuedDate: formData.issuedDate && moment.isMoment(formData.issuedDate)
            ? formData.issuedDate.format('DD/MM/YYYY')
            : null,
          issuedPlace: formData.issuedPlace,
          frontImage: frontImage || formData.frontImage,
          backImage: backImage || formData.backImage,
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
          bankBranch: formData.bankBranch,
        };

        console.log("Data to send: ", dataToSend);
        setIsSavedSuccessfully(true);
        


        if (typeof onSave === 'function') {
          onSave(dataToSend);
          message.success("Cập nhật thông tin cá nhân thành công!");
        } 
        else{
          message.success("Tạo mới thông tin cá nhân thành công!");
        }
      })
      .catch((errorInfo) => {
        message.error("Lưu thất bại! Vui lòng điền đủ các trường bắt buộc.");
        console.log("Error saving data: ", errorInfo);
        setIsSavedSuccessfully(false);
      });
  };

  const handleNext = () => {
    if (isSavedSuccessfully) {
      navigate('/create/personel');
    }
  };

  return (
    <div className="modal-content-wrapper" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Form form={form} layout="vertical" style={{ flex: '1 1 auto', overflowY: 'auto' }}>
        <div className="scroll-container">
          <div className='collapse-container'>
            <Collapse
              item={{
                key: '1',
                header: 'Thông tin cá nhân',
                children: <PersonalInfo form={form} />,
              }}
            />
          </div>

          <div className='collapse-container'>
            <Collapse
              item={{
                key: '2',
                header: 'Ảnh chụp CCCD/CMND',
                children: (
                  <Identification
                    form={form}
                    setFrontImage={setFrontImage}
                    setBackImage={setBackImage}
                    frontImage={frontImage}
                    backImage={backImage}
                  />
                ),
              }}
            />
          </div>

          <div className='collapse-container'>
            <Collapse
              item={{
                key: '3',
                header: 'Thông tin thường trú',
                children: (
                  <ResidentInfo
                    form={form}
                    setProvinceMap={setProvinceMap}
                    setDistrictMap={setDistrictMap}
                    setWardMap={setWardMap}
                  />
                ),
              }}
            />
          </div>

          <div className='collapse-container'>
            <Collapse
              item={{
                key: '4',
                header: 'Thông tin liên hệ',
                children: (
                  <ContactInfo
                    form={form}
                    setProvinceMap={setProvinceMap}
                    setDistrictMap={setDistrictMap}
                    setWardMap={setWardMap}
                  />
                ),
              }}
            />
          </div>

          <div className='collapse-container'>
            <Collapse
              item={{
                key: '5',
                header: 'Thông tin tài khoản ngân hàng',
                children: <Bank form={form} />,
              }}
            />
          </div>
        </div>
      </Form>

      <FooterBar
        onSave={handleSave}
        onCancel={handleCancel}
        onNext={handleNext}
        showNext={isModalFooter ? false : isSavedSuccessfully}
        showCancel={true}
        showSave={true}
        isModalFooter={isModalFooter}
        style={{ flexShrink: 0 }}
      />
    </div>
  );
}

export default CreatePersonal;