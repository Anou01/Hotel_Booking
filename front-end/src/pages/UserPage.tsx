import React, { useState, useEffect } from "react";
import { Button, Form, message, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { User, UserFilters } from "../types/user"; // Import interface
import api from "../services/api";
import { useDebounce } from "use-debounce";
import UserTable from "../components/user/UserTable";
import UserModal from "../components/user/UserModal";
import UserFilter from "../components/user/UserFilter";
import { Pagination } from "../types";
import { useCustomNotification } from "../utils/notificationUtils";

const { Title } = Typography;

const UserPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form] = Form.useForm();
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<UserFilters>({ role: "", name: "" }); // State เดียวสำหรับตัวกรอง
  const { openNotification, contextHolder } = useCustomNotification();
  // ใช้ useDebounce สำหรับ filters
  const [debouncedFilters] = useDebounce<UserFilters>(filters, 500); // กำหนดประเภทเป็น Filters

  const [pagination, setPagination] = useState<Pagination | null>({
    current: 1,
    pageSize: 10,
    total: 0,
    pages: 1,
  });

  // ดึงข้อมูลผู้ใช้งานจาก API ด้วยตัวกรองและ Pagination
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true); // เริ่มโหลด
      setError(null);
      try {
        const query = new URLSearchParams({
          role: debouncedFilters.role,
          name: debouncedFilters.name,
          page: pagination?.current?.toString() || "1", // ใช้ optional chaining
          limit: pagination?.pageSize?.toString() || "10", // ใช้ optional chaining
        });

        const response = await api.get<{
          data: User[];
          pagination: Pagination;
        }>(`/users?${query.toString()}`);

        // แปลง createdAt และ updatedAt เป็น Date ถ้าส่งเป็น string
        const formattedUsers = (response.data.data || []).map((user) => ({
          ...user,
          createdAt: user.createdAt ? new Date(user.createdAt) : undefined,
          updatedAt: user.updatedAt ? new Date(user.updatedAt) : undefined,
        }));

        setUsers(formattedUsers);
        setPagination(response.data.pagination); // อัปเดต Pagination จาก response
      } catch (err) {
        setError("ບໍ່ສາມາດດຶງຂໍ້ມູນພະນັກงານໄດ້");
      } finally {
        setLoading(false); // สิ้นสุดโหลด (ทั้งสำเร็จและล้มเหลว)
      }
    };
    fetchUsers();
  }, [
    debouncedFilters.role,
    debouncedFilters.name,
    pagination?.current,
    pagination?.pageSize,
  ]);

  // ฟังก์ชันอัปเดตตัวกรอง
  const handleFilterChange = (key: keyof UserFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // ฟังก์ชันจัดการ Pagination
  const handleTableChange = (pagination: any) => {
    setPagination({
      current: pagination.current,
      pageSize: pagination.pageSize,
      total: pagination.total,
      pages: Math.ceil(pagination.total / pagination.pageSize),
    });
  };

  // ฟังก์ชันเพิ่ม/แก้ไขผู้ใช้งาน
  const showModal = (user?: User) => {
    setEditingUser(user || null);
    if (user) {
      form.setFieldsValue({
        name: user.name,
        username: user.username,
        role: user.role,
        password: "", // ไม่แสดง password จริง, ใช้สำหรับเปลี่ยนรหัสผ่าน
      });
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleOk = async (data:any) => {
    try {
      const values = await form.validateFields();
      const newUser: User = {
        name: values.name,
        profileImage: data?.profileImage || "",
        username: values.username,
        password: values.password || editingUser?.password || "", // ส่งรหัสผ่านใหม่หรือใช้เดิม
        role: values.role,
      };

      if (editingUser) {
        await api.put(`/users/${editingUser.id}`, newUser);

        setUsers(
          users.map((u) =>
            u.id === editingUser.id
              ? { ...newUser, createdAt: u.createdAt, updatedAt: new Date(),id:u.id }
              : u
          )
        ); // รักษา createdAt และเพิ่ม updatedAt
        setEditingUser(null);
        openNotification("success", {
          message: "ແກ້ໄຂຂໍ້ມູນສຳເລັດ",
          description: "ຂໍ້ມູນໄດ້ຮັບການແກ້ໄຂແລ້ວ",
        });
      } else {
        const response = await api.post<{
          data: User & { createdAt: string; updatedAt: string };
        }>("/users", newUser);
        const createdUser = response.data.data;
        setUsers([
          {
            ...createdUser,
            createdAt: new Date(createdUser.createdAt),
            updatedAt: new Date(createdUser.updatedAt),
          },
          ...users,
        ]); // ปรับตามโครงสร้าง response
        openNotification("success", {
          message: "ເພີ່ມຂໍ້ມູສຳເລັດ",
          description: "ຂໍ້ມູນໄດ້ຮັບການບັນທຶກແລ້ວ",
        });
      }
      setIsModalVisible(false);
      form.resetFields();
    } catch (err) {
      setError(
        "ພົບຂໍ້ຜິດພາດໃນການບັນທຶກພະນັກງານ: " +
          (err instanceof Error ? err.message : "Unknown error")
      );
      message.error("ພົບຂໍ້ຜິດພາດ");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleDelete = async (userId: string) => {
    try {
      // ตรวจสอบว่าไม่ใช่ admin เดียวในระบบ
      const adminCount = users.filter((u) => u.role === "admin").length;
      const userToDelete = users.find((u) => u.id === userId);
      if (userToDelete?.role === "admin" && adminCount <= 1) {
        setError("ບໍ່ສາມາດລຶບ admin ດຽວໃນລະບົບໄด້");
        message.error("ບໍ່ສາມາດລຶບ admin ດຽວໃນລະບົບໄດ้");
        return;
      }
      await api.delete(`/users/${userId}`);
      setUsers(users.filter((u) => u.id !== userId));
      message.success("ລຶບພະນັກງານສຳເລັດ");
    } catch (err) {
      setError("ບໍ່ສາມາດລົບພະນັກງານໄດ້");
      message.error("ບໍ່ສາມາດລົບພະນັກງານໄດ້");
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        background: "#fff",
        minHeight: "calc(100vh - 64px)",
      }}
    >
      <Title level={3}>ຈັດການພະນັກງານ</Title> {/* ใช้ Typography.Title */}
      
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <UserFilter filters={filters} handleFilterChange={handleFilterChange} />

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => showModal()}
          disabled={loading}
        >
          ເພີ່ມພະນັກງານ
        </Button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <UserTable
        users={users}
        handleDelete={handleDelete}
        showModal={showModal}
        loading={loading}
        handleTableChange={handleTableChange}
        pagination={pagination}
      />
      <UserModal
        isModalVisible={isModalVisible}
        editingUser={editingUser ?? null}
        handleOk={handleOk}
        handleCancel={handleCancel}
        form={form}
      />
      {contextHolder}
    </div>
  );
};

export default UserPage;
