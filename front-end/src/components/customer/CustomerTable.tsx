import React from "react";
import { Table } from "antd";
import { Booking } from "../../types/booking";

interface CustomerTableProps {
  bookings: any[];
  loading: boolean;
  onSelect: (booking: Booking) => void;
  pagination: any;
  handleTableChange: (pagination: any) => void;
}

const CustomerTable: React.FC<CustomerTableProps> = ({
  bookings,
  loading,
  onSelect,
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
      render: (_: any, __: any, index: number) => getRowIndex(index), // แสดงลำดับตาม Pagination
      width: 60, // กำหนดความกว้างเพื่อให้ดูเรียบร้อย
    },
    {
      title: "ຊື່ຜູ້ເຂົ້າພັກ",
      dataIndex: "guestName",
      key: "guestName",
    },
    {
      title: "ເບີໂທ",
      dataIndex: "guestPhone",
      key: "guestPhone",
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
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "ວັນທີ່ເຊັກເອົາ",
      dataIndex: "checkOutDate",
      key: "checkOutDate",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "ສະຖານະ",
      dataIndex: "status",
      key: "status",
      render: (status: string) =>
        status === "booked"
          ? "ຖືກຈອງ"
          : status === "checked-in"
          ? "ກຳລັງເຊັກອິນ"
          : "ເຊັກເອົາແລ້ວ",
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={bookings}
      rowKey="id"
      loading={loading}
      onRow={(record) => ({
        onClick: () => onSelect(record),
      })}
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
      bordered
      scroll={{ x: "max-content" }}
    />
  );
};

export default CustomerTable;
