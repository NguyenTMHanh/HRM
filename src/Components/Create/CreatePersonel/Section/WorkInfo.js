import React, { useEffect, useState } from 'react';
import { Form, Input, Select, DatePicker, Row, Col } from 'antd';
import moment from 'moment';

const WorkInfo = ({ form, ...data }) => {
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

  // Helper function to format dates for display
  const formatDate = (date) => {
    if (!date) return '';
    if (typeof date === 'string') return date; // Already formatted as string (e.g., "01/01/2002")
    if (moment.isMoment(date)) return date.format('DD/MM/YYYY'); // Moment object
    console.warn('Unexpected date format:', date);
    return '';
  };

  return (
    <div>
      {form ? (
        // Edit/Create mode with form
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
                {locations.map(loc => (
                  <Select.Option key={loc} value={loc}>
                    {loc}
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
                {departments.map(dep => (
                  <Select.Option key={dep} value={dep}>
                    {dep}
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
                {positions.map(pos => (
                  <Select.Option key={pos} value={pos}>
                    {pos}
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
                {levels.map(level => (
                  <Select.Option key={level} value={level}>
                    {level}
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
                {locations.map(loc => (
                  <Select.Option key={loc} value={loc}>
                    {loc}
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
                {managers.map(manager => (
                  <Select.Option key={manager} value={manager}>
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
                {workModes.map(mode => (
                  <Select.Option key={mode} value={mode}>
                    {mode}
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
              <Select placeholder="Chọn giờ nghỉ trưa">
                {lunchBreaks.map(lunch => (
                  <Select.Option key={lunch} value={lunch}>
                    {lunch}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      ) : (
        // Display mode
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={6}>
            <p><strong>Họ và tên:</strong> {data.fullName || 'N/A'}</p>
          </Col>
          <Col xs={24} sm={6}>
            <p><strong>Giới tính:</strong> {data.gender || 'N/A'}</p>
          </Col>
          <Col xs={24} sm={6}>
            <p><strong>Ngày sinh:</strong> {formatDate(data.dateOfBirth) || 'N/A'}</p>
          </Col>
          <Col xs={24} sm={6}>
            <p><strong>Ngày gia nhập công ty:</strong> {formatDate(data.joinDate) || 'N/A'}</p>
          </Col>
          <Col xs={24} sm={6}>
            <p><strong>Cơ sở làm việc:</strong> {data.workLocation || 'N/A'}</p>
          </Col>
          <Col xs={24} sm={6}>
            <p><strong>Bộ phận:</strong> {data.department || 'N/A'}</p>
          </Col>
          <Col xs={24} sm={6}>
            <p><strong>Chức vụ:</strong> {data.jobTitle || 'N/A'}</p>
          </Col>
          <Col xs={24} sm={6}>
            <p><strong>Cấp bậc:</strong> {data.level || 'N/A'}</p>
          </Col>
          <Col xs={24} sm={6}>
            <p><strong>Vị trí:</strong> {data.position || 'N/A'}</p>
          </Col>
          <Col xs={24} sm={6}>
            <p><strong>Được quản lý bởi:</strong> {data.managedBy || 'N/A'}</p>
          </Col>
          <Col xs={24} sm={6}>
            <p><strong>Hình thức làm việc:</strong> {data.workMode || 'N/A'}</p>
          </Col>
          <Col xs={24} sm={6}>
            <p><strong>Giờ nghỉ trưa:</strong> {data.lunchBreak || 'N/A'}</p>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default WorkInfo;