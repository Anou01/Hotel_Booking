import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute: React.FC = () => {
  const token = localStorage.getItem('token'); // ตรวจสอบ Token

  // ถ้าไม่มี Token ให้เปลี่ยนเส้นทางไปหน้า Login
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
