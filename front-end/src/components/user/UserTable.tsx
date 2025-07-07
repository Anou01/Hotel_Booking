import React from "react";
import { User } from "../../types/user";
import { Button, Image, Space, Table } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

interface UserTableProps {
  users: User[];
  loading: boolean;
  pagination: any;
  showModal: (user: User) => void;
  handleDelete: (userId: string) => void;
  handleTableChange: (pagination: any) => void;
}

const UserTable: React.FC<UserTableProps> = ({
  users,
  showModal,
  handleDelete,
  loading,
  handleTableChange,
  pagination,
}) => {
  // คำนวณลำดับ (row index) โดยคำนึงถึง Pagination
  const getRowIndex = (index: number) => {
    if (!pagination || !pagination.current || !pagination.pageSize)
      return index + 1;
    return (pagination.current - 1) * pagination.pageSize + index + 1;
  };
  const columns = [
    {
      title: "ລຳດັບ", // เปลี่ยน "ລດ" เป็น "ລຳດັບ" เพื่อชัดเจนว่าเป็นลำดับ
      dataIndex: "index", // ใช้ dataIndex ใหม่สำหรับลำดับ
      key: "index",
      render: (_: any, __: User, index: number) => getRowIndex(index), // แสดงลำดับตาม Pagination
      width: 60, // กำหนดความกว้างเพื่อให้ดูเรียบร้อย
    },
    {
      title: "ຮູບພາບ", // คอลัมน์ใหม่สำหรับแสดงรูป
      dataIndex: "profileImage",
      key: "profileImage",
      render: (profileImage: string) => (
        <Image
          src={profileImage ? `http://localhost:5000${profileImage}` : '/vite.svg'} // ใช้ URL จาก backend
          alt="Profile"
          style={{ width: 50, height: 50, borderRadius: "50%", objectFit: "cover" }} // รูปวงกลมทันสมัย
          onError={(e) => {
            console.error("Image failed to load:", profileImage, e);
            (e.target as HTMLImageElement).src = "/default-avatar.png"; // รูป default ถ้าโหลดล้มเหลว
          }}
        />
      ),
      width: 80, // กำหนดความกว้างเพื่อไม่ให้ตารางรบกวน
    },
    { title: "ຊື່ ແລະ ນາມສະກຸນ", dataIndex: "name", key: "name" },
    { title: "ຊື່ໃຊ້ໃນລະບົບ", dataIndex: "username", key: "username" },
    { title: "ສິດ", dataIndex: "role", key: "role" },
    {
      title: "ຈັດການ",
      key: "action",
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => showModal(record)}>
            ແກ້ໄຂ
          </Button>
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDelete(record.id)}
          >
            ລຶບ
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Table
      loading={loading}
      dataSource={users.map((u, i) => ({ ...u, key: i + 1 }))}
      columns={columns}
      rowKey="id"
      pagination={{
        current: pagination?.current,
        pageSize: pagination?.pageSize,
        total: pagination?.total,
        onChange: (page, pageSize) =>
          handleTableChange({
            current: page,
            pageSize,
            total: pagination?.total,
          }),
        onShowSizeChange: (current, size) =>
          handleTableChange({
            current,
            pageSize: size,
            total: pagination?.total,
          }),
      }}
    />
  );
};

export default UserTable;
