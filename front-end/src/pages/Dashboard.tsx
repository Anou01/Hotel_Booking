import React, { useState, useEffect } from "react";
import { Row, Col, Typography } from "antd";
import styled from "styled-components";
import api from "../services/api";
import { Booking } from "../types/booking";
import { useCustomNotification } from "../utils/notificationUtils";
import DashboardMetrics from "../components/dashboard/DashboardMetrics";
import DashboardTable from "../components/dashboard/DashboardTable";
import DashboardChart from "../components/dashboard/DashboardChart";

const { Title } = Typography;

const PageContainer = styled.div`
  padding: 24px;
  background-color: #f0f2f5;
  min-height: calc(100vh - 64px);
`;

const Card = styled.div`
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

const DashboardPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const { openNotification } = useCustomNotification();

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const response = await api.get<{data:any[]}>("/bookings");
        const formattedBookings = response?.data.data?.map((booking:any) => ({
          ...booking,
          createdAt: booking.createdAt ? new Date(booking.createdAt) : undefined,
          updatedAt: booking.updatedAt ? new Date(booking.updatedAt) : undefined,
          checkInDate: booking.checkInDate ? new Date(booking.checkInDate) : undefined,
          checkOutDate: booking.checkOutDate ? new Date(booking.checkOutDate) : undefined,
        }));
        setBookings(formattedBookings);
      } catch (err) {
        openNotification("error", {
          message: "ເກີດຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນ",
          description: "ກະລຸນາລອງໃໝ່ອີກຄັ້ງ",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);


  return (
    <PageContainer>
      <Title level={2}>Dashboard</Title>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card>
            <DashboardMetrics bookings={bookings} loading={loading} />
          </Card>
        </Col>
        <Col span={16}>
          <Card>
            <DashboardTable bookings={bookings} loading={loading} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <DashboardChart loading={loading} />
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default DashboardPage;