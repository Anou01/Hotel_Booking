import React from "react";
import { Row, Col, Card, Statistic } from "antd";
import { Booking } from "../../types/booking";

interface DashboardMetricsProps {
  bookings: Booking[];
  loading: boolean;
}

const DashboardMetrics: React.FC<DashboardMetricsProps> = ({ bookings, loading }) => {
  const totalBookings = bookings.filter((b) => b.status === "booked").length;
  const checkedIn = bookings.filter((b) => b.status === "checked-in").length;
  const checkedOut = bookings.filter((b) => b.status === "checked-out").length;

  return (
    <Row gutter={[16, 16]}>
      <Col span={8}>
        <Card>
          <Statistic
            title="ຈຳນວນການຈອງທັງໝົດ"
            value={totalBookings}
            loading={loading}
            valueStyle={{ color: "#1890ff" }}
          />
        </Card>
      </Col>
      <Col span={8}>
        <Card>
          <Statistic
            title="ກຳລັງເຊັກອິນ"
            value={checkedIn}
            loading={loading}
            valueStyle={{ color: "#52c41a" }}
          />
        </Card>
      </Col>
      <Col span={8}>
        <Card>
          <Statistic
            title="ເຊັກເອົ້າແລ້ວ"
            value={checkedOut}
            loading={loading}
            valueStyle={{ color: "#fa8c16" }}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default DashboardMetrics;