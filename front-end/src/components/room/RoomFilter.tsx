import { Form, Input, Select, Space } from "antd";
import React from "react";
import { RoomFilters } from "../../types/room";

const { Option } = Select;

interface RoomFilterProps {
  filters: RoomFilters;
  handleFilterChange: (key: keyof RoomFilters, value: string) => void;
}

const RoomFilter: React.FC<RoomFilterProps> = ({
  handleFilterChange,
  filters,
}) => {
  return (
    <Space>
      <Form.Item label="ຄົ້ນຫາ" layout="vertical">
        <Input
          placeholder="ຄົ້ນຫາດ້ວຍຊື່..."
          value={filters.roomNumber}
          onChange={(e) => handleFilterChange("roomNumber", e.target.value)}
          style={{ width: 200 }}
        />
      </Form.Item>

      <Form.Item label="ປະເພດຫ້ອງ" layout="vertical">
        <Select
          placeholder="ປະເພດຫ້ອງ"
          value={filters.airConditioning}
          onChange={(value) =>
            handleFilterChange("airConditioning", value || "")
          }
          allowClear
          style={{ width: 150 }}
        >
          <Option value="">ສະແດງທັງໝົດ</Option>
          <Option value="Air">ຫ້ອງແອ</Option>
          <Option value="Fan">ຫ້ອງພັດລົມ</Option>
        </Select>
      </Form.Item>

      <Form.Item label="ສະຖານະຫ້ອງ" layout="vertical">
        <Select
          placeholder="ເບິ່ງຕາມສະຖານະ"
          value={filters.status}
          onChange={(value) => handleFilterChange("status", value || "")}
          allowClear
          style={{ width: 150 }}
        >
          <Option value="">ສະແດງທັງໝົດ</Option>
          <Option value="available">ຫ້ອງວ່າງ</Option>
          <Option value="booked">ຫ້ອງຖືກຈອງແລ້ວ</Option>
          <Option value="maintenance">ບຳລຸງຮັກສາ</Option>
        </Select>
      </Form.Item>

      <Form.Item label="ປະເພດຕຽງ" layout="vertical">
        <Select
          placeholder="ເບິ່ງຕາມສະຖານະ"
          value={filters.type}
          onChange={(value) => handleFilterChange("type", value || "")}
          allowClear
          style={{ width: 150 }}
        >
          <Option value="">ສະແດງທັງໝົດ</Option>
          <Option value="Single">ຫ້ອງຕຽງດ່ຽວ</Option>
          <Option value="Double">ຫ້ອງຕຽງຄູ່</Option>
          <Option value="Suite">ຫ້ອງລວມ</Option>
        </Select>
      </Form.Item>
    </Space>
  );
};

export default RoomFilter;
