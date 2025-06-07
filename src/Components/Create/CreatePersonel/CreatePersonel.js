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

function CreatePersonel({ initialData, onSave, onCancel, isModalFooter = false }) {
  const [form] = Form.useForm();
  const [isSavedSuccessfully, setIsSavedSuccessfully] = useState(false);
  const [avatarImage, setAvatarImage] = useState(null);
  const [avatarId, setAvatarId] = useState(null);
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
  const canCreatePersonel = hasAllModuleAuthority || permissions.some(
    (p) => p.moduleId === "profilePersonel" && p.actionId === "create"
  );

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

  const initialValues = {
    joinDate: moment(),
    fullName: null,
  };

  useEffect(() => {
    Promise.all([fetchBreakTime(), fetchEmployees()]);
  }, [fetchBreakTime, fetchEmployees]);

  useEffect(() => {
    if (initialData) {
      // Ensure fullName is in the format "employeeCode - employeeName"
      const fullName = initialData.employeeCode && initialData.fullName
        ? `${initialData.employeeCode} - ${initialData.fullName.split(" - ")[1] || initialData.fullName}`
        : null;

      form.setFieldsValue({
        fullName,
        dateOfBirth: initialData.dateOfBirth ? moment(initialData.dateOfBirth, "DD/MM/YYYY") : null,
        gender: initialData.gender,
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
        lunchBreak: initialData.lunchBreak,
        avatar: initialData.avatarUrl || initialData.avatar,
        roleGroup: initialData.roleGroup,
      });

      if (initialData.avatarUrl || initialData.avatar) {
        setAvatarImage(initialData.avatarUrl || initialData.avatar);
        if (typeof (initialData.avatarUrl || initialData.avatar) === 'string' && (initialData.avatarUrl || initialData.avatar).length <= 50) {
          setAvatarId(initialData.avatarUrl || initialData.avatar);
        }
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
      setIsSavedSuccessfully(false);
    }
  };

  const handleAvatarUpload = useCallback((uploadedAvatarId) => {
    setAvatarId(uploadedAvatarId);
  }, []);

  const handleSave = async () => {
    if (!canCreatePersonel) {
      message.error("Bạn không có quyền tạo hồ sơ nhân sự.");
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

      if (initialData) {
        fieldsToSkipInEdit.forEach(field => {
          form.setFields([{ name: field, errors: [], value: form.getFieldValue(field) }]);
        });
      }

      const employeeCode = formData.fullName ? formData.fullName.split(" - ")[0] : null;
      const managerCode = formData.managedBy ? formData.managedBy.split(" - ")[0] : null;

      const dataToSend = {
        employeeCode,
        nameEmployee: formData.fullName ? formData.fullName.split(" - ")[1] : null,
        dateOfBirth: formData.dateOfBirth ? formData.dateOfBirth.toISOString() : null,
        gender: formData.gender,
        username: formData.username,
        password: formData.password,
        dateJoinCompany: initialData ? initialData.joinDate : (formData.joinDate ? formData.joinDate.toISOString() : null),
        departmentName: initialData ? initialData.department : formData.department,
        jobtitleName: initialData ? initialData.jobTitle : formData.jobTitle,
        rankName: initialData ? initialData.level : formData.level,
        positionName: initialData ? initialData.position : formData.position,
        managerId: initialData ? (initialData.managedBy ? initialData.managedBy.split(" - ")[0] : null) : managerCode,
        branchName: initialData ? initialData.workLocation : formData.workLocation,
        jobTypeName: initialData ? initialData.workMode : formData.workMode,
        breakLunch: initialData ? parseBreakLunch(initialData.lunchBreak) : parseBreakLunch(breakTime || formData.lunchBreak),
        avatarPath: avatarId || "",
        roleName: formData.roleGroup,
      };

      const response = await axios.post("/api/Employee/CreatePersonel", dataToSend);

      if (response.status === 200 && response.data.code === 0) {
        message.destroy();
        message.success("Tạo mới hồ sơ nhân sự thành công!");
        setIsSavedSuccessfully(true);
        form.resetFields();
        fetchEmployees();
        fetchBreakTime();
        setAvatarImage(null);
        setAvatarId(null);

        if (typeof onSave === "function") {
          onSave(dataToSend);
        }
      } else {
        message.destroy();
        message.error(response.data.message || "Tạo hồ sơ nhân sự thất bại!");
      }
    } catch (err) {
      message.destroy();
      if (err.errorFields) {
        message.error("Vui lòng nhập đầy đủ các trường bắt buộc!");
        return;
      }

      console.error("Create personel employee error:", err);
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
              } else if (errors.model) {
                message.error("Dữ liệu gửi lên không hợp lệ. Vui lòng kiểm tra các trường bắt buộc!");
              } else {
                message.error(errorMsg);
              }
            } else {
              switch (code) {
                case 5:
                  message.error("Yêu cầu không hợp lệ.");
                  break;
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
        console.error("Network error:", err.message);
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
    if (isSavedSuccessfully) {
      navigate("/create/contract");
    }
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
      >
        <div className="scroll-container">
          <div className="collapse-container">
            <Collapse
              item={{
                key: "1",
                header: "Thông tin cơ bản",
                children: <BasicInfo form={form} initialData={initialData} breakTime={breakTime} employees={employees} isModalFooter={isModalFooter} />,
              }}
            />
          </div>

          <div className="collapse-container">
            <Collapse
              item={{
                key: "2",
                header: "Thông tin công việc",
                children: <WorkInfo form={form} initialData={initialData} breakTime={breakTime} employees={employees} />,
              }}
            />
          </div>


          {!initialData && (

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
                    />
                  ),
                }}
              />
            </div>
          )}

        </div>
      </Form>

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
    </div>
  );
}

export default CreatePersonel;