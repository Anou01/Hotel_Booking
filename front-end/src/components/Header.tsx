import { MenuOutlined, LogoutOutlined } from "@ant-design/icons";
import { Avatar, Button, Layout, Typography, Dropdown } from "antd";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { convertPathname } from "../utils/pathnameUtils";
import { UserLogin } from "../types/user";
import type { MenuProps } from 'antd';

const { Header } = Layout;
const { Title, Text } = Typography;

const HeaderBar: React.FC<{
  toggleSidebar: () => void;
  collapsed: boolean;
}> = ({ toggleSidebar, collapsed }) => {
  const location = useLocation();
  const navigate = useNavigate(); // สำหรับเปลี่ยนหน้า
  const [laoPathname, setLaoPathname] = useState<string>("");
  const [user, setUser] = React.useState<UserLogin | null>(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        return JSON.parse(savedUser) as UserLogin;
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
        localStorage.removeItem("user");
        return null;
      }
    }
    return null;
  });

  // อัปเดต laoPathname เมื่อ pathname เปลี่ยน
  useEffect(() => {
    const laoText = convertPathname(location.pathname);
    setLaoPathname(laoText);
  }, [location.pathname]);

  // ฟังก์ชัน Logout
  const handleLogout = async () => {
    try {
      navigate("/login"); // เปลี่ยนไปหน้า Login
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null); // ล้างข้อมูลผู้ใช้ใน AuthContext
      openNotification("success", {
        message: "ອອກຈາກລະບົບສຳເລັດ",
        description: "ທ່ານຖືກອອກຈາກລະບົບສຳເລັດແລ້ວ",
      });
    } catch (err) {
      openNotification("error", {
        message: "ເກີດຂໍ້ຜິດພາດໃນການອອກຈາກລະບົບ",
        description: "ກະລຸນາລອງໃໝ່ອີກຄັ້ງ",
      });
    } finally {
    }
  };

  // Notification (สมมติว่าใช้ useCustomNotification)
  const openNotification = (
    type: "success" | "error",
    options: { message: string; description: string }
  ) => {
    // ใช้ logic notification เดียวกับโปรเจกต์ของคุณ
    console.log(`${type}: ${options.message} - ${options.description}`);
  };

  // Menu Dropdown สำหรับ Logout
  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <a onClick={handleLogout} href="#">
          ອອກຈາກລະບົບ
        </a>
      ),
      icon: <LogoutOutlined />,
    },
  ];

  return (
    <Header
      style={{
        background: "#fff",
        padding: "10px 20px",
        position: "fixed",
        width: collapsed ? "100%" : "calc(100% - 220px)",
        left: collapsed ? 0 : 220,
        top: 0,
        zIndex: 10,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        transition: "left 0.3s ease, width 0.3s ease",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        {collapsed && (
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={toggleSidebar}
            style={{ marginRight: 10 }}
          />
        )}

        <Title level={5} style={{ margin: 0 }}>
          {laoPathname}
        </Title>
      </div>

      <div style={{ display: "flex", alignItems: "center" }}>
        {user && (
          <>
            <Text
              strong
              style={{ marginRight: 10 }}
            >{`${user.name} (${user.role})`}</Text>
            <Dropdown menu={{ items }} trigger={["click"]}>
              <Avatar
                src={`http://localhost:5000${
                  user.profileImage || "/default-avatar.png"
                }`}
                style={{ cursor: "pointer" }}
              >
                {user.name.charAt(0)} {/* ตัวอักษรแรกของชื่อถ้าไม่มีรูป */}
              </Avatar>
            </Dropdown>
          </>
        )}
      </div>
    </Header>
  );
};

export default HeaderBar;
