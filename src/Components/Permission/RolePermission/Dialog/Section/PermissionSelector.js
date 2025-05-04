import React from "react";
import { Form, Checkbox, Row, Col, Typography, Switch, Divider } from "antd";

const groupedPermissions = [
  {
    module: "Thông tin cá nhân",
    permissions: [
      { key: "create_personal_info", label: "Tạo mới Thông tin cá nhân" },
      { key: "view_personal_info", label: "Xem Thông tin cá nhân" },
      { key: "edit_personal_info", label: "Sửa Thông tin cá nhân" },
    ],
  },
  {
    module: "Hồ sơ nhân sự",
    permissions: [
      { key: "create_employee_profile", label: "Tạo mới Hồ sơ nhân sự" },
      { key: "view_employee_profile_list", label: "Xem danh sách thông tin hồ sơ nhân sự" },
      { key: "view_employee_profile", label: "Xem thông tin Hồ sơ nhân sự" },
      { key: "edit_employee_profile", label: "Sửa thông tin hồ sơ nhân sự của một nhân sự" },
      { key: "delete_employee_profile", label: "Xóa thông tin hồ sơ nhân sự của một nhân sự" },
    ],
  },
  {
    module: "Hợp đồng lao động",
    permissions: [
      { key: "create_labor_contract", label: "Tạo mới Hợp đồng lao động" },
      { key: "view_labor_contract_list", label: "Xem danh sách thông tin hợp đồng lao động" },
      { key: "view_labor_contract", label: "Xem thông tin hợp đồng lao động" },
      { key: "edit_labor_contract", label: "Sửa thông tin hợp đồng lao động" },
      { key: "delete_labor_contract", label: "Xóa thông tin hợp đồng lao động của một nhân sự" },
    ],
  },
  {
    module: "Bảo hiểm",
    permissions: [
      { key: "create_insurance", label: "Tạo mới Bảo hiểm" },
      { key: "view_insurance_list", label: "Xem danh sách thông tin bảo hiểm" },
      { key: "view_insurance", label: "Xem thông tin bảo hiểm" },
      { key: "edit_insurance", label: "Sửa thông tin bảo hiểm của một nhân sự" },
      { key: "delete_insurance", label: "Xóa thông tin bảo hiểm của một nhân sự" },
    ],
  },
  {
    module: "Thuế TNCN",
    permissions: [
      { key: "create_personal_income_tax", label: "Tạo mới Thuế TNCN" },
      { key: "view_personal_income_tax_list", label: "Xem danh sách thông tin thuế TNCN" },
      { key: "view_personal_income_tax", label: "Xem thông tin thuế TNCN" },
      { key: "edit_personal_income_tax", label: "Sửa thông tin thuế TNCN của một nhân sự" },
      { key: "delete_personal_income_tax", label: "Xóa thông tin thuế TNCN của một nhân sự" },
    ],
  },
  {
    module: "Lương",
    permissions: [
      { key: "view_monthly_salary", label: "Xem thông tin lương hàng tháng" },
      { key: "confirm_salary", label: "Xác nhận lương vào cuối tháng" },
      { key: "report_salary_issue", label: "Thắc mắc lương khi có sai sót" },
      { key: "view_salary_list", label: "Xem danh sách thông tin lương" },
      { key: "edit_salary", label: "Sửa thông tin lương của một nhân sự" },
      { key: "delete_salary", label: "Xóa thông tin lương của một nhân sự" },
    ],
  },
  {
    module: "Lịch sử chấm công",
    permissions: [
      { key: "view_attendance_history_list", label: "Xem danh sách thông tin lịch sử chấm công" },
      { key: "edit_attendance_history", label: "Sửa thông tin lịch sử chấm công của một nhân sự" },
      { key: "delete_attendance_history", label: "Xóa thông tin lịch sử chấm công của một nhân sự" },
    ],
  },
  {
    module: "Cài đặt hệ thống",
    permissions: [
      { key: "view_rank_settings", label: "Xem thông tin cài đặt cấp bậc" },
      { key: "edit_rank_settings", label: "Sửa cài đặt cấp bậc" },
      { key: "delete_rank", label: "Xóa một cấp bậc" },
      { key: "view_department_settings", label: "Xem thông tin cài đặt bộ phận" },
      { key: "edit_department_settings", label: "Sửa cài đặt bộ phận" },
      { key: "delete_department", label: "Xóa một bộ phận" },
      { key: "view_position_settings", label: "Xem thông tin cài đặt chức vụ" },
      { key: "edit_position_settings", label: "Sửa cài đặt chức vụ" },
      { key: "delete_position", label: "Xóa một chức vụ" },
      { key: "view_location_settings", label: "Xem thông tin cài đặt vị trí" },
      { key: "edit_location_settings", label: "Sửa cài đặt vị trí" },
      { key: "delete_location", label: "Xóa một vị trí" },
      { key: "view_branch_settings", label: "Xem thông tin cài đặt chi nhánh" },
      { key: "edit_branch_settings", label: "Sửa cài đặt chi nhánh" },
      { key: "delete_branch", label: "Xóa một chi nhánh" },
      { key: "view_checkin_checkout_settings", label: "Xem thông tin cài đặt checkin/checkout" },
      { key: "edit_checkin_checkout_settings", label: "Sửa cài đặt checkin/checkout" },
      { key: "view_lunch_break_settings", label: "Xem thông tin cài đặt thời gian nghỉ trưa" },
      { key: "edit_lunch_break_settings", label: "Sửa cài đặt thời gian nghỉ trưa" },
      { key: "view_work_type_settings", label: "Xem thông tin cài đặt các loại hình làm việc" },
      { key: "edit_work_type_settings", label: "Sửa cài đặt các loại hình làm việc" },
      { key: "view_holiday_settings", label: "Xem thông tin cài đặt ngày nghỉ lễ" },
      { key: "edit_holiday_settings", label: "Sửa cài đặt ngày nghỉ lễ" },
      { key: "view_health_insurance_rate", label: "Xem thông tin cài đặt tỷ lệ đóng BHYT" },
      { key: "edit_health_insurance_rate", label: "Sửa cài đặt tỷ lệ đóng BHYT" },
      { key: "view_social_insurance_rate", label: "Xem thông tin cài đặt tỷ lệ đóng BHXH" },
      { key: "edit_social_insurance_rate", label: "Sửa cài đặt tỷ lệ đóng BHXH" },
      { key: "view_unemployment_insurance_rate", label: "Xem thông tin cài đặt tỷ lệ đóng BHTN" },
      { key: "edit_unemployment_insurance_rate", label: "Sửa cài đặt tỷ lệ đóng BHTN" },
      { key: "view_tax_rate_settings", label: "Xem thông tin cài đặt thuế suất và lũy tiến" },
      { key: "edit_tax_rate_settings", label: "Sửa cài đặt thuế suất và lũy tiến" },
      { key: "view_tax_deduction_settings", label: "Xem thông tin cài đặt các khoản giảm trừ thuế TNCN" },
      { key: "edit_tax_deduction_settings", label: "Sửa cài đặt các khoản giảm trừ thuế TNCN" },
      { key: "view_salary_coefficient_settings", label: "Xem thông tin cài đặt hệ số lương theo vị trí" },
      { key: "edit_salary_coefficient_settings", label: "Sửa cài đặt hệ số lương theo vị trí" },
      { key: "view_hourly_wage_settings", label: "Xem thông tin cài đặt thông số tính lương theo giờ" },
      { key: "edit_hourly_wage_settings", label: "Sửa cài đặt thông số tính lương theo giờ" },
      { key: "view_allowance_settings", label: "Xem thông tin cài đặt phụ cấp" },
      { key: "edit_allowance_settings", label: "Sửa cài đặt phụ cấp" },
      { key: "view_minimum_wage_settings", label: "Xem thông tin cài đặt vùng lương tối thiểu" },
      { key: "edit_minimum_wage_settings", label: "Sửa cài đặt vùng lương tối thiểu" },
    ],
  },
  {
    module: "Quản lý nhóm quyền",
    permissions: [
      { key: "view_permission_group_list", label: "Xem danh sách các nhóm quyền" },
      { key: "view_permission_group", label: "Xem thông tin một nhóm quyền cụ thể" },
      { key: "edit_permission_group", label: "Sửa cài đặt một nhóm quyền" },
      { key: "delete_permission_group", label: "Xóa một nhóm quyền" },
    ],
  },
];

