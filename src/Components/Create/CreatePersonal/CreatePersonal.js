import React, { useState, useEffect } from "react";
import { Form, message } from "antd";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import Collapse from "../../../Shared/Collapse/Collapse";
import PersonalInfo from "./Section/PersonalInfo";
import Identification from "./Section/Identification";
import ResidentInfo from "./Section/ResidentInfo";
import ContactInfo from "./Section/ContactInfo";
import Bank from "./Section/Bank";
import FooterBar from "../../Footer/Footer";
import "./styles.css";
import axios from "axios";

// Axios configuration
axios.defaults.baseURL = "https://localhost:7239";
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers["Content-Type"] = "application/json";
    return config;
  },
  (error) => Promise.reject(error)
);

function CreatePersonal({ initialData, onSave, isModalFooter = false }) {
  const [form] = Form.useForm();
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const [isSavedSuccessfully, setIsSavedSuccessfully] = useState(false);
  const [provinceMap, setProvinceMap] = useState({});
  const [districtMap, setDistrictMap] = useState({});
  const [wardMap, setWardMap] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Check permissions
  const [permissions, setPermissions] = useState([]);
  useEffect(() => {
    const storedPermissions = JSON.parse(localStorage.getItem("permissions")) || [];
    setPermissions(storedPermissions);
  }, []);

  const hasAllModuleAuthority = permissions.some(
    (p) => p.moduleId === "allModule" && p.actionId === "fullAuthority"
  );
  const canCreate = hasAllModuleAuthority || permissions.some(
    (p) => p.moduleId === "profilePersonal" && p.actionId === "create"
  );

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue({
        fullName: initialData.fullName,
        gender: initialData.gender,
        dateOfBirth: initialData.dateOfBirth ? moment(initialData.dateOfBirth, "DD/MM/YYYY") : null,
        nationality: initialData.nationality,
        ethnicity: initialData.ethnicity,
        identityNumber: initialData.identityNumber,
        issuedDate: initialData.issuedDate ? moment(initialData.issuedDate, "DD/MM/YYYY") : null,
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

  const handleSave = async () => {
  if (!canCreate) {
    message.error("Bạn không có quyền tạo mới nhân viên.");
    return;
  }

  try {
    setIsLoading(true);
    const formData = await form.validateFields();

    const dataToSend = {
      NameEmployee: formData.fullName,
      Gender: formData.gender,
      DateOfBirth: formData.dateOfBirth ? formData.dateOfBirth.toISOString() : null,
      Nationality: formData.nationality || "",
      Ethnicity: formData.ethnicity || "",
      NumberIdentification: formData.identityNumber,
      DateIssueIdentification: formData.issuedDate ? formData.issuedDate.toISOString() : null,
      PlaceIssueIdentification: formData.issuedPlace || "",
      FrontIdentificationPath: frontImage || formData.frontImage,
      BackIdentificationPath: backImage || formData.backImage,
      ProvinceResidence: provinceMap[formData.provinceResident] || formData.provinceResident || "",
      DistrictResidence: districtMap[formData.districtResident] || formData.districtResident || "",
      WardResidence: wardMap[formData.wardResident] || formData.wardResident || "",
      HouseNumberResidence: formData.houseNumberResident || "",
      ProvinceContact: provinceMap[formData.provinceContact] || formData.provinceContact || "",
      DistrictContact: districtMap[formData.districtContact] || formData.districtContact || "",
      WardContact: wardMap[formData.wardContact] || formData.wardContact || "",
      HouseNumberContact: formData.houseNumberContact || "",
      Email: formData.email,
      PhoneNumber: formData.phoneNumber,
      BankNumber: formData.accountNumber,
      NameBank: formData.bank,
      BranchBank: formData.bankBranch,
    };

    const response = await axios.post("/api/Employee/CreatePersonal", dataToSend);
   

    if (response.status === 200 && response.data.code === 0) {
      message.success("Tạo mới thông tin cá nhân thành công!");
      setIsSavedSuccessfully(true);
      form.resetFields();
      setFrontImage(null);
      setBackImage(null);

      if (typeof onSave === "function") {
        onSave(dataToSend);
      }
    } else {
      message.error(response.data.message || "Tạo nhân viên thất bại!");
    }
  } catch (err) {
    if (err.errorFields) {
      message.error("Vui lòng nhập đầy đủ các trường bắt buộc!");
      return;
    }

    console.error("Create employee error:", err);
    if (err.response) {
      const { status, data } = err.response;
      const { code, errors } = data || {};
      const errorMsg = errors?.[0] || data?.message || "Không thể xử lý yêu cầu.";
      switch (status) {
        case 400:
          switch (code) {
            case 1003:
              message.error("Email không hợp lệ.");
              break;
            case 1015:
              message.error("Số điện thoại không hợp lệ.");
              break;
            case 1014:
              message.error("Số CCCD/CMND không hợp lệ.");
              break;
            default:
              message.error(errorMsg);
              break;
          }
          break;
        case 409:
          switch (code) {
            case 1012:
              message.error("Email đã được sử dụng.");
              break;
            case 1013:
              message.error("Số điện thoại đã được sử dụng.");
              break;
            case 1014:
              message.error("Số CCCD/CMND đã được sử dụng.");
              break;
            default:
              message.error(errorMsg);
              break;
          }
          break;
        case 401:
          message.error("Bạn không có quyền thực hiện hành động này.");
          break;
        case 500:
          message.error("Lỗi server. Vui lòng thử lại sau.");
          break;
        default:
          message.error(`Lỗi không xác định với mã trạng thái: ${status}`);
          break;
      }
    } else {
      console.error("Network error:", err.message);
      message.error("Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.");
    }
  } finally {
    setIsLoading(false);
  }
};

  const handleNext = () => {
    if (isSavedSuccessfully) {
      navigate("/create/personel");
    }
  };

  return (
    <div className="modal-content-wrapper" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Form form={form} layout="vertical" style={{ flex: "1 1 auto", overflowY: "auto" }}>
        <div className="scroll-container">
          <div className="collapse-container">
            <Collapse
              item={{
                key: "1",
                header: "Thông tin cá nhân",
                children: <PersonalInfo form={form} />,
              }}
            />
          </div>

          <div className="collapse-container">
            <Collapse
              item={{
                key: "2",
                header: "Ảnh chụp CCCD/CMND",
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

          <div className="collapse-container">
            <Collapse
              item={{
                key: "3",
                header: "Thông tin thường trú",
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

          <div className="collapse-container">
            <Collapse
              item={{
                key: "4",
                header: "Thông tin liên hệ",
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

          <div className="collapse-container">
            <Collapse
              item={{
                key: "5",
                header: "Thông tin tài khoản ngân hàng",
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
        showNext={true}
        showCancel={true}
        showSave={true}
        isModalFooter={isModalFooter}
        loading={isLoading}
        style={{ flexShrink: 0 }}
      />
    </div>
  );
}

export default CreatePersonal;