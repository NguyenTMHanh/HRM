import React, { useState, useEffect } from 'react';
import { Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  HomeOutlined,
  CalendarOutlined,
  ScheduleOutlined,
  HistoryOutlined,
  AppstoreAddOutlined,
  UserOutlined,
  FileDoneOutlined,
  DollarOutlined,
  TeamOutlined,
  FileProtectOutlined,
  ProfileOutlined,
  SendOutlined,
  CheckCircleOutlined,
  SettingOutlined,
  ApartmentOutlined,
  SafetyCertificateOutlined,
  AuditOutlined,
  LockOutlined,
} from '@ant-design/icons';

const MenuList = ({ darkTheme }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [permissions, setPermissions] = useState([]);
  const [hasAllModule, setHasAllModule] = useState(false);
  const [refresh, setRefresh] = useState(0); 


  useEffect(() => {
    const storedPermissions = JSON.parse(localStorage.getItem('permissions')) || [];   
    setPermissions(storedPermissions);
    setHasAllModule(storedPermissions.some((p) => p?.moduleId === 'allModule'));
    setRefresh((prev) => prev + 1); 
  }, []);

 
  const getSelectedKey = () => {
    const path = location.pathname;
    if (path === '/dashboard') return ['dashboard'];
    if (path.startsWith('/checkin/daily')) return ['checkin-daily'];
    if (path.startsWith('/checkin/history')) return ['checkin-history'];
    if (path.startsWith('/create')) return ['create'];
    if (path.startsWith('/infomation')) return ['profile-info'];
    if (path === '/salary') return ['salary-info'];
    if (path.startsWith('/hr/profile')) return ['hr-profile'];
    if (path.startsWith('/hr/salary')) return ['hr-salary-table'];
    if (path.startsWith('/hr/checkin/history')) return ['hr-checkin-history'];
    if (path.startsWith('/letter/sent')) return ['your-letter'];
    if (path.startsWith('/letter/approved')) return ['approved-letter'];
    if (path.startsWith('/setting/structure')) return ['setting-structure'];
    if (path.startsWith('/setting/checkin')) return ['setting-checkin'];
    if (path.startsWith('/setting/insurance')) return ['setting-insurance'];
    if (path.startsWith('/setting/contract')) return ['setting-contract'];
    if (path.startsWith('/setting/tax')) return ['setting-tax'];
    if (path.startsWith('/setting/salary')) return ['setting-salary'];
    if (path.startsWith('/permission/role')) return ['permission-role'];
    if (path.startsWith('/permission/detail')) return ['permission-detail'];
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
        navigate('/create');
        break;
      case 'profile-info':
        navigate('/infomation/personal');
        break;
      case 'salary-info':
        navigate('/salary');
        break;
      case 'hr-profile':
        navigate('/hr/profile/personel');
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
        navigate('/setting/structure/rank');
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

  const isAccessible = (key) => {
    if (['dashboard', 'checkin-daily', 'checkin-history', 'profile-info', 'salary-info', 'your-letter'].includes(key)) {
      return true;
    }
    if (hasAllModule) {
      return true;
    }
    switch (key) {
      case 'create':
        const canCreate = permissions.some((p) => {
          const moduleId = p?.moduleId || '';
          const actionId = p?.actionId || '';
          return moduleId.toLowerCase() === 'hrpersonel' && actionId.toLowerCase() === 'create';
        });
        return canCreate;
      case 'hr-profile':
        const canAccessHrProfile = permissions.some((p) => p?.moduleId === 'HrPersonel');
        return canAccessHrProfile;
      case 'hr-salary-table':
        const canAccessHrSalary = permissions.some((p) => p?.moduleId === 'HrSalary');
        return canAccessHrSalary;
      case 'hr-checkin-history':
        const canAccessHrCheckin = permissions.some((p) => p?.moduleId === 'HrHistoryCheckin');
        return canAccessHrCheckin;
      case 'approved-letter':
        const canAccessApprovedLetter = permissions.some((p) => p?.moduleId === 'HrPersonel');
        return canAccessApprovedLetter;
      case 'setting-structure':
      case 'setting-checkin':
      case 'setting-insurance':
      case 'setting-contract':
      case 'setting-tax':
      case 'setting-salary':
        const canAccessSetting = permissions.some((p) => p?.moduleId === 'setting');
        return canAccessSetting;
      case 'permission-role':
      case 'permission-detail':
        const canAccessPermission = permissions.some((p) => p?.moduleId === 'permission');
        return canAccessPermission;
      default:
        return false;
    }
  };

  const filterMenuItems = (items) => {
    return items
      .map((item) => {
        if (item.children) {
          const filteredChildren = filterMenuItems(item.children);
          return { ...item, children: filteredChildren };
        } else {
          return item;
        }
      })
      .filter((item) => {
        const isItemAccessible = item.children ? item.children.length > 0 : isAccessible(item.key);
        return isItemAccessible;
      });
  };

  const menuItems = [
    {
      key: 'dashboard',
      icon: <HomeOutlined />,
      label: 'DashBoard',
    },
    {
      key: 'checkin',
      icon: <CalendarOutlined />,
      label: 'Chấm công',
      children: [
        {
          key: 'checkin-daily',
          icon: <ScheduleOutlined />,
          label: 'Hàng ngày',
        },
        {
          key: 'checkin-history',
          icon: <HistoryOutlined />,
          label: 'Lịch sử chấm công',
        },
      ],
    },
    {
      key: 'create',
      icon: <AppstoreAddOutlined />,
      label: 'Tạo mới',
    },
    {
      key: 'profile-info',
      icon: <UserOutlined />,
      label: 'Hồ sơ',
    },
    {
      key: 'salary-info',
      icon: <DollarOutlined />,
      label: 'Lương',
    },
    {
      key: 'hr',
      icon: <TeamOutlined />,
      label: 'Nhân sự',
      children: [
        {
          key: 'hr-profile',
          icon: <UserOutlined />,
          label: 'Hồ sơ',
        },
        {
          key: 'hr-salary-table',
          icon: <DollarOutlined />,
          label: 'Lương',
        },
        {
          key: 'hr-checkin-history',
          icon: <HistoryOutlined />,
          label: 'Lịch sử chấm công',
        },
      ],
    },
    {
      key: 'letter',
      icon: <FileProtectOutlined />,
      label: 'Đơn từ',
      children: [
        {
          key: 'your-letter',
          icon: <SendOutlined />,
          label: 'Đã gửi',
        },
        {
          key: 'approved-letter',
          icon: <CheckCircleOutlined />,
          label: 'Cần duyệt',
        },
      ],
    },
    {
      key: 'setting',
      icon: <SettingOutlined />,
      label: 'Cài đặt',
      children: [
        {
          key: 'setting-structure',
          icon: <ApartmentOutlined />,
          label: 'Cơ cấu tổ chức',
        },
        {
          key: 'setting-checkin',
          icon: <CalendarOutlined />,
          label: 'Chấm công',
        },
        {
          key: 'setting-insurance',
          icon: <SafetyCertificateOutlined />,
          label: 'Bảo hiểm',
        },
        {
          key: 'setting-tax',
          icon: <AuditOutlined />,
          label: 'Thuế TNCN',
        },
        {
          key: 'setting-salary',
          icon: <DollarOutlined />,
          label: 'Lương',
        },
      ],
    },
    {
      key: 'permission',
      icon: <LockOutlined />,
      label: 'Phân quyền',
      children: [
        {
          key: 'permission-role',
          icon: <TeamOutlined />,
          label: 'Nhóm quyền',
        },
      ],
    },
  ];

  const visibleMenuItems = filterMenuItems(menuItems);

  return (
    <Menu
      theme={darkTheme ? 'dark' : 'light'}
      mode="inline"
      selectedKeys={getSelectedKey()}
      className="menu-bar"
      onClick={handleMenuClick}
      items={visibleMenuItems}
      key={refresh} 
    />
  );
};

export default MenuList;