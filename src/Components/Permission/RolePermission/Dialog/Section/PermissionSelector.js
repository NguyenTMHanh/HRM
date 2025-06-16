import React, { useEffect } from "react";
import { Form, Checkbox, Row, Col, Typography, Switch, Divider } from "antd";

const { Text } = Typography;

const modules = [
  { id: "profilePersonal", name: "Thông tin Hồ sơ cá nhân" },
  { id: "profilePersonel", name: "Thông tin Hồ sơ nhân sự" },
  { id: "profileContract", name: "Thông tin HDLĐ" },
  { id: "profileInsurance", name: "Thông tin Bảo Hiểm" },
  { id: "profileTax", name: "Thông tin Thuế TNCN" },
  { id: "HrPersonel", name: "Danh sách Hồ sơ nhân sự" },
  { id: "HrSalary", name: "Danh sách lương nhân sự" },
  { id: "HrHistoryCheckin", name: "Danh sách lịch sử chấm công nhân sự" },
  { id: "setting", name: "Cài đặt thông số hệ thống" },
  { id: "permission", name: "Phân quyền hệ thống" },
];

const allActions = [
  { key: "create", label: "Tạo mới" },
  { key: "view", label: "Xem" },
  { key: "delete", label: "Xóa" },
  { key: "update", label: "Sửa" },
];

const limitedModules = [
  "profilePersonal",
  "profilePersonel",
  "profileContract",
  "profileInsurance",
  "profileTax",
];

const limitedActions = allActions.filter(
  (action) => action.key === "update"
);

const allModule = { id: "allModule", name: "Tất cả module" };
const fullAuthorityAction = { key: "fullAuthority", label: "Toàn quyền" };

