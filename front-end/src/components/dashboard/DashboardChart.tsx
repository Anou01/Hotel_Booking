import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import api from "../../services/api";

interface BookingStat {
  date: string;
  count: number;
}

interface DashboardChartProps {
  loading: boolean;
}

const DashboardChart: React.FC<DashboardChartProps> = ({ loading: parentLoading }) => {
  const [data, setData] = useState<BookingStat[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBookingStats = async () => {
      setLoading(true);
      try {
        const response = await api.get<BookingStat[]>("/bookings/booking-stats");
        setData(response.data);
      } catch (err) {
        console.error("Error fetching booking stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingStats();
  }, []);

  const series = [
    {
      name: "ຈຳນວນການຈອງ (ຖືກຈອງ)",
      data: data.map((item) => item.count),
    },
  ];

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "bar",
      height: 350,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
      },
    },
    dataLabels: {
      enabled: true,
      offsetY: -20,
      style: {
        fontSize: "12px",
        colors: ["#304758"],
      },
    },
    xaxis: {
      categories: data.map((item) => item.date),
      labels: {
        rotate: -45,
        style: {
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      title: {
        text: "ຈຳນວນການຈອງ",
      },
    },
    colors: ["#1890ff"],
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val} ການຈອງ`,
      },
    },
  };

  return (
    <div>
      <h3 style={{ marginBottom: 16 }}>ການຈອງທີ່ຖືກຈອງຕໍ່ວັນ</h3>
      {(loading || parentLoading) ? (
        <div>Loading...</div>
      ) : (
        <Chart options={options} series={series} type="bar" height={350} />
      )}
    </div>
  );
};

export default DashboardChart;