import React, { useState } from "react";
import { Input, Select, Button, Row, Col } from "antd";
import styled from "styled-components";
import { BookingFilter } from "../../types/booking";

const { Option } = Select;

const FilterContainer = styled.div`
  margin-bottom: 20px;
`;

interface CustomerFilterProps {
  setFilters: (filters: BookingFilter) => void;
}

const CustomerFilter: React.FC<CustomerFilterProps> = ({ setFilters }) => {
  const [guestName, setGuestName] = useState<string>("");
  const [guestPhone, setGuestPhone] = useState<string>("");
  const [status, setStatus] = useState<string | undefined>(undefined);

  const handleFilter = () => {
    setFilters({ guestName, guestPhone, status });
  };

  const handleReset = () => {
    setGuestName("");
    setGuestPhone("");
    setStatus(undefined);
    setFilters({ guestName: "", guestPhone: "", status: "" });
  };

  return (
    <FilterContainer>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Input
            placeholder="ຊື່ຜູ້ເຂົ້າພັກ"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            style={{ borderRadius: "4px" }}
          />
        </Col>
        <Col xs={24} sm={8}>
          <Input
            placeholder="ເບີໂທ"
            value={guestPhone}
            onChange={(e) => setGuestPhone(e.target.value)}
            style={{ borderRadius: "4px" }}
          />
        </Col>
        <Col xs={24} sm={8}>
          <Select
            placeholder="ສະຖານະ"
            value={status}
            onChange={(value) => setStatus(value)}
            allowClear
            style={{ width: "100%", borderRadius: "4px" }}
          >
            <Option value="booked">ຖືກຈອງ</Option>
            <Option value="checked-in">ກຳລັງເຊັກອິນ</Option>
            <Option value="checked-out">ເຊັກເອົາແລ້ວ</Option>
          </Select>
        </Col>
      </Row>
      <Row justify="end" style={{ marginTop: 16 }}>
        <Button onClick={handleReset} style={{ marginRight: 8 }}>
          ຣີເຊັດ
        </Button>
        <Button type="primary" onClick={handleFilter}>
          ຄົ້ນຫາ
        </Button>
      </Row>
    </FilterContainer>
  );
};

export default CustomerFilter;
