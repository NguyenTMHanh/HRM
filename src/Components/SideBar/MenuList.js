import { Menu } from "antd";
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
    CheckCircleOutlined
} from "@ant-design/icons";

const MenuList = ({darkTheme}) => {
    return (
        <Menu theme={darkTheme ? 'dark' : 'light' } mode="inline" defaultSelectedKeys={["dashboard"]} className="menu-bar">
            <Menu.Item key="dashboard" icon={<HomeOutlined />}>
                DashBoard
            </Menu.Item>

            <Menu.SubMenu key="attendance" icon={<CalendarOutlined />} title="Chấm công">
                <Menu.Item key="attendance-daily" icon={<ScheduleOutlined />}>
                    Hàng ngày
                </Menu.Item>
                <Menu.Item key="attendance-history" icon={<HistoryOutlined />}>
                    Lịch sử chấm công
                </Menu.Item>
            </Menu.SubMenu>

            <Menu.Item key="create" icon={<AppstoreAddOutlined />}>
                Tạo mới
            </Menu.Item>

            <Menu.Item key="personal" icon={<UserOutlined />}>
                Hồ sơ
            </Menu.Item>

            <Menu.Item key="salary" icon={<DollarOutlined />}>
                Lương
            </Menu.Item>

            <Menu.SubMenu key="hr" icon={<TeamOutlined />} title="Nhân sự">
                <Menu.Item key="hr-profile" icon={<UserOutlined />}>
                    Hồ sơ
                </Menu.Item>
                <Menu.Item key="hr-salary-table" icon={<DollarOutlined />}>
                    Lương
                </Menu.Item>
                <Menu.Item key="hr-attendance-history" icon={<HistoryOutlined />}>
                    Lịch sử chấm công
                </Menu.Item>
            </Menu.SubMenu>


            <Menu.SubMenu key="documents" icon={<FileProtectOutlined />} title="Đơn từ">
                <Menu.Item key="your-documents" icon={<SendOutlined />}>Đã gửi</Menu.Item>
                <Menu.Item key="approved-documents" icon={<CheckCircleOutlined />}>Cần duyệt</Menu.Item>
            </Menu.SubMenu>


            <Menu.SubMenu key="settings" icon={<SettingOutlined />} title="Cài đặt">
                <Menu.Item key="settings-organization" icon={<ApartmentOutlined />}>
                    Cơ cấu tổ chức
                </Menu.Item>
                <Menu.Item key="settings-attendance" icon={<CalendarOutlined />}>
                    Chấm công
                </Menu.Item>
                <Menu.Item key="settings-insurance" icon={<SafetyCertificateOutlined />}>
                    Bảo hiểm
                </Menu.Item>
                <Menu.Item key="settings-contract" icon={<FileDoneOutlined />}>
                    Hợp đồng
                </Menu.Item>
                <Menu.Item key="settings-tax" icon={<AuditOutlined />}>
                    Thuế TNCN
                </Menu.Item>
                <Menu.Item key="settings-salary" icon={<DollarOutlined />}>
                    Lương
                </Menu.Item>
            </Menu.SubMenu>

            <Menu.SubMenu key="permission" icon={<LockOutlined />} title="Phân quyền">
                <Menu.Item key="role-management" icon={<TeamOutlined />}>
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
