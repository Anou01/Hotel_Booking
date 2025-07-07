import { Input, Select, Space } from "antd";
import React from "react";
import { UserFilters } from "../../types/user";

const { Option } = Select;

interface UserFilterProps {
  filters: UserFilters;
  handleFilterChange: (key: keyof UserFilters, value: string) => void;
}

const UserFilter: React.FC <UserFilterProps> = ({handleFilterChange,filters}) => {
  return (
    <Space>
      <Input
        placeholder="ຄົ້ນຫາດ້ວຍຊື່..."
        value={filters.name}
        onChange={(e) => handleFilterChange("name", e.target.value)}
        style={{ width: 200 }}
      />
      <Select
        placeholder="ຜ່ານການຕາມບົດບາດ"
        value={filters.role}
        onChange={(value) => handleFilterChange("role", value || "")}
        allowClear
        style={{ width: 150 }}
      >
        <Option value="">ເບິ່ງຕາມສິດນຳໃຊ້</Option>
        <Option value="admin">Admin</Option>
        <Option value="receptionist">Receptionist</Option>
        <Option value="guest">Guest</Option>
      </Select>
    </Space>
  );
};

export default UserFilter;
