import React from 'react';
import { Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  HomeOutlined,
  ScheduleOutlined,
  AppstoreAddOutlined,
  UserOutlined,
  TeamOutlined,
  DollarOutlined,
  LockOutlined,
  SettingOutlined,
  SafetyCertificateOutlined,
  FileDoneOutlined,
  AuditOutlined,
  CalendarOutlined,
  ApartmentOutlined,
  FileProtectOutlined,
  ProfileOutlined,
  HistoryOutlined,
  SendOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';

const MenuList = ({ darkTheme }) => {
  const navigate = useNavigate();
  const location = useLocation(); 

  const getSelectedKey = () => {
    const path = location.pathname;
    if (path === '/dashboard') {
      return ['dashboard'];
    }
    if (path.startsWith('/checkin/daily')) {
      return ['checkin-daily'];
    }
    if (path.startsWith('/checkin/history')) {
      return ['checkin-history'];
    }
    if (path.startsWith('/create')) {
      return ['create']; 
    }
    if (path.startsWith('/infomation')) {
      return ['profile-info'];
    }    
    if (path === '/salary') {
      return ['salary-info'];
    }
    if (path.startsWith('/hr/profile')) {
      return ['hr-profile'];
    }
    if (path.startsWith('/hr/salary')) {
      return ['hr-salary-table'];
    }
    if (path.startsWith('/hr/checkin/history')) {
      return ['hr-checkin-history'];
    }
    if (path.startsWith('/letter/sent')) {
      return ['your-letter'];
    }
    if (path.startsWith('/letter/approved')) {
      return ['approved-letter'];
    }
    if (path.startsWith('/setting/structure')) {
      return ['setting-structure'];
    }
    if (path.startsWith('/setting/checkin')) {
      return ['setting-checkin'];
    }
    if (path.startsWith('/setting/insurance')) {
      return ['setting-insurance'];
    }
    if (path.startsWith('/setting/contract')) {
      return ['setting-contract'];
    }
    if (path.startsWith('/setting/tax')) {
      return ['setting-tax'];
    }
    if (path.startsWith('/setting/salary')) {
      return ['setting-salary'];
    }
    if (path.startsWith('/permission/role')) {
      return ['permission-role'];
    }
    if (path.startsWith('/permission/detail')) {
      return ['permission-detail'];
    }
    return ['dashboard'];
  };

  const handleMenuClick = (e) => {
    switch (e.key) {
      case 'dashboard':
        navigate('/dashboard');
        break;
      case 'checkin-daily':
        navigate('/checkin/daily');
        break;
      case 'checkin-history':
        navigate('/checkin/history');
        break;
      case 'create':
        navigate('/create/personal');
        break;
      case 'profile-info':
        navigate('/infomation/personal');
        break;
      case 'salary-info':
        navigate('/salary');
        break;
      case 'hr-profile':
        navigate('/hr/profile');
        break;
      case 'hr-salary-table':
        navigate('/hr/salary');
        break;
      case 'hr-checkin-history':
        navigate('/hr/checkin/history');
        break;
      case 'your-letter':
        navigate('/letter/sent');
        break;
      case 'approved-letter':
        navigate('/letter/approved');
        break;
      case 'setting-structure':
        navigate('/setting/structure');
        break;
      case 'setting-checkin':
        navigate('/setting/checkin');
        break;
      case 'setting-insurance':
        navigate('/setting/insurance');
        break;
      case 'setting-contract':
        navigate('/setting/contract');
        break;
      case 'setting-tax':
        navigate('/setting/tax');
        break;
      case 'setting-salary':
        navigate('/setting/salary');
        break;
      case 'permission-role':
        navigate('/permission/role');
        break;
      case 'permission-detail':
        navigate('/permission/detail');
        break;
      default:
        break;
    }
  };

  return (
    <Menu
      theme={darkTheme ? 'dark' : 'light'}
      mode="inline"
      selectedKeys={getSelectedKey()}
      className="menu-bar"
      onClick={handleMenuClick}
    >
      <Menu.Item key="dashboard" icon={<HomeOutlined />}>
        DashBoard
      </Menu.Item>

      <Menu.SubMenu key="checkin" icon={<CalendarOutlined />} title="Chấm công">
        <Menu.Item key="checkin-daily" icon={<ScheduleOutlined />}>
          Hàng ngày
        </Menu.Item>
        <Menu.Item key="checkin-history" icon={<HistoryOutlined />}>
          Lịch sử chấm công
        </Menu.Item>
      </Menu.SubMenu>

      <Menu.Item key="create" icon={<AppstoreAddOutlined />}>
        Tạo mới
      </Menu.Item>

      <Menu.Item key="profile-info" icon={<UserOutlined />}>
        Hồ sơ
      </Menu.Item>

      <Menu.Item key="salary-info" icon={<DollarOutlined />}>
        Lương
      </Menu.Item>

      <Menu.SubMenu key="hr" icon={<TeamOutlined />} title="Nhân sự">
        <Menu.Item key="hr-profile" icon={<UserOutlined />}>
          Hồ sơ
        </Menu.Item>
        <Menu.Item key="hr-salary-table" icon={<DollarOutlined />}>
          Lương
        </Menu.Item>
        <Menu.Item key="hr-checkin-history" icon={<HistoryOutlined />}>
          Lịch sử chấm công
        </Menu.Item>
      </Menu.SubMenu>

      <Menu.SubMenu key="letter" icon={<FileProtectOutlined />} title="Đơn từ">
        <Menu.Item key="your-letter" icon={<SendOutlined />}>
          Đã gửi
        </Menu.Item>
        <Menu.Item key="approved-letter" icon={<CheckCircleOutlined />}>
          Cần duyệt
        </Menu.Item>
      </Menu.SubMenu>

      <Menu.SubMenu key="setting" icon={<SettingOutlined />} title="Cài đặt">
        <Menu.Item key="setting-structure" icon={<ApartmentOutlined />}>
          Cơ cấu tổ chức
        </Menu.Item>
        <Menu.Item key="setting-checkin" icon={<CalendarOutlined />}>
          Chấm công
        </Menu.Item>
        <Menu.Item key="setting-insurance" icon={<SafetyCertificateOutlined />}>
          Bảo hiểm
        </Menu.Item>
        <Menu.Item key="setting-contract" icon={<FileDoneOutlined />}>
          Hợp đồng
        </Menu.Item>
        <Menu.Item key="setting-tax" icon={<AuditOutlined />}>
          Thuế TNCN
        </Menu.Item>
        <Menu.Item key="setting-salary" icon={<DollarOutlined />}>
          Lương
        </Menu.Item>
      </Menu.SubMenu>

      <Menu.SubMenu key="permission" icon={<LockOutlined />} title="Phân quyền">
        <Menu.Item key="permission-role" icon={<TeamOutlined />}>
          Nhóm quyền
        </Menu.Item>
        <Menu.Item key="permission-detail" icon={<ProfileOutlined />}>
          Chi tiết quyền
        </Menu.Item>
      </Menu.SubMenu>
    </Menu>
  );
};

export default MenuList;