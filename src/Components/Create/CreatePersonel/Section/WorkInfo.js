import React, { useEffect, useState } from 'react';
import { Form, Input, Select, DatePicker, Row, Col, message } from 'antd';
import moment from 'moment';
import axios from 'axios';

// Axios configuration
axios.defaults.baseURL = 'https://localhost:7239';
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers['Content-Type'] = 'application/json';
    return config;
  },
  (error) => Promise.reject(error)
);

const WorkInfo = ({ form, initialData, breakTime }) => { // Add breakTime as a prop
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [jobTitles, setJobTitles] = useState([]);
  const [ranks, setRanks] = useState([]);
  const [branches, setBranches] = useState([]);
  const [workModes, setWorkModes] = useState([]);
  const [managers, setManagers] = useState([]);

  // Fetch departments from API
  const fetchDepartments = async () => {
    try {
      const response = await axios.get('/api/Department');
      setDepartments(response.data);
    } catch (err) {
      console.error('Error fetching departments:', err);
      message.error('Không thể tải danh sách bộ phận.');
    }
  };

  // Fetch positions from API
  const fetchPositions = async () => {
    try {
      const response = await axios.get('/api/Position');
      setPositions(response.data);
    } catch (err) {
      console.error('Error fetching positions:', err);
      message.error('Không thể tải danh sách vị trí.');
    }
  };

  // Fetch job titles from API
  const fetchJobTitles = async () => {
    try {
      const response = await axios.get('/api/JobTitle');
      setJobTitles(response.data);
    } catch (err) {
      console.error('Error fetching job titles:', err);
      message.error('Không thể tải danh sách chức vụ.');
    }
  };

  // Fetch branches from API
  const fetchBranches = async () => {
    try {
      const response = await axios.get('/api/Branch');
      setBranches(response.data);
    } catch (err) {
      console.error('Error fetching branches:', err);
      message.error('Không thể tải danh sách chi nhánh.');
    }
  };

  // Fetch ranks from API
  const fetchRanks = async () => {
    try {
      const response = await axios.get('/api/Rank');
      setRanks(response.data);
    } catch (err) {
      console.error('Error fetching ranks:', err);
      message.error('Không thể tải danh sách cấp bậc.');
    }
  };

  // Fetch work modes from API
  const fetchWorkModes = async () => {
    try {
      const response = await axios.get('/api/JobType');
      setWorkModes(response.data);
    } catch (err) {
      console.error('Error fetching work modes:', err);
      message.error('Không thể tải danh sách hình thức làm việc.');
    }
  };

  useEffect(() => {
    fetchDepartments();
    fetchPositions();
    fetchJobTitles();
    fetchRanks();
    fetchBranches();
    fetchWorkModes();
    setManagers(['Lê Tiến Triển (CEO)', 'Nguyễn Văn B (Trưởng phòng)', 'Trần Văn C (Quản lý)']);
  }, []);

  // Helper function to format dates for display
  const formatDate = (date) => {
    if (!date) return '';
    if (typeof date === 'string') return date;
    if (moment.isMoment(date)) return date.format('DD/MM/YYYY');
    console.warn('Unexpected date format:', date);
    return '';
  };

  return (
    <div>
      {form ? (
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={6}>
            <Form.Item label="Họ và tên" name="fullName">
              <Input disabled />
            </Form.Item>
          </Col>

          <Col xs={24} sm={6}>
            <Form.Item label="Giới tính" name="gender">
              <Input disabled />
            </Form.Item>
          </Col>

          <Col xs={24} sm={6}>
            <Form.Item label="Ngày sinh" name="dateOfBirth">
              <DatePicker
                format="DD/MM/YYYY"
                style={{ width: '100%' }}
                disabled
                placeholder="Chọn ngày sinh"
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={6}>
            <Form.Item
              label="Ngày gia nhập công ty"
              name="joinDate"
              rules={[{ required: true, message: 'Vui lòng nhập ngày gia nhập!' }]}
            >
              <DatePicker
                format="DD/MM/YYYY"
                style={{ width: '100%' }}
                placeholder="Chọn ngày gia nhập"
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={6}>
            <Form.Item
              label="Cơ sở làm việc"
              name="workLocation"
              rules={[{ required: true, message: 'Vui lòng chọn cơ sở làm việc!' }]}
            >
              <Select placeholder="Chọn cơ sở làm việc">
                {branches.map((branch) => (
                  <Select.Option key={branch.id} value={branch.branchName}>
                    {branch.branchName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={6}>
            <Form.Item
              label="Bộ phận"
              name="department"
              rules={[{ required: true, message: 'Vui lòng chọn bộ phận!' }]}
            >
              <Select placeholder="Chọn bộ phận">
                {departments.map((dept) => (
                  <Select.Option key={dept.id} value={dept.departmentName}>
                    {dept.departmentName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={6}>
            <Form.Item
              label="Chức vụ"
              name="jobTitle"
              rules={[{ required: true, message: 'Vui lòng chọn chức vụ!' }]}
            >
              <Select placeholder="Chọn chức vụ">
                {jobTitles.map((job) => (
                  <Select.Option key={job.id} value={job.jobtitleName}>
                    {job.jobtitleName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={6}>
            <Form.Item
              label="Cấp bậc"
              name="level"
              rules={[{ required: true, message: 'Vui lòng chọn cấp bậc!' }]}
            >
              <Select placeholder="Chọn cấp bậc">
                {ranks.map((rank) => (
                  <Select.Option key={rank.id} value={rank.rankName}>
                    {rank.rankName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={6}>
            <Form.Item
              label="Vị trí"
              name="position"
              rules={[{ required: true, message: 'Vui lòng chọn vị trí!' }]}
            >
              <Select placeholder="Chọn vị trí">
                {positions.map((pos) => (
                  <Select.Option key={pos.id} value={pos.positionName}>
                    {pos.positionName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={6}>
            <Form.Item
              label="Được quản lý bởi"
              name="managedBy"
              rules={[{ required: true, message: 'Vui lòng chọn người quản lý!' }]}
            >
              <Select placeholder="Chọn người quản lý">
                {managers.map((manager, index) => (
                  <Select.Option key={index} value={manager}>
                    {manager}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={6}>
            <Form.Item
              label="Hình thức làm việc"
              name="workMode"
              rules={[{ required: true, message: 'Vui lòng chọn hình thức làm việc!' }]}
            >
              <Select placeholder="Chọn hình thức làm việc">
                {workModes.map((workMode) => (
                  <Select.Option key={workMode.id} value={workMode.nameJobType}>
                    {workMode.nameJobType}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={6}>
            <Form.Item
              label="Giờ nghỉ trưa"
              name="lunchBreak"
              rules={[{ required: true, message: 'Vui lòng chọn giờ nghỉ trưa!' }]}
            >
              <Input disabled />
            </Form.Item>
          </Col>
        </Row>
      ) : (
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={6}>
            <p><strong>Họ và tên:</strong> {initialData?.fullName || 'N/A'}</p>
          </Col>
          <Col xs={24} sm={6}>
            <p><strong>Giới tính:</strong> {initialData?.gender || 'N/A'}</p>
          </Col>
          <Col xs={24} sm={6}>
            <p><strong>Ngày sinh:</strong> {formatDate(initialData?.dateOfBirth) || 'N/A'}</p>
          </Col>
          <Col xs={24} sm={6}>
            <p><strong>Ngày gia nhập công ty:</strong> {formatDate(initialData?.joinDate) || 'N/A'}</p>
          </Col>
          <Col xs={24} sm={6}>
            <p><strong>Cơ sở làm việc:</strong> {initialData?.workLocation || 'N/A'}</p>
          </Col>
          <Col xs={24} sm={6}>
            <p><strong>Bộ phận:</strong> {initialData?.department || 'N/A'}</p>
          </Col>
          <Col xs={24} sm={6}>
            <p><strong>Chức vụ:</strong> {initialData?.jobTitle || 'N/A'}</p>
          </Col>
          <Col xs={24} sm={6}>
            <p><strong>Cấp bậc:</strong> {initialData?.level || 'N/A'}</p>
          </Col>
          <Col xs={24} sm={6}>
            <p><strong>Vị trí:</strong> {initialData?.position || 'N/A'}</p>
          </Col>
          <Col xs={24} sm={6}>
            <p><strong>Được quản lý bởi:</strong> {initialData?.managedBy || 'N/A'}</p>
          </Col>
          <Col xs={24} sm={6}>
            <p><strong>Hình thức làm việc:</strong> {initialData?.workMode || 'N/A'}</p>
          </Col>
          <Col xs={24} sm={6}>
            <p><strong>Giờ nghỉ trưa:</strong> {breakTime || initialData?.lunchBreak || 'N/A'}</p>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default WorkInfo;