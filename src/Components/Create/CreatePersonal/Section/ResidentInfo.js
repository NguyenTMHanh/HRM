import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Input, Select, Row, Col } from 'antd';

const { Option } = Select;

const ResidentInfo = ({ setProvinceMap, setDistrictMap, setWardMap }) => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvinceCode, setSelectedProvinceCode] = useState(null);
  const [selectedDistrictCode, setSelectedDistrictCode] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get('https://localhost:7239/proxy/api/provinces', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}` // Thêm token nếu endpoint yêu cầu xác thực
          }
        });
        setProvinces(response.data);
        // Tạo ánh xạ code -> name cho tỉnh
        const provinceMapping = response.data.reduce((map, province) => {
          map[province.code] = province.name;
          return map;
        }, {});
        setProvinceMap(provinceMapping); // Gửi ánh xạ lên parent
        setError(null);
      } catch (error) {
        console.error('Error fetching provinces:', error);
        setError('Không thể tải danh sách tỉnh/thành phố. Vui lòng thử lại sau.');
      }
    };
    fetchProvinces();
  }, [setProvinceMap]);

  const handleProvinceChange = async (name, option) => {
    const code = option.key; // Lấy code từ key của Option
    setSelectedProvinceCode(code);
    setDistricts([]);
    setWards([]);

    try {
      const response = await axios.get(`https://localhost:7239/proxy/api/provinces/${code}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}` // Thêm token nếu cần
        }
      });
      setDistricts(response.data.districts);
      // Tạo ánh xạ code -> name cho quận
      const districtMapping = response.data.districts.reduce((map, district) => {
        map[district.code] = district.name;
        return map;
      }, {});
      setDistrictMap(districtMapping); // Gửi ánh xạ lên parent
      setError(null);
    } catch (error) {
      console.error('Error fetching districts:', error);
      setError('Không thể tải danh sách quận/huyện. Vui lòng thử lại sau.');
    }
  };

  const handleDistrictChange = async (name, option) => {
    const code = option.key; // Lấy code từ key của Option
    setSelectedDistrictCode(code);
    setWards([]);

    try {
      const response = await axios.get(`https://localhost:7239/proxy/api/districts/${code}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}` // Thêm token nếu cần
        }
      });
      setWards(response.data.wards);
      // Tạo ánh xạ code -> name cho phường
      const wardMapping = response.data.wards.reduce((map, ward) => {
        map[ward.code] = ward.name;
        return map;
      }, {});
      setWardMap(wardMapping); // Gửi ánh xạ lên parent
      setError(null);
    } catch (error) {
      console.error('Error fetching wards:', error);
      setError('Không thể tải danh sách xã/phường. Vui lòng thử lại sau.');
    }
  };

  return (
    <Row gutter={[16, 16]}>
      {error && (
        <Col xs={24}>
          <p style={{ color: 'red' }}>{error}</p>
        </Col>
      )}
      <Col xs={24} sm={6}>
        <Form.Item label="Tỉnh/Thành phố" name="provinceResident">
          <Select
            placeholder="Chọn tỉnh/thành phố"
            style={{ width: '100%' }}
            onChange={handleProvinceChange}
          >
            {provinces.map(province => (
              <Option key={province.code} value={province.name}>
                {province.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Col>

      <Col xs={24} sm={6}>
        <Form.Item label="Quận/Huyện" name="districtResident">
          <Select
            placeholder="Chọn quận/huyện"
            style={{ width: '100%' }}
            onChange={handleDistrictChange}
            disabled={!selectedProvinceCode}
          >
            {districts.map(district => (
              <Option key={district.code} value={district.name}>
                {district.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Col>

      <Col xs={24} sm={6}>
        <Form.Item label="Xã/Phường" name="wardResident">
          <Select
            placeholder="Chọn xã/phường"
            style={{ width: '100%' }}
            disabled={!selectedDistrictCode}
          >
            {wards.map(ward => (
              <Option key={ward.code} value={ward.name}>
                {ward.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Col>

      <Col xs={24} sm={6}>
        <Form.Item label="Số nhà" name="houseNumberResident">
          <Input placeholder="Nhập số nhà" />
        </Form.Item>
      </Col>
    </Row>
  );
};

export default ResidentInfo;