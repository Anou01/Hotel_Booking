import React, { useState, useEffect } from "react";
import { Button, Form, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Room, Amenity, RoomFilters } from "../types/room";
import api from "../services/api";
import { useCustomNotification } from "../utils/notificationUtils";
import RoomTable from "../components/room/RoomTable";
import RoomModal from "../components/room/RoomModal";
import RoomFilter from "../components/room/RoomFilter";
import { Pagination } from "../types";

const { Title } = Typography;

const RoomPage: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [form] = Form.useForm();
  const [error, setError] = useState<string | null>(null);
  const { openNotification, contextHolder } = useCustomNotification();
  const [filters, setFilters] = useState<RoomFilters>({
    roomNumber: "",
    type: "",
    airConditioning: "",
    status: "",
  }); // State เดียวสำหรับตัวกรอง
  const [pagination, setPagination] = useState<Pagination | null>({
    current: 1,
    pageSize: 10,
    total: 0,
    pages: 1,
  });

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams({
          roomNumber: filters?.roomNumber,
          type: filters?.type,
          airConditioning: filters?.airConditioning,
          status: filters?.status,
          page: pagination?.current?.toString() || "1", // ใช้ optional chaining
          limit: pagination?.pageSize?.toString() || "10", // ใช้ optional chaining
        });

        const response = await api.get<{
          data: Room[];
          pagination: Pagination;
        }>(`/rooms?${query.toString()}`);

        // แปลง createdAt และ updatedAt เป็น Date ถ้าส่งเป็น string
        const formattedRooms = (response.data.data || []).map((room) => ({
          ...room,
          createdAt: room.createdAt ? new Date(room.createdAt) : undefined,
          updatedAt: room.updatedAt ? new Date(room.updatedAt) : undefined,
        }));

        setRooms(formattedRooms);
        setPagination(response.data.pagination);
      } catch (err) {
        setError("ไม่สามารถดึงข้อมูลห้องได้");
      }finally {
        setLoading(false); // สิ้นสุดโหลด (ทั้งสำเร็จและล้มเหลว)
      }
    };
    fetchRooms();
  }, [
    filters.roomNumber,
    filters.type,
    filters.airConditioning,
    filters.status,
    pagination?.current,
    pagination?.pageSize,
  ]);

  // ฟังก์ชันอัปเดตตัวกรอง
  const handleFilterChange = (key: keyof RoomFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // ฟังก์ชันจัดการ Pagination
  const handleTableChange = (pagination: any) => {
    setPagination({
      current: pagination.current,
      pageSize: pagination.pageSize,
      total: pagination.total,
      pages: Math.ceil(pagination.total / pagination.pageSize),
    });
  };

  const showModal = (room?: Room) => {
    setEditingRoom(room || null);
    if (room) {
      console.log("Editing room:", room);
      form.setFieldsValue({
        roomNumber: room.roomNumber || "",
        airConditioning: room.airConditioning || "",
        type: room.type || "",
        price: room.price || 0,
        status: room.status || "",
        amenities: room.amenities || [],
      });
    } else {
      form.resetFields();
      console.log("Form reset for new room");
    }
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      // ตรวจสอบค่าในฟอร์มก่อน validate
      const currentValues = form.getFieldsValue();
      console.log("Current form values before validation:", currentValues);

      // Validate ฟอร์ม
      const values = await form.validateFields();
      console.log("Validated form values:", values);

      const newRoom: Room = {
        id: editingRoom?.id || "",
        roomNumber: values.roomNumber,
        airConditioning: values.airConditioning,
        amenities: values.amenities || [],
        type: values.type,
        price: values.price,
        status: values.status,
      };

      if (editingRoom?.id) {
        await api.put(`/rooms/${editingRoom.id}`, newRoom);
        setRooms(
          rooms.map((r) => (r.id === editingRoom.id ? { ...r, ...newRoom } : r))
        );
        openNotification("success", {
          message: "ແກ້ໄຂຂໍ້ມູນສຳເລັດ",
          description: "ຂໍ້ມູນໄດ້ຮັບການແກ້ໄຂແລ້ວ",
        });
      } else {
        const response = await api.post("/rooms", newRoom);
        setRooms([...rooms, response.data]);
        openNotification("success", {
          message: "ເພີ່ມຂໍ້ມູສຳເລັດ",
          description: "ຂໍ້ມູນໄດ້ຮັບການບັນທຶກແລ້ວ",
        });
      }
      setIsModalVisible(false);
      form.resetFields();
    } catch (err) {
      console.error("Error in handleOk:", err);
      if (err instanceof Error && "errorFields" in err) {
        console.log("Validation failed with fields:", (err as any).errorFields);
        openNotification("error", {
          message: "ກະລຸນາປ້ອນຂໍ້ມູນໃຫ້ຄົບຖ້ວນ",
          description: "ບາງຟິວຍັງບໍ່ຖືກປ້ອນ ຫຼື ຂໍ້ມູນບໍ່ຖືກຕ້ອງ",
        });
      } else {
        setError(
          "ເກີດຂໍ້ຜິດພາດໃນການເພີ່ມຫ້ອງ: " +
            (err instanceof Error ? err.message : "Unknown error")
        );
        openNotification("error", {
          message: "เกิดข้อผิดพลาด",
          description: "ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่",
        });
      }
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleDelete = async (roomId: string) => {
    try {
      const room = rooms.find((r) => r.id === roomId);
      if (room?.status === "booked") {
        setError("ບໍ່ສາມາລຶບຫ້ອງທີ່ຖືກຈອງໄດ້");
        return;
      }
      await api.delete(`/rooms/${roomId}`);
      setRooms(rooms.filter((r) => r.id !== roomId));
      openNotification("success", {
        message: "ລຶບຫ້ອງສຳເລັດ",
        description: "ຫ້ອງໄດ້ຖືກລຶບອອກຈາກລະບົບແລ້ວ",
      });
    } catch (err) {
      setError("ไม่สามารถลบห้องได้");
      openNotification("error", {
        message: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถลบห้องได้ กรุณาลองใหม่",
      });
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        background: "#fff",
        minHeight: "calc(100vh - 64px)",
      }}
    >
      {contextHolder}
      <Title level={3}>ຈັດການຫ້ອງ</Title>
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <RoomFilter filters={filters} handleFilterChange={handleFilterChange} />

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => showModal()}
        >
          ເພີ່ມຫ້ອງ
        </Button>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <RoomTable
        rooms={rooms}
        showModal={showModal}
        handleDelete={handleDelete}
        loading={loading}
        handleTableChange={handleTableChange}
        pagination={pagination}
      />

      <RoomModal
        isModalVisible={isModalVisible}
        editingRoom={editingRoom || null}
        handleOk={handleOk}
        handleCancel={handleCancel}
        form={form}
        amenities={amenities}
      />
    </div>
  );
};

export default RoomPage;
