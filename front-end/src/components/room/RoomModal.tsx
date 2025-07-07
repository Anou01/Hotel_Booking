import { Form, Input, InputNumber, Modal, Select } from "antd";
import React from "react";
import { Room } from "../../types/room";

const { Option } = Select;

interface RoomModalProps {
    isModalVisible: boolean;
    editingRoom: Room | null;
    handleCancel: () => void;
    form:any;
    amenities: any[];
    handleOk: () => void;

}

const RoomModal: React.FC<RoomModalProps>= ({
    isModalVisible,
    editingRoom,
    handleCancel,
    form,
    amenities,
    handleOk
}) => {
  return (
    <Modal
      title={editingRoom ? "ແກ້ໄຂຫ້ອງ" : "ເພີ່ມຫ້ອງ"}
      open={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="ບັນທຶກ"
      cancelText="ຍົກເລິກ"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="roomNumber"
          label="ເບີຫ້ອງ"
          rules={[{ required: true, message: "ກະລຸນາປ້ອນເບີຫ້ອງ!" }]}
        >
          <Input disabled={!!editingRoom} />
        </Form.Item>
        <Form.Item
          name="airConditioning"
          label="ເລືອກປະເພດຫ້ອງ"
          rules={[{ required: true, message: "ກະລຸນາເລືອກປະເພດຫ້ອງ!" }]}
        >
          <Select placeholder="ເລືອກປະເພດຫ້ອງ">
            <Option value="Air">แอร์</Option>
            <Option value="Fan">พัดลม</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="type"
          label="ປະເພດຕຽງ"
          rules={[{ required: true, message: "ກະລຸນາເລືອກປະເພດຕຽງ!" }]}
        >
          <Select placeholder="ເລືອກປະເພດຕຽງ">
            <Option value="Single">ຕຽງດ່ຽວ</Option>
            <Option value="Double">ຕຽງຄູ່</Option>
            <Option value="Suite">ຫ້ອງລວມ</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="price"
          label="ລາຄາ (ກີບ/ຄືນ)"
          rules={[{ required: true, message: "ກະລຸນາປ້ອນລາຄາ!" }]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          name="status"
          label="ສະຖານະ"
          rules={[{ required: true, message: "ເລືອກສະຖານະ!" }]}
        >
          <Select placeholder="ເລືອກສະຖານະ">
            <Option value="available">ວ່າງ</Option>
            <Option value="booked">ຖືກຈອງ</Option>
            <Option value="maintenance">ບຳລຸງຮັກສາ</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="amenities"
          label="ສິ່ງອຳນວນຄວາມສະດວກ"
          rules={[{ required: false }]}
        >
          <Select mode="multiple" placeholder="ເລືອກສິ່ງອຳນວຍຄວາມສະດວກ">
            {amenities.map((amenity: any) => (
              <Option key={amenity.id} value={amenity.id}>
                {amenity.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RoomModal;
