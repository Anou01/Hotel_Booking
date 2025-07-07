import { Layout, Menu } from "antd";
import React, { useEffect, useState } from "react";
import { UserOutlined, MenuOutlined } from "@ant-design/icons";
import { MdOutlineBedroomParent } from "react-icons/md";
import { FaAddressBook } from "react-icons/fa";
import { RiFolderUserLine } from "react-icons/ri";
import { LuLayoutDashboard } from "react-icons/lu";
import { useLocation, useNavigate } from "react-router-dom";
import "../assets/Sidebar.css";
import { getSelectedKeyFromPath, handleMenuClick } from "../utils/sidebarUtils";

const { Sider } = Layout;

const customMenuStyle = {
  background: "#103763",
  color: "white",
};

const Sidebar: React.FC<{ collapsed: boolean; toggleSidebar: () => void }> = ({
  collapsed,
  toggleSidebar,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedKey, setSelectedKey] = useState<string>("1");


  useEffect(() => {
    const key = getSelectedKeyFromPath(location.pathname);
    setSelectedKey(key);
  }, [location.pathname]);

  const onMenuClick = (e: { key: string }) => {
    setSelectedKey(e.key);
    handleMenuClick(e.key, navigate);
  };

  return (
    <Sider
    //   className="sidebar"
      collapsed={collapsed}
      collapsible
      trigger={null}
      width={220}
      style={{
        background: "#103763",
        height: "100dvh",
        position: "fixed",
        left: 0,
        top: 0,
      }}
    >
      <div className="logo" style={{
          padding: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "flex-start",
          color: "white",
          fontSize: 20,
          fontWeight: "bold",
        }}>
        <MenuOutlined
          onClick={toggleSidebar}
          style={{ fontSize: 24, marginRight: collapsed ? 0 : 5 }}
        />{" "}
        {!collapsed && "My Hotel"}
      </div>
      <Menu
        // className="sidebar-menu"
        theme="dark"
        mode="inline"
        selectedKeys={[selectedKey]}
        onClick={onMenuClick}
        style={customMenuStyle}
        items={[
          {
            key: "1",
            icon: <LuLayoutDashboard />,
            label: "ພາບລວມ",
          },
          {
            key: "3",
            icon: <FaAddressBook />,
            label: "ຈັດການຈອງ",
          },
          {
            key: "2",
            icon: <RiFolderUserLine />,
            label: "ຈັດການລູກຄ້າ",
          },
          {
            key: "4",
            icon: <MdOutlineBedroomParent />,
            label: "ຈັดການຫ້ອງ",
          },
          {
            key: "5",
            icon: <UserOutlined />,
            label: "ຈັດການຜູ້ໃຊ້ງານ",
          },
        ]}
      />
    </Sider>
  );
};

export default Sidebar;