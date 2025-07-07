import React, { useState } from "react";
import { Col } from "antd";
import styled from "styled-components";
import { Room } from "../../types/room";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ToolOutlined,
} from "@ant-design/icons";

const StatusIcon = ({ status }: { status: string }) => {
  switch (status) {
    case "available":
      return <CheckCircleOutlined style={{ color: "#52c41a", marginRight: 8 }} />;
    case "booked":
      return <CloseCircleOutlined style={{ color: "#f5222d", marginRight: 8 }} />;
    case "maintenance":
      return <ToolOutlined style={{ color: "#fa8c16", marginRight: 8 }} />;
    default:
      return null;
  }
};

// ฟังก์ชันกำหนดสีพื้นหลังตามสถานะ
const getBackgroundColor = (status: string) => {
  switch (status) {
    case "available":
      return "#e6ffe6"; // เขียวอ่อน
    case "booked":
      return "#ffe6e6"; // แดงอ่อน
    case "maintenance":
      return "#fff3e6"; // ส้มอ่อน
    default:
      return "#fff"; // ขาว
  }
};

// ปรับ RoomCard ให้รับ prop isActive
const RoomCard = styled.div<{ status: string; isActive: boolean }>`
  min-height: 120px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease, border 0.3s ease;
  background-color: ${(props) => getBackgroundColor(props.status)};
  padding: 16px;
  animation: fadeIn 0.5s ease;
  border: ${(props) => (props.isActive ? "2px solid #1890ff" : "2px solid transparent")}; /* ขอบเมื่อ active */

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  }

  &:active {
    transform: scale(1);
  }

  /* สไตล์เพิ่มเติมเมื่อ active */
  ${(props) =>
    props.isActive &&
    `
    box-shadow: 0 0 15px rgba(24, 144, 255, 0.5);
    transform: scale(1.02); /* ขยายเล็กน้อยเมื่อ active */
  `}
`;

const CardContent = styled.div`
  text-align: center;
  width: 100%;
`;

const RoomNumber = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: #333;
`;

const RoomType = styled.div`
  font-size: 14px;
  color: #888;
  margin-top: 4px;
`;

const RoomPrice = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: #1890ff;
  margin-top: 4px;
`;

interface RoomListProps {
  rooms: Room[];
  onRoomClick: (room: Room) => void;
}

const RoomList: React.FC<RoomListProps> = ({ rooms, onRoomClick }) => {
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null); // State เพื่อเก็บห้องที่ active

  const handleCardClick = (room: any) => {
    setActiveRoomId(room?.id); // ตั้งค่าห้องที่ถูกคลิกเป็น active
    onRoomClick(room); // ส่งข้อมูลห้องไปยัง parent
  };

  return (
    <>
      {rooms?.map((room) => (
        <Col
          key={room?.id}
          xs={24}
          sm={12}
          md={8}
          lg={6}
          xl={4}
        >
          <RoomCard
            status={room.status}
            isActive={room.id === activeRoomId} // ตรวจสอบว่าการ์ดนี้ active หรือไม่
            onClick={() => handleCardClick(room)}
          >
            <CardContent>
              <div style={{ display: "flex", alignItems: "center" }}>
                <StatusIcon status={room.status} />
                <RoomNumber>{room?.roomNumber || "N/A"}</RoomNumber>
              </div>
              <RoomType>{room?.type || "ไม่ระบุ"}</RoomType>
              <RoomPrice>
                {room?.price ? `${room.price.toLocaleString()} ກີບ` : "ไม่ระบุ"}
              </RoomPrice>
            </CardContent>
          </RoomCard>
        </Col>
      ))}
    </>
  );
};

export default RoomList;