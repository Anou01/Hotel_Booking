import React, { useState } from "react";
import styled from "styled-components";
import { Descriptions, Button, Modal, Typography, Flex } from "antd"; // เพิ่ม Modal
import { LoginOutlined } from "@ant-design/icons";
import api from "../../services/api";
import { useCustomNotification } from "../../utils/notificationUtils";

const { Title } = Typography;

const DetailCard = styled.div`
  padding: 16px;
`;

const CheckInButton = styled(Button)`
  background-color: #52c41a;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  height: auto;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    background-color: #73d13d;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }

  &:disabled {
    background-color: #d9d9d9;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

interface CustomerDetailProps {
  booking: any | null;
  onCheckInSuccess?: (updatedBooking: any) => void;
}

const CustomerDetail: React.FC<CustomerDetailProps> = ({
  booking,
  onCheckInSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const { openNotification,contextHolder } = useCustomNotification();

  if (!booking) {
    return <DetailCard>ກະລຸນາເລືອກລູກຄ້າເພື່ອສະແດງລາຍລະອຽດ</DetailCard>;
  }

  const handleCheckIn = async () => {
    Modal.confirm({
      title: "ຢືນຢັນການເຊັກອິນ",
      content: `ທ່ານຕ້ອງການເຊັກອິນໃຫ້ການຈອງຂອງ ${booking.guestName} ຫຼືບໍ່?`,
      okText: "ຢືນຢັນ",
      cancelText: "ຍົກເລີກ",
      onOk: async () => {
        setLoading(true);
        try {
          const response = await api.post(`/bookings/${booking.id}/checkin`);
          const updatedBooking = response.data.booking;

          openNotification("success", {
            message: "ເຊັກອິນສຳເລັດ",
            description: "ຂໍ້ມູນການເຊັກອິນໄດ້ຮັບການບັນທຶກແລ້ວ",
          });

          if (onCheckInSuccess) {
            onCheckInSuccess(updatedBooking);
          }
        } catch (err: any) {
          openNotification("error", {
            message: "ເກີດຂໍ້ຜິດພາດໃນການເຊັກອິນ",
            description: err.response?.data?.message || "ກະລຸນາລອງໃໝ່ອີກຄັ້ງ",
          });
        } finally {
          setLoading(false);
        }
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  return (
    <DetailCard>
      <Flex justify="space-between" align="center">
        <Title level={5}>ລາຍລະອຽດລູກຄ້າ</Title>
        {booking.status === "booked" && (
          <div>
            <CheckInButton
              type="primary"
              onClick={handleCheckIn}
              loading={loading}
              disabled={loading}
            >
              <LoginOutlined style={{ marginRight: 8 }} /> ເຊັກອິນ
            </CheckInButton>
          </div>
        )}
      </Flex>

      <Descriptions bordered column={1}>
        <Descriptions.Item label="ຊື່ຜູ້ເຂົ້າພັກ">
          {booking.guestName}
        </Descriptions.Item>
        <Descriptions.Item label="ເບີໂທ">
          {booking.guestPhone}
        </Descriptions.Item>
        <Descriptions.Item label="ເບີຫ້ອງ">
          {booking.roomId?.roomNumber || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="ວັນທີ່ເຊັກອິນ">
          {booking.checkInDate
            ? new Date(booking.checkInDate).toLocaleDateString()
            : "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="ວັນທີ່ເຊັກເອົາ">
          {booking.checkOutDate
            ? new Date(booking.checkOutDate).toLocaleDateString()
            : "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="ສະຖານະ">
          {booking.status === "booked"
            ? "ຖືກຈອງ"
            : booking.status === "checked-in"
            ? "ກຳລັງເຊັກອິນ"
            : "ເຊັກເອົາແລ້ວ"}
        </Descriptions.Item>
        <Descriptions.Item label="ຍອດທັງໝົດ">
          {booking.finalAmount.toLocaleString()} ກີບ
        </Descriptions.Item>
        <Descriptions.Item label="ສ່ວນຫຼຸດ">
          {booking.discount.toLocaleString()} ກີບ
        </Descriptions.Item>
        <Descriptions.Item label="ເງິນຮັບຈາກລູກຄ້າ">
          {booking.amountReceived.toLocaleString()} ກີບ
        </Descriptions.Item>
        <Descriptions.Item label="ເງິນທອນ">
          {booking.changeAmount.toLocaleString()} ກີບ
        </Descriptions.Item>
      </Descriptions>
      {contextHolder}
    </DetailCard>
  );
};

export default CustomerDetail;
