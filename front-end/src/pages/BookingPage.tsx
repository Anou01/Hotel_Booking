import React, { useState, useEffect } from "react";
import { Alert, Col, Form, Row, Select } from "antd";
import { Room, RoomFilters } from "../types/room";
import RoomList from "../components/booking/RoomList";
import RoomDetail from "../components/booking/RoomDetail";
import BookingForm from "../components/booking/BookingForm";
import api from "../services/api";
import { useCustomNotification } from "../utils/notificationUtils";
import styled from "styled-components";
import CheckOutForm from "../components/booking/CheckOutForm";

const { Option } = Select;

const FilterContainer = styled.div`
  margin-bottom: 20px;
`;

const BookingPage: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [room, setRoom] = useState<Room | null>(null);
  const [bookingStatus, setBookingStatus] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const { openNotification, contextHolder } = useCustomNotification();
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [filters, setFilters] = useState<{
    type: string;
    airConditioning: string;
  }>({
    type: "",
    airConditioning: "",
  }); // State เดียวสำหรับตัวกรอง

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const query = new URLSearchParams({
          type: filters?.type,
          airConditioning: filters?.airConditioning,
        });

        const response = await api.get<{ data: Room[] }>(
          `/rooms?${query.toString()}`
        );
        setRooms(response?.data?.data || []);
      } catch (err) {
        setError("ไม่สามารถดึงข้อมูลห้องได้");
      }
    };
    fetchRooms();
  }, [filters.type, filters.airConditioning]);

  const handleOk = async (values: any) => {
    try {
      const newBooking = {
        roomId: values.roomId,
        guestName: values.guestName,
        guestPhone: values.guestPhone,
        checkInDate: values.checkInDate,
        checkOutDate: values.checkOutDate,
        discount: values.discount || 0,
        totalAmount: values.totalAmount,
        paymentAmount: values.paymentAmount,
        changeAmount: values.changeAmount,
        isAdvanceBooking: values.isAdvanceBooking || false,
      };

      const response = await api.post("/bookings", newBooking);
      const bookingStatus = response.data.booking.status;

      openNotification("success", {
        message: bookingStatus === "booked" ? "ຈອງຫ້ອງສຳເລັດ" : "ເຊັກອິນສຳເລັດ",
        description: "ຂໍ້ມູນໄດ້ຮັບການບັນທຶກແລ້ວ",
      });

      setRoom(null);
      setBookingStatus("");

      const roomResponse = await api.get<{ data: Room[] }>("/rooms");
      setRooms(roomResponse?.data?.data || []);
    } catch (err: any) {
      let errorMessage = "ເກີດຂໍ້ຜິດພາດໃນການບັນທຶກການຈອງ ຫຼື ເຊັກອິນ";
      let errorDescription = "ກະລຸນາລອງໃໝ່ອີກຄັ້ງ";

      if (err.response) {
        const { status, data } = err.response;
        switch (status) {
          case 400:
            errorMessage = data.message || "ຂໍ້ມູນບໍ່ຖືກຕ້ອງ";
            errorDescription = data.conflictingBooking
              ? `ຊວງວັນທີ ${new Date(
                  data.conflictingBooking.checkInDate
                ).toLocaleDateString()} - ${new Date(
                  data.conflictingBooking.checkOutDate
                ).toLocaleDateString()} ຖືກຈອງແລ້ວ`
              : "ກະລຸນາກວດສອບຂໍ້ມູນທີ່ປ້ອນ";
            break;
          case 404:
            errorMessage = "ບໍ່ເຫັນຫ້ອງນີ້";
            errorDescription = "ຫ້ອງທີ່ເລືອກອາດຖືກລຶບ ຫຼື ບໍ່ມີໃນລະບົບ";
            break;
          case 500:
            errorMessage = "ຂໍ້ມູນຜິດພາດຈາກ server";
            errorDescription = "ກະລຸນາຕິດຕໍ່ຜູ້ດູແລລະບົບ";
            break;
          default:
            errorMessage = "ເກີດຂໍ້ຜິດພາດທີ່ບໍ່ຮູ້ສາເຫດ";
            break;
        }
      } else if (err.request) {
        errorMessage = "ບໍ່ສາມາດເຊື່ອມຕໍ່ກັບ server";
        errorDescription = "ກະລຸນາກວດສອບການເຊື່ອມຕໍ່ອິນເຕີເນັດ";
      }

      openNotification("error", {
        message: errorMessage,
        description: errorDescription,
      });

      setError(errorMessage);
      console.error("Error in handleOk:", err);
    }
  };

  const handleCancel = () => {
    setRoom(null);
    setBookingStatus("");
  };

  const onRoomClick = (selectedRoom: Room) => {
    setRoom(selectedRoom);
  };

  const handleCheckStatus = async (status: string) => {
    setBookingStatus(status);

    if (status === "checked-out") {
      if (!room) {
        openNotification("warning", {
          message: "ບໍ່ມີຂໍ້ມູນຫ້ອງ",
          description: "ກະລຸນາເລືອກຫ້ອງທີ່ຕ້ອງການເຊັກເອົ້າ",
        });
        return;
      }
      const bookResponse = await api.get("/bookings/get-booking/" + room?.id);
      setBookingDetails(bookResponse?.data);
    }
  };

  // ฟังก์ชันอัปเดตตัวกรอง
  const handleFilterChange = (key: keyof RoomFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };


  return (
    <div style={{ padding: "20px", minHeight: "calc(100vh - 64px)" }}>
      <Row gutter={10}>
        <Col span={17}>
          {error && <Alert message={error} type="warning" showIcon closable style={{margin: '10px 0px'}} />}
          
          <Row gutter={[10, 10]}>
            {!bookingStatus && (
              <RoomList rooms={rooms} onRoomClick={onRoomClick} />
            )}
            {(bookingStatus === "booked" || bookingStatus === "checkIn") && (
              <BookingForm
                room={room}
                onFinish={handleOk}
                onCancel={handleCancel}
                bookingStatus={bookingStatus}
              />
            )}

            {bookingStatus === "checked-out" && (
              <CheckOutForm
                booking={bookingDetails}
                onFinish={handleOk}
                onCancel={handleCancel}
                handleCancel={handleCancel}
              />
            )}
          </Row>
        </Col>
        <Col span={7}>
          {/* ส่วนฟิลเตอร์ */}
          <FilterContainer>
            <Row gutter={5}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="ປະເພດຕຽງ"
                  layout="vertical"
                  style={{ margin: 0 }}
                >
                  <Select
                    placeholder="ເລືອກປະເພດຫ້ອງ"
                    style={{ width: "100%", borderRadius: "4px" }}
                    value={filters.type}
                    onChange={(value) =>
                      handleFilterChange("type", value || "")
                    }
                    allowClear
                  >
                    <Option value="">ສະແດງທັງໝົດ</Option>
                    <Option value="Single">ຕຽງດ່ຽວ</Option>
                    <Option value="Double">ຕຽງຄູ່</Option>
                    <Option value="Suite">ຫ້ອງລວມ</Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item
                  label="ປະເພດຫ້ອງ"
                  layout="vertical"
                  style={{ margin: 0 }}
                >
                  <Select
                    placeholder="ເລືອກປະເພດເຄື່ອງປັບອາກາດ"
                    style={{ width: "100%", borderRadius: "4px" }}
                    value={filters.airConditioning}
                    onChange={(value) =>
                      handleFilterChange("airConditioning", value || "")
                    }
                    allowClear
                  >
                    <Option value="">ສະແດງທັງໝົດ</Option>
                    <Option value="Air">แอร์</Option>
                    <Option value="Fan">พัดลม</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </FilterContainer>
          <RoomDetail room={room} handleCheckStatus={handleCheckStatus} />
        </Col>
      </Row>
      {contextHolder}
    </div>
  );
};

export default BookingPage;
