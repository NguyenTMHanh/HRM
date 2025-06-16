import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Form, Select, DatePicker, Row, Col, message, Input } from "antd";
import moment from "moment";
import axios from "axios";
import debounce from "lodash/debounce";

const WorkInfo = React.memo(({ form, initialData, breakTime }) => {
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [jobTitles, setJobTitles] = useState([]);
  const [ranks, setRanks] = useState([]);
  const [branches, setBranches] = useState([]);
  const [workModes, setWorkModes] = useState([]);
  const [managers, setManagers] = useState([]);

  const fetchDepartments = useCallback(async () => {
    try {
      const response = await axios.get("/api/Department");
      setDepartments(response.data);
    } catch (err) {
      console.error("Error fetching departments:", err);
      message.error("Không thể tải danh sách bộ phận.");
    }
  }, []);

  const fetchPositions = useCallback(async () => {
    try {
      const response = await axios.get("/api/Position");
      setPositions(response.data);
    } catch (err) {
      console.error("Error fetching positions:", err);
      message.error("Không thể tải danh sách vị trí.");
    }
  }, []);

  const fetchJobTitles = useCallback(async () => {
    try {
      const response = await axios.get("/api/JobTitle");
      setJobTitles(response.data);
    } catch (err) {
      console.error("Error fetching job titles:", err);
      message.error("Không thể tải danh sách chức vụ.");
    }
  }, []);

  const fetchBranches = useCallback(async () => {
    try {
      const response = await axios.get("/api/Branch");
      setBranches(response.data);
    } catch (err) {
      console.error("Error fetching branches:", err);
      message.error("Không thể tải danh sách chi nhánh.");
    }
  }, []);

  const fetchRanks = useCallback(async () => {
    try {
      const response = await axios.get("/api/Rank");
      setRanks(response.data);
    } catch (err) {
      console.error("Error fetching ranks:", err);
      message.error("Không thể tải danh sách cấp bậc.");
    }
  }, []);

  const fetchWorkModes = useCallback(async () => {
    try {
      const response = await axios.get("/api/JobType");
      setWorkModes(response.data);
    } catch (err) {
      console.error("Error fetching work modes:", err);
      message.error("Không thể tải danh sách hình thức làm việc.");
    }
  }, []);

  const fetchManagers = useCallback(async (employeeCode, rankName) => {
    try {
      const response = await axios.get("/api/Employee/CodeNameManager", {
        params: { employeeCode, rankName },
      });
      setManagers(response.data);
      // Only clear managedBy if it's not from initialData
      if (!initialData?.managedBy) {
        form.setFieldsValue({ managedBy: undefined });
      }
    } catch (err) {
      console.error("Error fetching managers:", err);
      message.error("Không thể tải danh sách người quản lý.");
      setManagers([]);
      form.setFieldsValue({ managedBy: undefined });
    }
  }, [form, initialData?.managedBy]);

  // Initial fetch for all data
  useEffect(() => {
    Promise.all([
      fetchDepartments(),
      fetchPositions(),
      fetchJobTitles(),
      fetchRanks(),
      fetchBranches(),
      fetchWorkModes(),
    ]);
  }, [fetchDepartments, fetchPositions, fetchJobTitles, fetchRanks, fetchBranches, fetchWorkModes]);

  // Fetch managers when component mounts with initialData
  useEffect(() => {
    if (initialData?.employeeCode && initialData?.level) {
      fetchManagers(initialData.employeeCode, initialData.level);
    }
  }, [initialData?.employeeCode, initialData?.level, fetchManagers]);

  const selectedEmployee = Form.useWatch("fullName", form);
  const selectedRank = Form.useWatch("level", form);

  const debouncedFetch = useMemo(
    () =>
      debounce((employeeCode, rankName) => {
        if (employeeCode && rankName) {
          fetchManagers(employeeCode, rankName);
        } else {
          setManagers([]);
          form.setFieldsValue({ managedBy: undefined });
        }
      }, 300),
    [fetchManagers, form]
  );

  // Handle changes in employee selection or rank
  useEffect(() => {
    if (selectedEmployee && typeof selectedEmployee === "string") {
      const employeeCode = selectedEmployee.split(" - ")[0];
      debouncedFetch(employeeCode, selectedRank);
    } else {
      debouncedFetch(null, null);
    }

    return () => {
      debouncedFetch.cancel();
    };
  }, [selectedEmployee, selectedRank, debouncedFetch]);

  // Handle rank change - clear managedBy when rank changes
  const handleRankChange = (value) => {
    form.setFieldsValue({ level: value, managedBy: undefined });
    
    // Get current employee code
    const currentEmployee = form.getFieldValue("fullName");
    if (currentEmployee && typeof currentEmployee === "string") {
      const employeeCode = currentEmployee.split(" - ")[0];
      if (employeeCode && value) {
        fetchManagers(employeeCode, value);
      }
    }
  };

  const formatDate = (date) => {
    if (!date) return "";
    if (typeof date === "string") return date;
    if (moment.isMoment(date)) return date.format("DD/MM/YYYY");
    console.warn("Unexpected date format:", date);
    return "";
  };

  const branchOptions = useMemo(
    () =>
      branches.map((branch) => (
        <Select.Option key={branch.id} value={branch.branchName}>
          {branch.branchName}
        </Select.Option>
      )),
    [branches]
  );

  const departmentOptions = useMemo(
    () =>
      departments.map((dept) => (
        <Select.Option key={dept.id} value={dept.departmentName}>
          {dept.departmentName}
        </Select.Option>
      )),
    [departments]
  );

  const jobTitleOptions = useMemo(
    () =>
      jobTitles.map((job) => (
        <Select.Option key={job.id} value={job.jobtitleName}>
          {job.jobtitleName}
        </Select.Option>
      )),
    [jobTitles]
  );

  const rankOptions = useMemo(
    () =>
      ranks.map((rank) => (
        <Select.Option key={rank.id} value={rank.rankName}>
          {rank.rankName}
        </Select.Option>
      )),
    [ranks]
  );

  const positionOptions = useMemo(
    () =>
      positions.map((pos) => (
        <Select.Option key={pos.id} value={pos.positionName}>
          {pos.positionName}
        </Select.Option>
      )),
    [positions]
  );

  const managerOptions = useMemo(
    () =>
      managers.map((manager) => (
        <Select.Option
          key={manager.employeeCode}
          value={`${manager.employeeCode} - ${manager.employeeName}`}
        >
          {`${manager.employeeCode} - ${manager.employeeName}`}
        </Select.Option>
      )),
    [managers]
  );

  const workModeOptions = useMemo(
    () =>
      workModes.map((workMode) => (
        <Select.Option key={workMode.id} value={workMode.nameJobType}>
          {workMode.nameJobType}
        </Select.Option>
      )),
    [workModes]
  );

  return (
    <div>
      {form ? (
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={6}>
            <Form.Item
              label="Ngày gia nhập công ty"
              name="joinDate"
              rules={[{ required: true, message: "Vui lòng nhập ngày gia nhập!" }]}
            >
              <DatePicker
                format="DD/MM/YYYY"
                style={{ width: "100%" }}
                placeholder="Chọn ngày gia nhập"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={6}>
            <Form.Item
              label="Chi nhánh làm việc"
              name="workLocation"
              rules={[{ required: true, message: "Vui lòng chọn cơ sở làm việc!" }]}
            >
              <Select placeholder="Chọn cơ sở làm việc">{branchOptions}</Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={6}>
            <Form.Item
              label="Bộ phận"
              name="department"
              rules={[{ required: true, message: "Vui lòng chọn bộ phận!" }]}
            >
              <Select placeholder="Chọn bộ phận">{departmentOptions}</Select>
            </Form.Item>
          </Col>
          {/* <Col xs={24} sm={6}>
            <Form.Item
              label="Chức vụ"
              name="jobTitle"
              rules={[{ required: true, message: "Vui lòng chọn chức vụ!" }]}
            >
              <Select placeholder="Chọn chức vụ">{jobTitleOptions}</Select>
            </Form.Item>
          </Col> */}
          <Col xs={24} sm={6}>
            <Form.Item
              label="Cấp bậc"
              name="level"
              rules={[{ required: true, message: "Vui lòng chọn cấp bậc!" }]}
            >
              <Select 
                placeholder="Chọn cấp bậc"
                onChange={handleRankChange}
              >
                {rankOptions}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={6}>
            <Form.Item
              label="Vị trí"
              name="position"
              rules={[{ required: true, message: "Vui lòng chọn vị trí!" }]}
            >
              <Select placeholder="Chọn vị trí">{positionOptions}</Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={6}>
            <Form.Item
              label="Được quản lý bởi"
              name="managedBy"
              rules={[{ required: true, message: "Vui lòng chọn người quản lý!" }]}
            >
              <Select placeholder="Chọn người quản lý">{managerOptions}</Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={6}>
            <Form.Item
              label="Hình thức làm việc"
              name="workMode"
              rules={[{ required: true, message: "Vui lòng chọn hình thức làm việc!" }]}
            >
              <Select placeholder="Chọn hình thức làm việc">{workModeOptions}</Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={6}>
            <Form.Item
              label="Giờ nghỉ trưa"
              name="lunchBreak"
              rules={[{ required: true, message: "Vui lòng chọn giờ nghỉ trưa!" }]}
            >
              <Input disabled />
            </Form.Item>
          </Col>
        </Row>
      ) : (
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={6}>
            <p>
              <strong>Ngày gia nhập công ty:</strong>{" "}
              {formatDate(initialData?.joinDate) || "N/A"}
            </p>
          </Col>
          <Col xs={24} sm={6}>
            <p>
              <strong>Cơ sở làm việc:</strong> {initialData?.workLocation || "N/A"}
            </p>
          </Col>
          <Col xs={24} sm={6}>
            <p>
              <strong>Bộ phận:</strong> {initialData?.department || "N/A"}
            </p>
          </Col>
          <Col xs={24} sm={6}>
            <p>
              <strong>Chức vụ:</strong> {initialData?.jobTitle || "N/A"}
            </p>
          </Col>
          <Col xs={24} sm={6}>
            <p>
              <strong>Cấp bậc:</strong> {initialData?.level || "N/A"}
            </p>
          </Col>
          <Col xs={24} sm={6}>
            <p>
              <strong>Vị trí:</strong> {initialData?.position || "N/A"}
            </p>
          </Col>
          <Col xs={24} sm={6}>
            <p>
              <strong>Được quản lý bởi:</strong> {initialData?.managedBy || "N/A"}
            </p>
          </Col>
          <Col xs={24} sm={6}>
            <p>
              <strong>Hình thức làm việc:</strong> {initialData?.workMode || "N/A"}
            </p>
          </Col>
          <Col xs={24} sm={6}>
            <p>
              <strong>Giờ nghỉ trưa:</strong>{" "}
              {breakTime || initialData?.lunchBreak || "N/A"}
            </p>
          </Col>
        </Row>
      )}
    </div>
  );
});

export default WorkInfo;