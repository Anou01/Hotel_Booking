import React from "react";
import styled from "styled-components";
import { Divider, Flex, Space } from "antd";
import { Room } from "../../types/room";
import { CheckButton } from "../../assets/style";



const CardDetail = styled.div`
  background-color: #fff;
  border-radius: 5px;
  min-height: calc(80vh - 40px);
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* เพิ่มเงาให้ดูมีมิติ */
  max-width: 600px; /* จำกัดความกว้างสูงสุด */
  margin: 0 auto; /* จัดกึ่งกลาง */
`;

const DetailTitle = styled.div`
  font-size: 18px; /* เพิ่มขนาดตัวอักษร */
  font-weight: bold;
  color: #333;
  margin-bottom: 16px; /* ระยะห่างด้านล่าง */
`;

const DetailContent = styled.div`
  font-size: 14px;
  color: gray;
  text-align: center;
`;

const RoomTitle = styled.div`
  font-size: 14px;
  font-weight: 500; /* ใช้ medium weight เพื่อลดความหนัก */
  color: #595959; /* สีเทาเข้มกว่า gray เล็กน้อย */
`;

const RoomData = styled.div`
  font-size: 14px;
  font-weight: bold;
  color: #1890ff; /* สีน้ำเงินของ Ant Design */
`;

const AmenitiesList = styled.ul`
  list-style-type: disc; /* เพิ่มจุดหน้าข้อความ */
  padding-left: 20px;
  margin: 0;
`;

const AmenityItem = styled.li`
  font-size: 14px;
  color: #000;
  line-height: 1.5; /* ระยะห่างระหว่างบรรทัด */
`;



interface RoomDetailsProps {
  room: Room | null;
  handleCheckStatus: (status: string) => void;
}

const RoomDetail: React.FC<RoomDetailsProps> = ({
  room,
  handleCheckStatus,
}) => {


  if (!room) {
    return (
      <CardDetail>
        <DetailTitle>ລາຍລະອຽດຫ້ອງ</DetailTitle>
        <DetailContent>ກະລຸນາເລືອກຫ້ອງເພື່ອສະແດງລາຍລະອຽດ</DetailContent>
      </CardDetail>
    );
  }

  return (
    <CardDetail>
      <Space>
        {room.status === "available" && (
          <>
            <CheckButton
              status={"booked"}
              onClick={() => handleCheckStatus("booked")}
            >
              ຈອງຫ້ອງ
            </CheckButton>
            <CheckButton
              status={"checkIn"}
              onClick={() => handleCheckStatus("checkIn")}
            >
              ເຊັກອິນ
            </CheckButton>
          </>
        )}

        {room.status === "checked-in" && (
          <CheckButton status={"checked-out"} onClick={() => handleCheckStatus("checked-out")}>ເຊັກເອົ້າ</CheckButton>
        )}
      </Space>

      <Divider />

      <DetailTitle>ລາຍລະອຽດຫ້ອງ</DetailTitle>
      <DetailContent>
        <Flex justify="space-between" style={{ marginBottom: 12 }}>
          <RoomTitle>ເບີຫ້ອງ</RoomTitle>
          <RoomData>{room.roomNumber || "N/A"}</RoomData>
        </Flex>
        <Flex justify="space-between" style={{ marginBottom: 12 }}>
          <RoomTitle>ສະຖານະ</RoomTitle>
          <RoomData>
            {room.status
              ? room.status === "available"
                ? "ວ່າງ"
                : room.status === "booked"
                ? "ຖືກຈອງ"
                : room.status === "checked-in"
                ? "ກຳລັງເຊັກອິນ"
                : "ບຳລຸງຮັກສາ"
              : "N/A"}
          </RoomData>
        </Flex>
        <Flex justify="space-between" style={{ marginBottom: 12 }}>
          <RoomTitle>ປະເພດຕຽງ</RoomTitle>
          <RoomData>
            {room.type
              ? room.type === "Single"
                ? "ຕຽງດ່ຽວ"
                : room.type === "Double"
                ? "ຕຽງຄູ່"
                : "ຫ້ອງລວມ"
              : "N/A"}
          </RoomData>
        </Flex>
        <Flex justify="space-between" style={{ marginBottom: 12 }}>
          <RoomTitle>ລາຄາ</RoomTitle>
          <RoomData>
            {room.price ? `${room.price.toLocaleString()} ກີບ/ຄືນ` : "N/A"}
          </RoomData>
        </Flex>
      </DetailContent>

      <DetailTitle>ສິ່ງອຳນວນຄວາມສະດວກ</DetailTitle>
      <DetailContent>
        {room.amenities && room.amenities.length > 0 ? (
          <AmenitiesList>
            {room.amenities.map((amenity: any) => (
              <AmenityItem key={amenity.id}>
                {amenity.name || "N/A"}
              </AmenityItem>
            ))}
          </AmenitiesList>
        ) : (
          "ບໍ່ມີສິ່ງອຳນວຍຄວາມສະດວກ"
        )}
      </DetailContent>
    </CardDetail>
  );
};

export default RoomDetail;
