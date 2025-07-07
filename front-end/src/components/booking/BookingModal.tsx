import React from "react";
import { Modal } from "antd";
import BookingForm from "./BookingForm";
import { Room } from "../../types/booking";

interface BookingModalProps {
  visible: boolean;
  onOk: (values: any) => void; // รับ values และส่งไปยัง BookingPage
  onCancel: () => void;
  rooms: Room[];
  initialValues?: any;
}

const BookingModal: React.FC<BookingModalProps> = ({ visible, onOk, onCancel, rooms, initialValues }) => {
  const handleFinish = (values: any) => {
    console.log("Modal values in BookingModal:", values); // Debug: ตรวจสอบ values
    onOk(values); // ส่ง values กลับไปยัง BookingPage
  };

  return (
    <Modal
      title={initialValues ? "แก้ไขการจอง" : "เพิ่มการจอง"}
      open={visible}
      onOk={() => {}} // ไม่ต้องใช้ onOk ของ Modal เพราะ Form จะจัดการ
      onCancel={onCancel}
      okText="บันทึก"
      cancelText="ยกเลิก"
      footer={null} // ลบ footer เดิมของ Modal
    >
      <BookingForm
        rooms={rooms}
        onFinish={handleFinish}
        onCancel={onCancel}
        initialValues={initialValues}
      />
    </Modal>
  );
};

export default BookingModal;