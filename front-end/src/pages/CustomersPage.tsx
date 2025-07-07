import React, { useState, useEffect } from "react";
import { Table, Button, Input, Space, Popconfirm, Modal, Form, Input as AntInput } from "antd";
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import { useNavigate } from "react-router-dom";

interface Customer {
  key: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

const CustomersPage: React.FC = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [form] = Form.useForm();

  // ดึงข้อมูลตัวอย่าง (สมมติ)
  useEffect(() => {
    const mockCustomers: Customer[] = Array.from({ length: 10 }, (_, index) => ({
      key: `${index + 1}`,
      name: `ລູກຄ້າ ${index + 1}`,
      email: `customer${index + 1}@example.com`,
      phone: `0${900000000 + index}`,
      address: `ທີ່ຢູ່ ${index + 1}, ນະຄອນຫຼວງ`,
    }));
    setCustomers(mockCustomers);
  }, []);

  // ค้นหาลูกค้า
  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchText.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchText.toLowerCase())
  );

  // คอลัมน์สำหรับตาราง
  const columns: ColumnsType<Customer> = [
    {
      title: "ຊື່",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "ອີເມວ",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "ເບີໂທ",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "ທີ່ຢູ່",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "ຈັດການ",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            ແກ້ໄຂ
          </Button>
          <Popconfirm
            title="ເຈົ້າແນ່ໃຈລະບໍ່ທີ່ຕ້ອງການລຶບ?"
            onConfirm={() => handleDelete(record.key)}
            okText="ຢືນຢັນ"
            cancelText="ຍົກເລິກ"
          >
            <Button icon={<DeleteOutlined />} danger>
              ລຶບ
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // ฟังก์ชันเพิ่ม/แก้ไขลูกค้า
  const showModal = () => {
    setEditingCustomer(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    form.setFieldsValue(customer);
    setIsModalVisible(true);
  };

  const handleDelete = (key: string) => {
    setCustomers(customers.filter((customer) => customer.key !== key));
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      const newCustomer: Customer = {
        key: editingCustomer?.key || `${customers.length + 1}`,
        name: values.name,
        email: values.email,
        phone: values.phone,
        address: values.address,
      };
      if (editingCustomer) {
        setCustomers(
          customers.map((customer) =>
            customer.key === editingCustomer.key ? newCustomer : customer
          )
        );
      } else {
        setCustomers([...customers, newCustomer]);
      }
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  return (
    <div style={{ padding: "20px", background: "#fff", minHeight: "calc(100vh - 64px)" }}>
      <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0 }}>จัดการลูกค้า</h2>
        <Space>
          <Input
            placeholder="ค้นหาลูกค้า..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 200 }}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
            เพิ่มลูกค้า
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={filteredCustomers}
        pagination={{ pageSize: 10 }}
        rowKey="key"
      />

      <Modal
        title={editingCustomer ? "ແກ້ໄຂລູກຄ້າ" : "ເພີ່ມລູກຄ້າ"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="ບັນທຶກ"
        cancelText="ຍົກເລິກ"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="ຊື່"
            rules={[{ required: true, message: "ກະລຸນາປ້ອນຊື່!" }]}
          >
            <AntInput />
          </Form.Item>
          <Form.Item
            name="email"
            label="ອີເມວ"
            rules={[{ required: true, message: "ກະລຸນນປ້ອນອີເມວ!" }]}
          >
            <AntInput />
          </Form.Item>
          <Form.Item
            name="phone"
            label="เบอร์โทร"
            rules={[{ required: true, message: "ກະລຸນາປ້ອນເບີໂທ!" }]}
          >
            <AntInput />
          </Form.Item>
          <Form.Item
            name="address"
            label="ที่อยู่"
            rules={[{ required: true, message: "ກະລຸນາປ້ອນທີ່ຢູ່!" }]}
          >
            <AntInput.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CustomersPage;