const { Text } = Typography;

const PermissionSelector = ({ form, isViewMode }) => {
    const handleToggleAll = (checked, modulePermissions) => {
      const currentValues = form.getFieldValue("permissions") || {};
      const updatedPermissions = modulePermissions.reduce((acc, perm) => {
        acc[perm.key] = checked;
        return acc;
      }, {});
      form.setFieldsValue({
        permissions: {
          ...currentValues,
          ...updatedPermissions,
        },
      });
    };
  
    return (
      <div>
        {groupedPermissions.map((group, index) => (
          <div key={group.module} style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
              <Text strong style={{ fontSize: 16, flex: 1 }}>
                {group.module}
              </Text>
              {!isViewMode && (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Text style={{ marginRight: 8 }}>Chọn tất cả</Text>
                  <Switch
                    onChange={(checked) => handleToggleAll(checked, group.permissions)}
                    style={(checked) => ({
                      backgroundColor: checked ? "#52c41a" : "#fff",
                      border: `1px solid ${checked ? "#52c41a" : "#d9d9d9"}`,
                      width: 50,
                      height: 24,
                      borderRadius: 12,
                    })}
                    checkedChildren={<span style={{ marginLeft: 2 }} />}
                    unCheckedChildren={<span style={{ marginLeft: 2 }} />}
                  />
                </div>
              )}
            </div>
            <Row gutter={[16, 16]}>
              {group.permissions.map((permission) => (
                <Col xs={24} sm={12} key={permission.key}>
                  <Form.Item
                    name={["permissions", permission.key]}
                    valuePropName="checked"
                    noStyle
                  >
                    <Checkbox disabled={isViewMode}>{permission.label}</Checkbox>
                  </Form.Item>
                </Col>
              ))}
            </Row>
            {index < groupedPermissions.length - 1 && (
              <Divider style={{ margin: "24px 0" }} />
            )}
          </div>
        ))}
      </div>
    );
  };
  

export default PermissionSelector;