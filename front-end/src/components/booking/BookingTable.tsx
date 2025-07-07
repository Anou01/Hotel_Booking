import React from "react";
import { Table, Space, Button } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Booking, Room } from "../../types/booking";

interface BookingTableProps {
  bookings: Booking[];
  rooms: Room[];
  onEdit: (booking: Booking) => void;
  onDelete: (bookingId: string) => void;
}

const BookingTable: React.FC<BookingTableProps> = ({ bookings, rooms, onEdit, onDelete }) => {
  const columns = [
    { title: "หมายเลขจอง", dataIndex: "key", key: "key" },
    {
      title: "ห้อง",
      dataIndex: "roomId",
      key: "roomId",
      render: (roomId: string) => rooms.find((r) => r._id === roomId)?.name || "ไม่พบ",
    },
    {
      title: "วันที่เช็คอิน",
      dataIndex: "checkInDate",
      key: "checkInDate",
      render: (date: Date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "วันที่เช็คเอาท์",
      dataIndex: "checkOutDate",
      key: "checkOutDate",
      render: (date: Date) => new Date(date).toLocaleDateString(),
    },
    { title: "สถานะ", dataIndex: "status", key: "status" },
    {
      title: "การจัดการ",
      key: "action",
      render: (_:any, record: any) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => onEdit(record)}>
            แก้ไข
          </Button>
          <Button icon={<DeleteOutlined />} danger onClick={() => onDelete(record?.id)}>
            ลบ
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Table
      dataSource={bookings.map((b, i) => ({ ...b, key: i + 1 }))}
      columns={columns}
      pagination={{ pageSize: 5 }}
    />
  );
};

export default BookingTable;