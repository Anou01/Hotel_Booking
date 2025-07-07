import React from "react";
import { Table } from "antd";

interface DashboardTableProps {
  bookings: any[];
  loading: boolean;
}

const DashboardTable: React.FC<DashboardTableProps> = ({ bookings, loading }) => {
  const columns = [
    {
      title: "ຊື່ຜູ້ເຂົ້າພັກ",
      dataIndex: "guestName",
      key: "guestName",
    },
    {
      title: "ເບີຫ້ອງ",
      dataIndex: ["roomId", "roomNumber"],
      key: "roomNumber",
    },
    {
      title: "ວັນທີ່ເຊັກອິນ",
      dataIndex: "checkInDate",
      key: "checkInDate",
      render: (date: Date) => (date ? date.toLocaleDateString() : "N/A"),
    },
    {
      title: "ສະຖານະ",
      dataIndex: "status",
      key: "status",
      render: (status: string) =>
        status === "booked" ? "ຖືກຈອງ" : status === "checked-in" ? "ກຳລັງເຊັກອິນ" : "ເຊັກເອົາແລ້ວ",
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={bookings.slice(0, 5)} // แสดง 5 รายการล่าสุด
      rowKey="id"
      loading={loading}
      pagination={false}
      bordered
      scroll={{ x: "max-content" }}
    />
  );
};

export default DashboardTable;