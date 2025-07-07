import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Space, Table } from "antd";
import React from "react";
import { Room } from "../../types/room";

interface RoomTableProps {
  rooms: any[];
  loading: boolean;
  pagination: any;
  showModal: (room: any) => void;
  handleDelete: (roomId: string) => void;
  handleTableChange: (pagination: any) => void;
}

const RoomTable: React.FC<RoomTableProps> = ({
  rooms,
  showModal,
  handleDelete,
  loading,
  pagination,
  handleTableChange,
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
      render: (_: any, __: Room, index: number) => getRowIndex(index), // แสดงลำดับตาม Pagination
      width: 60, // กำหนดความกว้างเพื่อให้ดูเรียบร้อย
    },
    { title: "ເບີເຫ້ອງ", dataIndex: "roomNumber", key: "roomNumber" },
    { title: "ປະເພດຫ້ອງ", dataIndex: "type", key: "type" },
    { title: "ລາຄາ (ກີບ/ຄືນ)", dataIndex: "price", key: "price" },
    { title: "ສະຖານະ", dataIndex: "status", key: "status" },
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
      dataSource={rooms.map((r, i) => ({ ...r, key: i + 1 }))}
      columns={columns}
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

export default RoomTable;
