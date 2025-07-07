import React, {useState } from "react";
import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import HeaderBar from "../components/Header";

const { Content } = Layout;

const MainLayout: React.FC = () => {
  //todo: ສ້າງ state ຈັດການສະໄລເມນູ
  const [collapsed, setCollapsed] = useState(true);


  //todo: ສ້າງ function ກົດສະໄລເມນູ
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };


  return (
    <Layout>
      {/* Sidebar Menu */}
      <Sidebar collapsed={collapsed} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <Layout style={{ marginLeft: collapsed ? 80 : 220, marginTop: 50,transition: "margin-left 0.3s ease" }}>

        <HeaderBar collapsed={collapsed} toggleSidebar={toggleSidebar} />

        <Content style={{ padding: "25px 10px",backgroundColor:"#F5F5F5", minHeight: "calc(93vh)", }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;

