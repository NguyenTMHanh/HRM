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
    if (!(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    }
    return config;
  },
  (error) => Promise.reject(error)
);

function CreatePersonal({ initialData, onSave, onCancel, isModalFooter = false, isEditMode = false, isViewMode = false, isEditIndividual = false }) {
  const [form] = Form.useForm();
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const [frontImageId, setFrontImageId] = useState(null);
  const [backImageId, setBackImageId] = useState(null);
  const [originalFrontImageId, setOriginalFrontImageId] = useState(null);
  const [originalBackImageId, setOriginalBackImageId] = useState(null);
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
  const canUpdate = hasAllModuleAuthority || permissions.some(
    (p) => p.moduleId === "profilePersonal" && p.actionId === "update"
  );

  // Handle image upload callback
  const handleImageUpload = (imageId, type) => {
    if (type === 'front') {
      setFrontImageId(imageId);
    } else if (type === 'back') {
      setBackImageId(imageId);
    }
  };

  // Extract image ID from URL
  const extractImageIdFromUrl = (imageUrl) => {
    if (!imageUrl) return null;
    const match = imageUrl.match(/\/GetFile\/([^/?]+)/);
    return match ? match[1] : null;
  };

  useEffect(() => {
    if (initialData) {
      let apiGender = initialData.gender;
      if (initialData.gender === 'Nữ') apiGender = 'Female';
      else if (initialData.gender === 'Nam') apiGender = 'Male';

      form.setFieldsValue({
        fullName: initialData.fullName,
        gender: apiGender,
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

      if (initialData.frontImage) {
        setFrontImage(initialData.frontImage);
        const frontId = extractImageIdFromUrl(initialData.frontImage);
        setFrontImageId(frontId);
        setOriginalFrontImageId(frontId);
      }
      if (initialData.backImage) {
        setBackImage(initialData.backImage);
        const backId = extractImageIdFromUrl(initialData.backImage);
        setBackImageId(backId);
        setOriginalBackImageId(backId);
      }
    }
  }, [initialData, form]);

  // Function to delete old image
  const deleteOldImage = async (imageId) => {
    if (!imageId) return;
    try {
      await axios.delete(`/api/FileUpload/DeleteFile/${imageId}`);
    } catch (error) {
      console.error('Error deleting old image:', error);
    }
  };

  // Function to get employee code from userId
  const getEmployeeCode = async (userId) => {
    try {
      const response = await axios.get(`/api/Employee/GetEmployeeCodeToUserId?userId=${userId}`);
      if (response.data.code === 0) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to get employee code');
      }
    } catch (error) {
      console.error('Error getting employee code:', error);
      throw error;
    }
  };

  const handleCancel = () => {
    if (typeof onCancel === "function") {
      onCancel();
    } else {
      form.resetFields();
      setFrontImage(null);
      setBackImage(null);
      setFrontImageId(null);
      setBackImageId(null);
      setOriginalFrontImageId(null);
      setOriginalBackImageId(null);
      setIsSavedSuccessfully(false);
    }
  };


  const handleSave = async () => {
    if (isEditMode && !canUpdate) {
      message.error("Bạn không có quyền cập nhật thông tin cá nhân.");
      return;
    }
    if (!isEditMode && !canCreate) {
      message.error("Bạn không có quyền tạo mới nhân viên.");
      return;
    }

    try {
      setIsLoading(true);
      const formData = await form.validateFields();

      if (isEditMode) {
        if (frontImageId !== originalFrontImageId && originalFrontImageId) {
          await deleteOldImage(originalFrontImageId);
        }

        if (backImageId !== originalBackImageId && originalBackImageId) {
          await deleteOldImage(originalBackImageId);
        }
      }

      const dataToSend = {
        nameEmployee: formData.fullName,
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth ? formData.dateOfBirth.toISOString() : null,
        nationality: formData.nationality || "",
        ethnicity: formData.ethnicity || "",
        numberIdentification: formData.identityNumber,
        dateIssueIdentification: formData.issuedDate ? formData.issuedDate.toISOString() : null,
        placeIssueIdentification: formData.issuedPlace || "",
        frontIdentificationPath: frontImageId || "",
        backIdentificationPath: backImageId || "",
        provinceResidence: provinceMap[formData.provinceResident] || formData.provinceResident || "",
        districtResidence: districtMap[formData.districtResident] || formData.districtResident || "",
        wardResidence: wardMap[formData.wardResident] || formData.wardResident || "",
        houseNumberResidence: formData.houseNumberResident || "",
        provinceContact: provinceMap[formData.provinceContact] || formData.provinceContact || "",
        districtContact: districtMap[formData.districtContact] || formData.districtContact || "",
        wardContact: wardMap[formData.wardContact] || formData.wardContact || "",
        houseNumberContact: formData.houseNumberContact || "",
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        bankNumber: formData.accountNumber,
        nameBank: formData.bank,
        branchBank: formData.bankBranch,
      };

      let response;

      if (isEditMode) {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          message.error('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
          return;
        }
        const employeeCode = isEditIndividual ? await getEmployeeCode(userId) : initialData.employeeCode;
        response = await axios.put(`/api/Employee/UpdatePersonal/${employeeCode}`, dataToSend);
      } else {
        response = await axios.post("/api/Employee/CreatePersonal", dataToSend);
      }
      if (response.status === 200 && response.data.code === 0) {
        const successMessage = isEditMode ?
          "Cập nhật thông tin cá nhân thành công!" :
          "Tạo mới thông tin cá nhân thành công!";

        message.success(successMessage);
        setIsSavedSuccessfully(true);

        if (!isEditMode) {
          form.resetFields();
          setFrontImage(null);
          setBackImage(null);
          setFrontImageId(null);
          setBackImageId(null);
          setOriginalFrontImageId(null);
          setOriginalBackImageId(null);
        }

        if (typeof onSave === "function") {
          onSave(response.data.data || dataToSend);
        }
      } else {
        const errorMessage = isEditMode ?
          "Cập nhật thông tin thất bại!" :
          "Tạo nhân viên thất bại!";
        message.error(response.data.message || errorMessage);
      }
    } catch (err) {
      if (err.errorFields) {
        message.error("Vui lòng nhập đầy đủ các trường bắt buộc!");
        return;
      }

      console.error("Save employee error:", err);
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
              case 1022:
                message.error("Không tìm thấy nhân viên.");
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
    navigate("/create/personel");
  };

  return (
    <div className="modal-content-wrapper" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Form form={form} layout="vertical" style={{ flex: "1 1 auto", overflowY: "auto" }} disabled={isViewMode}>
        <div className="scroll-container">
          <div className="collapse-container">
            <Collapse
              item={{
                key: "1",
                header: "Thông tin cá nhân",
                children: <PersonalInfo form={form} disabled={isViewMode} />,
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
                    onImageUpload={handleImageUpload}
                    disabled={isViewMode}
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
                    disabled={isViewMode}
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
                    disabled={isViewMode}
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
                children: <Bank form={form} disabled={isViewMode} />,
              }}
            />
          </div>
        </div>
      </Form>

      {!isViewMode && (
        <FooterBar
          onSave={handleSave}
          onCancel={handleCancel}
          onNext={handleNext}
          showNext={!isModalFooter}
          showCancel={true}
          showSave={true}
          isModalFooter={isModalFooter}
          loading={isLoading}
          style={{ flexShrink: 0 }}
        />
      )}
    </div>
  );
}

export default CreatePersonal;