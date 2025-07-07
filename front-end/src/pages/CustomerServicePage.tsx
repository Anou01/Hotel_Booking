import React, { useState, useEffect } from "react";
import { Row, Col, Typography } from "antd";
import styled from "styled-components";
import CustomerFilter from "../components/customer/CustomerFilter";
import CustomerTable from "../components/customer/CustomerTable";
import CustomerDetail from "../components/customer/CustomerDetail";
import { Booking, BookingFilter } from "../types/booking";
import api from "../services/api";
import { Pagination } from "../types";

const { Title } = Typography;

const PageContainer = styled.div`
  padding: 20px;
  background-color: #f5f5f5;
  min-height: calc(100vh - 64px);
`;

const ContentCard = styled.div`
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

const CustomerServicePage: React.FC = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState<BookingFilter>({}); // State เดียวสำหรับตัวกรอง
  const [pagination, setPagination] = useState<Pagination | null>({
    current: 1,
    pageSize: 10,
    total: 0,
    pages: 1,
  });

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        // สร้าง query object โดยจัดการ undefined
        const queryParams: Record<string, string> = {
            page: pagination?.current?.toString() || "1", // ใช้ optional chaining
            limit: pagination?.pageSize?.toString() || "10", // ใช้ optional chaining
        };
        if (filters.guestName) queryParams.guestName = filters.guestName;
        if (filters.guestPhone) queryParams.guestPhone = filters.guestPhone;
        if (filters.status) queryParams.status = filters.status;

        const query = new URLSearchParams(queryParams).toString();

        const response = await api.get<{
          data: any[];
          pagination: Pagination;
        }>(`/bookings?${query.toString()}`);

        // แปลง createdAt และ updatedAt เป็น Date ถ้าส่งเป็น string
        const formattedBookings = (response.data.data || []).map((booking) => ({
          ...booking,
          createdAt: booking.createdAt
            ? new Date(booking.createdAt)
            : undefined,
          updatedAt: booking.updatedAt
            ? new Date(booking.updatedAt)
            : undefined,
        }));

        setBookings(formattedBookings);
        setPagination(response.data.pagination);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [
    filters, pagination?.current, pagination?.pageSize
  ]);

  // ฟังก์ชันจัดการ Pagination
  const handleTableChange = (pagination: any) => {
    setPagination({
      current: pagination.current,
      pageSize: pagination.pageSize,
      total: pagination.total,
      pages: Math.ceil(pagination.total / pagination.pageSize),
    });
  };

  const handleSelectBooking = (booking: Booking) => {
    setSelectedBooking(booking);
  };

  const handleCheckInSuccess = (updatedBooking: Booking) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === updatedBooking.id ? updatedBooking : b))
    );
    setSelectedBooking(updatedBooking);
  };

  return (
    <PageContainer>
      <Title level={3}>ຂໍ້ມູນລູກຄ້າທີ່ໃຊ້ບໍລິການ</Title>
      <Row gutter={[16, 16]}>
        <Col span={16}>
          <ContentCard>
            <CustomerFilter setFilters={setFilters} />
            <CustomerTable
              bookings={bookings}
              loading={loading}
              onSelect={handleSelectBooking}
              handleTableChange={handleTableChange}
              pagination={pagination}
            />
          </ContentCard>
        </Col>
        <Col span={8}>
          <ContentCard>
            <CustomerDetail booking={selectedBooking} onCheckInSuccess={handleCheckInSuccess} />
          </ContentCard>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default CustomerServicePage;
