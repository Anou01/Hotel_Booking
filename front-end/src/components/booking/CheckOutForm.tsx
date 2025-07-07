import React, { useState } from "react";
import { Form, Input, Button, Row, Col, Typography } from "antd";
import styled from "styled-components";
import { Booking } from "../../types/booking"; // สมมติมี type Booking
import { LogoutOutlined } from "@ant-design/icons";
import { useCustomNotification } from "../../utils/notificationUtils"; // ใช้ notification เดียวกับ BookingForm
import api from "../../services/api";

const { Title } = Typography;

const FormContainer = styled.div`
  background-color: #fff;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  max-width: 600px;
  margin: 0 auto;
`;

const FormTitle = styled(Title)`
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-bottom: 24px;
  text-align: center;
`;

const CheckOutButton = styled(Button)`
  background-color: #fa8c16; /* ส้มสำหรับ Check Out */
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  height: auto;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    background-color: #ff9c33;
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

const CancelButton = styled(Button)`
  border-radius: 6px;
  padding: 8px 16px;
  height: auto;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    border-color: #ff4d4f;
    color: #ff4d4f;
  }
`;

interface CheckOutFormProps {
  booking: any | null;
  onFinish: (values: any) => void;
  onCancel: () => void;
  handleCancel:() => void;
}

const CheckOutForm: React.FC<CheckOutFormProps> = ({ booking, onCancel,handleCancel }) => {
  const [form] = Form.useForm();
  const { openNotification,contextHolder } = useCustomNotification();
  const [loading, setLoading] = useState(false);

  const handleCheckOut = async () => {
    setLoading(true);
    try {
      if (!booking?.id) {
        throw new Error("ບໍ່ເຫັນຂໍ້ມູນການຈອງ");
      }

      await api.post(`/bookings/${booking.id}/checkout`);
      openNotification("success", {
        message: "ເຊັກເອົ້າສຳເລັດ",
        description: "ຂໍ້ມູນການເຊັກເອົາໄດ້ຮັບການບັນທຶກແລ້ວ",
      });
      handleCancel();
    } catch (err:any) {
      let errorMessage = "ເກີດຂໍ້ຜິດພາດໃນການເຊັກເອົ້າ";
      let errorDescription = "ກະລຸນາລອງໃໝ່ອີກຄັ້ງ";

      if (err.response) {
        const { status, data } = err.response;
        switch (status) {
          case 400:
            errorMessage = data.message || "ຂໍ້ມູນບໍ່ຖືກຕ້ອງ";
            errorDescription = "ກະລຸນາກວດສອບຂໍ້ມູນການຈອງ";
            break;
          case 404:
            errorMessage = "ບໍ່ເຫັນຂໍ້ມູນການຈອງ";
            errorDescription = "ການຈອງນີ້ອາດຖືກລຶບໄປແລ້ວ";
            break;
          case 500:
            errorMessage = "ຂໍ້ຜິດພາດຈາກ server";
            errorDescription = "ກະລຸນາຕິດຕໍ່ຜູ້ດູແລລະບົບ";
            break;
          default:
            errorMessage = "ເກີດຂໍ້ຜິດພາດທີ່ບໍ່ຮູ້ສາເຫດ";
            break;
        }
      } else if (err.request) {
        errorMessage = "ບໍ່ສາມາດເຊື່ອມຕໍ່ server";
        errorDescription = "ກະລຸນາກວດສອບການເຊື່ອມຕໍ່ອິນເຕີເນັດ";
      } else {
        errorMessage = err.message;
      }

      openNotification("error", {
        message: errorMessage,
        description: errorDescription,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!booking) {
    return <FormContainer>กรุณาเลือกการจองเพื่อเช็คเอาท์</FormContainer>;
  }

  return (
    <FormContainer>
      <FormTitle level={4}>ແບບຟອມເຊັກເອົ้າ</FormTitle>
      <Form form={form} layout="vertical" disabled={loading}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Form.Item label="ເບີຫ້ອງ">
              <Input value={booking.roomId?.roomNumber} disabled style={{ borderRadius: "4px", color: "#1890ff" }} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item label="ຊື່ຜູ້ເຂົ້າພັກ">
              <Input value={booking.guestName} disabled style={{ borderRadius: "4px" }} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item label="ເບີໂທຜູ້ເຂົ້າພັກ">
              <Input value={booking.guestPhone} disabled style={{ borderRadius: "4px" }} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item label="ວັນທີ່ເຊັກອິນ">
              <Input
                value={new Date(booking.checkInDate).toLocaleDateString()}
                disabled
                style={{ borderRadius: "4px" }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item label="ວັນທີ່ເຊັກເອົາ">
              <Input
                value={new Date(booking.checkOutDate).toLocaleDateString()}
                disabled
                style={{ borderRadius: "4px" }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item label="ຍອດທັງໝົດ (ກີບ)">
              <Input value={booking.finalAmount.toLocaleString()} disabled style={{ borderRadius: "4px" }} />
            </Form.Item>
          </Col>
        </Row>

        <div style={{ textAlign: "right", marginTop: 24 }}>
          <CancelButton onClick={onCancel} style={{ marginRight: 12 }} disabled={loading}>
            ຍົກເລີກ
          </CancelButton>
          <CheckOutButton type="primary" onClick={handleCheckOut} loading={loading}>
            <LogoutOutlined style={{ marginRight: 8 }} /> ເຊັກເອົາ
          </CheckOutButton>
        </div>
      </Form>
      {contextHolder}
    </FormContainer>
  );
};

export default CheckOutForm;