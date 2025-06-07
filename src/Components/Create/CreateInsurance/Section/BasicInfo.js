import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Form, Input, Select, DatePicker, Row, Col, message } from "antd";
import moment from "moment";
import axios from "axios";
import debounce from "lodash/debounce";

const BasicInfo = React.memo(({ form, initialData, employees, isModalFooter }) => {
  const [managers, setManagers] = useState([]);

  const fetchGenderAndBirth = useCallback(async (employeeCode) => {
    try {
      const response = await axios.get("/api/Employee/GetGenderBirth", {
        params: { employeeCode },
      });
      const genderMap = {
        Male: "Nam",
        Female: "Nữ",
      };
      const vietnameseGender = genderMap[response.data.gender] || response.data.gender;

      form.setFieldsValue({
        gender: vietnameseGender,
        dateOfBirth: response.data.dateOfBirth
          ? moment(response.data.dateOfBirth, "YYYY-MM-DD HH:mm:ssZ")
          : null,
      });
    } catch (err) {
      console.error("Error fetching gender and date of birth:", err);
      message.error("Không thể tải giới tính và ngày sinh.");
      form.setFieldsValue({
        gender: undefined,
        dateOfBirth: undefined,
      });
    }
  }, [form]);

  const selectedEmployee = Form.useWatch("fullName", form);

  const debouncedFetch = useMemo(
    () =>
      debounce((employeeCode) => {
        if (employeeCode) {
          fetchGenderAndBirth(employeeCode);
        } else {
          form.setFieldsValue({
            gender: undefined,
            dateOfBirth: undefined,
          });
        }
      }, 300),
    [fetchGenderAndBirth, form]
  );

  useEffect(() => {
    if (selectedEmployee && typeof selectedEmployee === "string") {
      const employeeCode = selectedEmployee.split(" - ")[0];
      debouncedFetch(employeeCode);
    } else {
      debouncedFetch(null);
    }

    return () => {
      debouncedFetch.cancel();
    };
  }, [selectedEmployee, debouncedFetch]);

  const formatDate = (date) => {
    if (!date) return "";
    if (typeof date === "string") return date;
    if (moment.isMoment(date)) return date.format("DD/MM/YYYY");
    console.warn("Unexpected date format:", date);
    return "";
  };

  const employeeOptions = useMemo(
    () =>
      employees.map((emp) => (
        <Select.Option
          key={emp.employeeCode}
          value={`${emp.employeeCode} - ${emp.employeeName}`}
        >
          {`${emp.employeeCode} - ${emp.employeeName}`}
        </Select.Option>
      )),
    [employees]
  );

  return (
    <div>
      {form ? (
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8}>
            <Form.Item
              label="Họ và tên"
              name="fullName"
              rules={[{ required: true, message: "Vui lòng chọn nhân viên!" }]}
            >
              <Select
                placeholder="Chọn nhân viên"
                disabled={isModalFooter} // Vô hiệu hóa khi ở chế độ modal
              >
                {employeeOptions}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item label="Giới tính" name="gender">
              <Input disabled placeholder="Nhập giới tính" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item label="Ngày sinh" name="dateOfBirth">
              <DatePicker
                format="DD/MM/YYYY"
                style={{ width: "100%" }}
                disabled
                placeholder="Nhập ngày sinh"
              />
            </Form.Item>
          </Col>
        </Row>
      ) : (
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8}>
            <p>
              <strong>Họ và tên:</strong> {initialData?.fullName || "N/A"}
            </p>
          </Col>
          <Col xs={24} sm={8}>
            <p>
              <strong>Giới tính:</strong> {initialData?.gender || "N/A"}
            </p>
          </Col>
          <Col xs={24} sm={8}>
            <p>
              <strong>Ngày sinh:</strong>{" "}
              {formatDate(initialData?.dateOfBirth) || "N/A"}
            </p>
          </Col>
        </Row>
      )}
    </div>
  );
});

export default BasicInfo;