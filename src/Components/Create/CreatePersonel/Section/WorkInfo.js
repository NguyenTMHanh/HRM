import React, { useEffect, useState } from 'react';
import { Form, Input, Select, DatePicker, Row, Col } from 'antd';

// Không cần import Option nữa
const WorkInfo = () => {
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [levels, setLevels] = useState([]);
  const [locations, setLocations] = useState([]);
  const [workModes, setWorkModes] = useState([]);
  const [lunchBreaks, setLunchBreaks] = useState([]);
  const [managers, setManagers] = useState([]);

  useEffect(() => {
    setDepartments(['Bộ phận nhân sự', 'Bộ phận IT', 'Bộ phận Kinh doanh']);
    setPositions(['Nhân viên', 'Trưởng phòng', 'Giám đốc']);
    setLevels(['Cấp 1', 'Cấp 2', 'Cấp 3']);
    setLocations(['Prima solutions', 'Văn phòng Hà Nội', 'Văn phòng TP.HCM']);
    setWorkModes(['Full-time', 'Part-time', 'Remote']);
    setLunchBreaks(['30 phút', '1h', '1.5h']);
    setManagers(['Lê Tiến Triển (CEO)', 'Nguyễn Văn B (Trưởng phòng)', 'Trần Văn C (Quản lý)']);
  }, []);

  return (
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
          <Input disabled />
        </Form.Item>
      </Col>

      <Col xs={24} sm={6}>
        <Form.Item
          label="Ngày gia nhập công ty"
          name="joinDate"
          rules={[{ required: true, message: 'Vui lòng nhập ngày gia nhập!' }]}
        >
          <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} placeholder="Chọn ngày gia nhập"/>
        </Form.Item>
      </Col>
      
      <Col xs={24} sm={6}>
        <Form.Item
          label="Cơ sở làm việc"
          name="workLocation"
          rules={[{ required: true, message: 'Vui lòng chọn cơ sở làm việc!' }]}
        >
          <Select>
            {locations.map(loc => <Select.Option key={loc} value={loc}>{loc}</Select.Option>)}
          </Select>
        </Form.Item>
      </Col>

      <Col xs={24} sm={6}>
        <Form.Item
          label="Bộ phận"
          name="department"
          rules={[{ required: true, message: 'Vui lòng chọn bộ phận!' }]}
        >
          <Select>
            {departments.map(dep => <Select.Option key={dep} value={dep}>{dep}</Select.Option>)}
          </Select>
        </Form.Item>
      </Col>

      <Col xs={24} sm={6}>
        <Form.Item
          label="Chức vụ"
          name="jobTitle"
          rules={[{ required: true, message: 'Vui lòng chọn chức vụ!' }]}
        >
          <Select>
            {positions.map(pos => <Select.Option key={pos} value={pos}>{pos}</Select.Option>)}
          </Select>
        </Form.Item>
      </Col>

      <Col xs={24} sm={6}>
        <Form.Item
          label="Cấp bậc"
          name="level"
          rules={[{ required: true, message: 'Vui lòng chọn cấp bậc!' }]}
        >
          <Select>
            {levels.map(level => <Select.Option key={level} value={level}>{level}</Select.Option>)}
          </Select>
        </Form.Item>
      </Col>

      <Col xs={24} sm={6}>
        <Form.Item
          label="Vị trí"
          name="position"
          rules={[{ required: true, message: 'Vui lòng chọn vị trí!' }]}
        >
          <Select>
            {locations.map(loc => <Select.Option key={loc} value={loc}>{loc}</Select.Option>)}
          </Select>
        </Form.Item>
      </Col>

      <Col xs={24} sm={6}>
        <Form.Item
          label="Được quản lý bởi"
          name="managedBy"
          rules={[{ required: true, message: 'Vui lòng chọn người quản lý!' }]}
        >
          <Select>
            {managers.map(manager => <Select.Option key={manager} value={manager}>{manager}</Select.Option>)}
          </Select>
        </Form.Item>
      </Col>

      <Col xs={24} sm={6}>
        <Form.Item
          label="Hình thức làm việc"
          name="workMode"
          rules={[{ required: true, message: 'Vui lòng chọn hình thức làm việc!' }]}
        >
          <Select>
            {workModes.map(mode => <Select.Option key={mode} value={mode}>{mode}</Select.Option>)}
          </Select>
        </Form.Item>
      </Col>

      <Col xs={24} sm={6}>
        <Form.Item
          label="Giờ nghỉ trưa"
          name="lunchBreak"
          rules={[{ required: true, message: 'Vui lòng chọn giờ nghỉ trưa!' }]}
        >
          <Select>
            {lunchBreaks.map(lunch => <Select.Option key={lunch} value={lunch}>{lunch}</Select.Option>)}
          </Select>
        </Form.Item>
      </Col>
    </Row>
  );
};

export default WorkInfo;