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

  useEffect(() => {
    axios.get('https://provinces.open-api.vn/api/p?depth=1')
      .then(response => {
        setProvinces(response.data);
        // Tạo ánh xạ code -> name cho tỉnh
        const provinceMapping = response.data.reduce((map, province) => {
          map[province.code] = province.name;
          return map;
        }, {});
        setProvinceMap(provinceMapping); // Gửi ánh xạ lên parent
      })
      .catch(error => {
        console.error('Error fetching provinces:', error);
      });
  }, [setProvinceMap]);

  const handleProvinceChange = (name, option) => {
    const code = option.key; // Lấy code từ key của Option
    setSelectedProvinceCode(code);
    setDistricts([]);
    setWards([]);

    axios.get(`https://provinces.open-api.vn/api/p/${code}?depth=2`)
      .then(response => {
        setDistricts(response.data.districts);
        // Tạo ánh xạ code -> name cho quận
        const districtMapping = response.data.districts.reduce((map, district) => {
          map[district.code] = district.name;
          return map;
        }, {});
        setDistrictMap(districtMapping); // Gửi ánh xạ lên parent
      })
      .catch(error => {
        console.error('Error fetching districts:', error);
      });
  };

  const handleDistrictChange = (name, option) => {
    const code = option.key; // Lấy code từ key của Option
    setSelectedDistrictCode(code);
    setWards([]);

    axios.get(`https://provinces.open-api.vn/api/d/${code}?depth=2`)
      .then(response => {
        setWards(response.data.wards);
        // Tạo ánh xạ code -> name cho phường
        const wardMapping = response.data.wards.reduce((map, ward) => {
          map[ward.code] = ward.name;
          return map;
        }, {});
        setWardMap(wardMapping); // Gửi ánh xạ lên parent
      })
      .catch(error => {
        console.error('Error fetching wards:', error);
      });
  };

  return (
    <Row gutter={[16, 16]}>
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