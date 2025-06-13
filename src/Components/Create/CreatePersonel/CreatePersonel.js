import React, { useState, useEffect, useCallback } from "react";
import { Form, message } from "antd";
import { useNavigate } from "react-router-dom";
import Collapse from "../../../Shared/Collapse/Collapse";
import WorkInfo from "./Section/WorkInfo";
import AccountInfo from "./Section/AccountInfo";
import BasicInfo from "./Section/BasicInfo";
import FooterBar from "../../Footer/Footer";
import moment from "moment";
import "./styles.css";
import axios from "axios";

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

function CreatePersonel({ initialData, onSave, onCancel, isModalFooter = false, isEditMode = false, isViewMode = false }) {
  const [form] = Form.useForm();
  const [isSavedSuccessfully, setIsSavedSuccessfully] = useState(false);
  const [avatarImage, setAvatarImage] = useState(null);
  const [avatarId, setAvatarId] = useState(null);
  const [originalAvatarId, setOriginalAvatarId] = useState(null);
  const [breakTime, setBreakTime] = useState("");
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [permissions, setPermissions] = useState([]);
  useEffect(() => {
    const storedPermissions = JSON.parse(localStorage.getItem("permissions")) || [];
    setPermissions(storedPermissions);
  }, []);

  const hasAllModuleAuthority = permissions.some(
    (p) => p.moduleId === "allModule" && p.actionId === "fullAuthority"
  );
  const canUpdate = hasAllModuleAuthority || permissions.some(
    (p) => p.moduleId === "profilePersonel" && p.actionId === "update"
  );
  const canUpdateRoleGroup = hasAllModuleAuthority || permissions.some(
    (p) => p.moduleId === "HrPersonel" && p.actionId === "update"
  );

  // Extract image ID from URL
  const extractImageIdFromUrl = (imageUrl) => {
    if (!imageUrl) return null;
    const match = imageUrl.match(/\/GetFile\/([^/?]+)/);
    return match ? match[1] : null;
  };

  const fetchBreakTime = useCallback(async () => {
    try {
      const response = await axios.get("/api/CheckInOutSetting/GetBreakTime");
      if (response.data.code === 0) {
        const breakHour = response.data.data.breakHour || 0;
        const breakMinute = response.data.data.breakMinute || 0;
        const totalHours = breakHour + breakMinute / 60;
        const breakTimeValue = `${totalHours.toString().replace(/\.0+$/, '')}h`;
        setBreakTime(breakTimeValue);
        form.setFieldsValue({ lunchBreak: breakTimeValue });
      } else {
        setBreakTime("1h0");
        form.setFieldsValue({ lunchBreak: "1h0" });
      }
    } catch (err) {
      console.error("Error fetching break time:", err);
      message.error("Không thể tải thời gian nghỉ trưa. Sử dụng giá trị mặc định.");
      setBreakTime("1h0");
      form.setFieldsValue({ lunchBreak: "1h0" });
    }
  }, [form]);

  const fetchEmployees = useCallback(async () => {
    try {
      const response = await axios.get("/api/Employee/CodeNameEmployee");
      setEmployees(response.data);
    } catch (err) {
      console.error("Error fetching employees:", err);
      message.error("Không thể tải danh sách nhân viên.");
    }
  }, []);

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

  const initialValues = {
    joinDate: moment(),
    fullName: null,
  };

  useEffect(() => {
    Promise.all([fetchBreakTime(), fetchEmployees()]);
  }, [fetchBreakTime, fetchEmployees]);

  useEffect(() => {
    if (initialData) {
      const fullName = initialData.employeeCode && initialData.fullName
        ? `${initialData.employeeCode} - ${initialData.fullName.split(" - ")[1] || initialData.fullName}`
        : initialData.fullName || null;

      form.setFieldsValue({
        fullName,
        dateOfBirth: initialData.dateOfBirth ? moment(initialData.dateOfBirth, "DD/MM/YYYY") : null,
        gender: initialData.gender === 'Nữ' ? 'Female' : initialData.gender === 'Nam' ? 'Male' : initialData.gender,
        username: initialData.username,
        password: initialData.password,
        joinDate: initialData.joinDate ? moment(initialData.joinDate, "DD/MM/YYYY") : null,
        department: initialData.department,
        jobTitle: initialData.jobTitle,
        level: initialData.level,
        position: initialData.position,
        managedBy: initialData.managedBy,
        workLocation: initialData.workLocation,
        workMode: initialData.workMode,
        lunchBreak: initialData.lunchBreak || breakTime,
        avatar: initialData.avatarUrl || initialData.avatar,
        roleGroup: initialData.roleGroup,
      });

      if (initialData.avatarUrl || initialData.avatar) {
        setAvatarImage(initialData.avatarUrl || initialData.avatar);
        const avatarId = extractImageIdFromUrl(initialData.avatarUrl || initialData.avatar);
        setAvatarId(avatarId);
        setOriginalAvatarId(avatarId);
      }
    } else {
      form.setFieldsValue({
        ...initialValues,
        lunchBreak: breakTime,
      });
    }
  }, [initialData, form, breakTime]);

  const handleCancel = () => {
    if (typeof onCancel === "function") {
      onCancel();
    } else {
      form.resetFields();
      setAvatarImage(null);
      setAvatarId(null);
      setOriginalAvatarId(null);
      setIsSavedSuccessfully(false);
    }
  };

  const handleAvatarUpload = useCallback((uploadedAvatarId) => {
    setAvatarId(uploadedAvatarId);
  }, []);

  const handleSave = async () => {
    if (!canUpdate && isEditMode) {
      message.error("Bạn không có quyền cập nhật hồ sơ nhân sự.");
      return;
    }
    if (!canUpdate && !isEditMode) {
      message.error("Bạn không có quyền tạo mới hồ sơ nhân sự.");
      return;
    }

    try {
      setIsLoading(true);
      const formData = await form.validateFields();

      // In edit mode, skip validation for WorkInfo fields if not displayed
      const fieldsToSkipInEdit = [
        'joinDate', 'workLocation', 'department', 'jobTitle',
        'level', 'position', 'managedBy', 'workMode', 'lunchBreak'
      ];

      if (isEditMode) {
        fieldsToSkipInEdit.forEach(field => {
          form.setFields([{ name: field, errors: [], value: form.getFieldValue(field) }]);
        });
      }

      const employeeCode = formData.fullName ? formData.fullName.split(' - ')[0] : null;
      const managerCode = formData.managedBy ? formData.managedBy.split(" - ")[0] : null;
      const dataToSend = {
        employeeCode,
        nameEmployee: formData.fullName ? formData.fullName.split(" - ")[1] : null,
        dateOfBirth: formData.dateOfBirth ? formData.dateOfBirth.toISOString() : null,
        gender: formData.gender,
        username: formData.username || "",
        password: formData.password || "",
        dateJoinCompany: formData.joinDate ? formData.joinDate.toISOString() : null,
        departmentName: formData.department,
        jobtitleName: formData.jobTitle,
        rankName: formData.level,
        positionName: formData.position,
        managerId: managerCode,
        branchName: formData.workLocation,
        jobTypeName: formData.workMode,
        breakLunch: parseBreakLunch(formData.lunchBreak),
        avatarPath: avatarId || "",
        roleName: formData.roleGroup,
      };

      let response;
      if (isEditMode) {
        response = await axios.put("/api/Employee/UpdatePersonel", dataToSend);
      } else {
        response = await axios.post("/api/Employee/CreatePersonel", dataToSend);
      }

      if (response.status === 200 && response.data.code === 0) {
        message.success(isEditMode ? "Cập nhật hồ sơ nhân sự thành công!" : "Tạo mới hồ sơ nhân sự thành công!");
        setIsSavedSuccessfully(true);
        if (!isEditMode) {
          form.resetFields();
          setAvatarImage(null);
          setAvatarId(null);
          setOriginalAvatarId(null);
        }
        if (typeof onSave === "function") {
          onSave(dataToSend);
        }
      } else {
        message.error(response.data.message || (isEditMode ? "Cập nhật hồ sơ nhân sự thất bại!" : "Tạo mới hồ sơ nhân sự thất bại!"));
      }
      fetchBreakTime();
      fetchEmployees();
    } catch (err) {
      if (err.errorFields) {
        message.error("Vui lòng nhập đầy đủ các trường bắt buộc!");
        return;
      }
      console.error("Error saving personnel:", err);
      if (err.response) {
        const { status, data } = err.response;
        const { code, errors } = data || {};
        const errorMsg = errors?.[0] || data?.message || "Không thể xử lý yêu cầu.";
        switch (status) {
          case 400:
            if (errors) {
              if (errors["$.dateOfBirth"]) {
                message.error("Ngày sinh không hợp lệ. Vui lòng kiểm tra!");
              } else if (errors["$.dateJoinCompany"]) {
                message.error("Ngày gia nhập không hợp lệ. Vui lòng kiểm tra!");
              } else {
                message.error(errorMsg);
              }
            } else {
              switch (code) {
                case 1002:
                  message.error("Tên đăng nhập đã tồn tại trong hệ thống!");
                  break;
                case 1003:
                  message.error("Email không hợp lệ!");
                  break;
                case 1004:
                  message.error("Nhóm quyền không tồn tại!");
                  break;
                case 1015:
                  message.error("Chi nhánh không tồn tại!");
                  break;
                case 1016:
                  message.error("Bộ phận không tồn tại!");
                  break;
                case 1017:
                  message.error("Chức vụ không tồn tại!");
                  break;
                case 1018:
                  message.error("Cấp bậc không tồn tại!");
                  break;
                case 1019:
                  message.error("Vị trí không tồn tại!");
                  break;
                case 1020:
                  message.error("Người quản lý không tồn tại!");
                  break;
                case 1021:
                  message.error("Hình thức làm việc không tồn tại!");
                  break;
                case 1022:
                  message.error("Nhân viên không tồn tại! Vui lòng tạo thông tin cá nhân trước!");
                  break;
                case 1023:
                  message.error("Hồ sơ nhân sự đã được tạo trước đó!");
                  break;
                default:
                  message.error(errorMsg);
                  break;
              }
            }
            break;
          case 401:
            message.error("Bạn không có quyền thực hiện hành động này!");
            break;
          case 500:
            message.error("Lỗi server! Vui lòng thử lại sau!");
            break;
          default:
            message.error(`Lỗi không xác định với mã trạng thái: ${status}`);
            break;
        }
      } else {
        message.error("Không thể kết nối đến server! Vui lòng kiểm tra kết nối mạng!");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const parseBreakLunch = (breakTimeStr) => {
    if (!breakTimeStr) return 0;
    const [hours, minutes] = breakTimeStr.split("h").map((part) => parseFloat(part));
    return hours + (minutes || 0) / 60;
  };

  const handleNext = () => {
    navigate("/create/contract");
  };

  const handleBack = () => {
    navigate("/create/personal");
  };

  return (
    <div className="modal-content-wrapper" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        style={{ flex: "1 1 auto", overflowY: "auto" }}
        disabled={isViewMode}
      >
        <div className="scroll-container">
          <div className="collapse-container">
            <Collapse
              item={{
                key: "1",
                header: "Thông tin cơ bản",
                children: <BasicInfo form={form} initialData={initialData} breakTime={breakTime} employees={employees} isModalFooter={isModalFooter} disabled={isViewMode} />,
              }}
            />
          </div>

          <div className="collapse-container">
            <Collapse
              item={{
                key: "2",
                header: "Thông tin công việc",
                children: <WorkInfo form={form} initialData={initialData} breakTime={breakTime} employees={employees} disabled={isViewMode} />,
              }}
            />
          </div>

          <div className="collapse-container">
            <Collapse
              item={{
                key: "3",
                header: "Thông tin tài khoản",
                children: (
                  <AccountInfo
                    form={form}
                    setAvatarImage={setAvatarImage}
                    avatarImage={avatarImage}
                    onAvatarUpload={handleAvatarUpload}
                    isEditMode={isEditMode}
                    canUpdateRoleGroup={canUpdateRoleGroup}
                    disabled={isViewMode}
                  />
                ),
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
          onBack={handleBack}
          showNext={!isModalFooter}
          showBack={!isModalFooter}
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

export default CreatePersonel;