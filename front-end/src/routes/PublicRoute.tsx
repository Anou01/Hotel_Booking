import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PublicRoute: React.FC = () => {
  const token = localStorage.getItem('token'); // ตรวจสอบ Token

  // ถ้ามี Token → เปลี่ยนเส้นทางไปหน้า Dashboard
  return !token ? <Outlet /> : <Navigate to="/dashboard" replace />;
};

export default PublicRoute;