const PermissionSelector = ({ form, isViewMode }) => {
  const isFullAuthority =
    Form.useWatch(["permissions", `${allModule.id}_${fullAuthorityAction.key}`], form) || false;

  useEffect(() => {
    if (!isViewMode) {
      const currentValues = form.getFieldValue("permissions") || {};
      const updatedPermissions = { ...currentValues };

      modules.forEach((module) => {
        const moduleActions = limitedModules.includes(module.id)
          ? limitedActions
          : allActions;

        const allChecked = moduleActions.every(
          (action) => currentValues[`${module.id}_${action.key}`] === true
        );

        updatedPermissions[`${module.id}_selectAll`] = allChecked;
      });

      form.setFieldsValue({
        permissions: updatedPermissions,
      });
    }
  }, [isViewMode, form]); // Giữ dependency như cũ, nhưng đảm bảo chạy khi form thay đổi

  const handleToggleAllModules = (checked) => {
    const updatedPermissions = {};
    modules.forEach((module) => {
      const moduleActions = limitedModules.includes(module.id)
        ? limitedActions
        : allActions;

      moduleActions.forEach((action) => {
        updatedPermissions[`${module.id}_${action.key}`] = checked;
      });
      updatedPermissions[`${module.id}_selectAll`] = checked;
    });
    updatedPermissions[`${allModule.id}_${fullAuthorityAction.key}`] = checked;

    form.setFieldsValue({
      permissions: updatedPermissions,
    });
  };

  const handleToggleModule = (checked, moduleId) => {
    const currentValues = form.getFieldValue("permissions") || {};
    const moduleActions = limitedModules.includes(moduleId)
      ? limitedActions
      : allActions;
    const updatedPermissions = moduleActions.reduce((acc, action) => {
      acc[`${moduleId}_${action.key}`] = checked;
      return acc;
    }, {});
    updatedPermissions[`${moduleId}_selectAll`] = checked;

    form.setFieldsValue({
      permissions: {
        ...currentValues,
        ...updatedPermissions,
      },
    });
  };

  const handleCheckboxChange = (moduleId) => {
    const currentValues = form.getFieldValue("permissions") || {};
    const moduleActions = limitedModules.includes(moduleId)
      ? limitedActions
      : allActions;

    const allChecked = moduleActions.every(
      (action) => currentValues[`${moduleId}_${action.key}`] === true
    );

    form.setFieldsValue({
      permissions: {
        ...currentValues,
        [`${moduleId}_selectAll`]: allChecked,
      },
    });
  };

  return (
    <div className={isViewMode ? "view-mode" : "edit-mode"}>
      <style>
        {`
          .view-mode .custom-checkbox .ant-checkbox-inner {
            background-color: white !important;
            border-color: #d9d9d9 !important;
          }
          .view-mode .custom-checkbox .ant-checkbox-checked .ant-checkbox-inner {
            background-color: #1890ff !important;
            border-color: #1890ff !important;
          }
          .view-mode .custom-checkbox .ant-checkbox-checked .ant-checkbox-inner::after {
            border-color: white !important;
          }
          .view-mode .custom-checkbox .ant-checkbox + span {
            color: rgba(0, 0, 0, 0.85) !important;
            cursor: not-allowed !important;
          }
          .edit-mode .ant-checkbox-wrapper .ant-checkbox-disabled .ant-checkbox-inner {
            background-color: #f5f5f5 !important;
            border-color: #d9d9d9 !important;
          }
          .edit-mode .ant-checkbox-wrapper .ant-checkbox-disabled.ant-checkbox-checked .ant-checkbox-inner {
            background-color: #f5f5f5 !important;
            border-color: #d9d9d9 !important;
          }
          .edit-mode .ant-checkbox-wrapper .ant-checkbox-disabled.ant-checkbox-checked .ant-checkbox-inner::after {
            border-color: #C4C4C4 !important;
          }
          .edit-mode .ant-checkbox-wrapper .ant-checkbox-disabled + span {
            color: #C4C4C4 !important;
          }
          .view-mode .ant-switch {
            cursor: not-allowed !important;
          }
          .view-mode .ant-switch.ant-switch-checked {
            background-color: #1890ff !important;
          }
          .view-mode .ant-switch:not(.ant-switch-checked) {
            background-color: #f5f5f5 !important;
          }
          .view-mode .ant-switch .ant-switch-handle::before {
            background-color: #fff !important;
          }
        `}
      </style>

      <div key={allModule.id} style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
          <Text strong style={{ fontSize: '0.75rem', flex: 1 }}>
            {allModule.name}
          </Text>
        </div>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Form.Item
              name={["permissions", `${allModule.id}_${fullAuthorityAction.key}`]}
              valuePropName="checked"
              noStyle
            >
              <Checkbox
                className="custom-checkbox"
                disabled={isViewMode}
                onChange={(e) => {
                  if (!isViewMode) handleToggleAllModules(e.target.checked);
                }}
              >
                {fullAuthorityAction.label}
              </Checkbox>
            </Form.Item>
          </Col>
        </Row>
        <Divider style={{ margin: "24px 0" }} />
      </div>

      {modules.map((module, index) => {
        const moduleActions = limitedModules.includes(module.id)
          ? limitedActions
          : allActions;

        return (
          <div key={module.id} style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
              <Text strong style={{ fontSize: '0.75rem', flex: 1 }}>
                {module.name}
              </Text>
              {!isViewMode && (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Text style={{ marginRight: 8 }}>Chọn tất cả</Text>
                  <Form.Item
                    name={["permissions", `${module.id}_selectAll`]}
                    valuePropName="checked"
                    noStyle
                  >
                    <Switch
                      onChange={(checked) => handleToggleModule(checked, module.id)}
                      disabled={isViewMode || isFullAuthority}
                      style={{ width: 50, height: 24, borderRadius: 12 }}
                      checkedChildren={<span style={{ marginLeft: 2 }} />}
                      unCheckedChildren={<span style={{ marginLeft: 2 }} />}
                    />
                  </Form.Item>
                </div>
              )}
            </div>
            <Row gutter={[16, 16]} align="middle">
              {moduleActions.map((action) => (
                <Col xs={6} sm={6} key={`${module.id}_${action.key}`}>
                  <Form.Item
                    name={["permissions", `${module.id}_${action.key}`]}
                    valuePropName="checked"
                    noStyle
                  >
                    <Checkbox
                      className="custom-checkbox"
                      disabled={isViewMode || (isFullAuthority && !isViewMode)}
                      onChange={() => handleCheckboxChange(module.id)}
                    >
                      {action.label}
                    </Checkbox>
                  </Form.Item>
                </Col>
              ))}
            </Row>
            {index < modules.length - 1 && (
              <Divider style={{ margin: "24px 0" }} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default PermissionSelector;