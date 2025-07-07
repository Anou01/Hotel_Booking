import React, { useState } from "react";
import { Button, Form, Input, Typography, message } from "antd";
import { useNavigate } from "react-router-dom";
import { LoginResponse } from "../types/auth"; // Import interfaces
import api from "../services/api";

const { Title } = Typography;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true);
    setError(null);
    try {

      const response = await api.post<LoginResponse>("/users/login", {
        username: values.username,
        password: values.password,
      });

      // บันทึก token และข้อมูลผู้ใช้
      const { token, user } = response.data;
      localStorage.setItem("token", token); // บันทึก token ใน localStorage
      localStorage.setItem("user", JSON.stringify(user)); // บันทึกข้อมูลผู้ใช้

      message.success("ເຂົ້າລະບົບສຳເລັດ");
      navigate("/dashboard"); // นำทางไปยังหน้า Dashboard หรือหน้าแรกหลังล็อกอิน
    } catch (err: any) {
      setError(
        err.response?.data?.message || "ເກີດຂໍ້ຜິດພາດ ກະລຸນາລອງໃໝ່"
      );
      message.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "#f0f2f5",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 400,
          padding: 24,
          background: "#fff",
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
        }}
      >
        <Title level={2} style={{ textAlign: "center", marginBottom: 24 }}>
          ເຂົ້າສູ່ລະບົບ
        </Title>
        <Form
          name="login"
          onFinish={onFinish}
          layout="vertical"
          initialValues={{ username: "", password: "" }}
        >
          <Form.Item
            name="username"
            label="ຊື່ຜູ້ໃຊ້ງານ"
            rules={[{ required: true, message: "ກະລຸນາປ້ອນຊື່ຜູ້ໃຊ້ງານ!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="ລະຫັດຜ່ານ"
            rules={[{ required: true, message: "ກະລຸນາປ້ອນລະຫັດຜ່ານ!" }]}
          >
            <Input.Password />
          </Form.Item>
          {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              style={{ marginTop: 16 }}
            >
              ເຂົ້າລະບົບ
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;