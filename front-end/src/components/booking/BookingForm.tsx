import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  DatePicker,
  Checkbox,
  Button,
  Row,
  Col,
} from "antd";
import styled from "styled-components";
import { Room } from "../../types/room";
import { LoginOutlined } from "@ant-design/icons";
import moment from "moment";
import { CiBookmarkCheck } from "react-icons/ci";
import { calculateDaysStayed } from "./BookingUtils";

const FormContainer = styled.div`
  background-color: #fff;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  max-width: 800px;
  margin: 0 auto;
`;

const FormTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-bottom: 24px;
  text-align: center;
`;

const SubmitButton = styled(Button)`
  background-color: #52c41a;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  height: auto;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    background-color: #73d13d;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }
`;

const CancelButton = styled(Button)`
  border-radius: 6px;
  padding: 8px 16px;
  height: auto;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    border-color: #ff4d4f;
    color: #ff4d4f;
  }
`;

const TotalAmount = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: #1890ff;
  margin-top: 8px;
  text-align: right;
`;

const ChangeAmount = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: #52c41a; /* สีเขียวเพื่อเน้นเงินทอน */
  margin-top: 8px;
  text-align: right;
`;

interface BookingFormProps {
  room: Room | null;
  onFinish: (values: any) => void;
  onCancel: () => void;
  initialValues?: any;
  form?: any;
  bookingStatus: string;
}

const BookingForm: React.FC<BookingFormProps> = ({
  room,
  onFinish,
  onCancel,
  initialValues,
  form,
  bookingStatus,
}) => {
  const [localForm] = Form.useForm(form || null);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [changeAmount, setChangeAmount] = useState<number>(0); // เพิ่ม state สำหรับเงินทอน
  const [daysStayed, setDaysStayed] = useState<number>(0);
  useEffect(() => {
    console.log("Initial values in BookingForm:", initialValues);
    if (initialValues) {
      localForm.setFieldsValue({
        ...initialValues,
        checkInDate: initialValues.checkInDate
          ? moment(initialValues.checkInDate)
          : null,
        checkOutDate: initialValues.checkOutDate
          ? moment(initialValues.checkOutDate)
          : null,
      });
      calculateTotal();
    } else {
      localForm.resetFields();
      setTotalAmount(0);
      setChangeAmount(0);
    }
  }, [initialValues, localForm]);



  const calculateTotal = () => {
    const checkIn = localForm.getFieldValue("checkInDate");
    const checkOut = localForm.getFieldValue("checkOutDate");
    const discount = localForm.getFieldValue("discount") || 0;
    const payment = localForm.getFieldValue("paymentAmount") || 0;

    console.log("Calculating total:", {
      checkIn,
      checkOut,
      discount,
      payment,
      roomPrice: room?.price,
    });

    if (checkIn && checkOut && room?.price) {
      const days = calculateDaysStayed(new Date(checkIn), new Date(checkOut));

      if (days > 0) {
        const total = days * room.price - discount;
        const finalTotal = total > 0 ? total : 0;
        setTotalAmount(finalTotal);
        setChangeAmount(payment >= finalTotal ? payment - finalTotal : 0); // คำนวณเงินทอน
        setDaysStayed(days || 0)

      } else {
        setTotalAmount(0);
        setChangeAmount(0);
        setDaysStayed(0)
      }
    } else {
      setTotalAmount(0);
      setChangeAmount(0);
      setDaysStayed(0)
    }
  };

  const handleFinish = (values: any) => {
    const finalValues = {
      ...values,
      roomId: room?.id,
      daysStayed,
      totalAmount,
      changeAmount, // เพิ่มเงินทอนในข้อมูลที่ส่ง
      checkInDate: values.checkInDate?.toDate(),
      checkOutDate: values.checkOutDate?.toDate(),
      status: bookingStatus,
    };
    console.log("Form values in BookingForm:", finalValues);
    onFinish(finalValues);
  };

  return (
    <FormContainer>
      <FormTitle>ແບບຟອມເຊັກອິນ</FormTitle>
      <Form
        form={localForm}
        layout="vertical"
        onFinish={handleFinish}
        onValuesChange={calculateTotal}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="guestName"
              label="ຊື່ຜູ້ເຂົ້າພັກ"
              rules={[{ required: true, message: "ກະລຸນາປ້ອນຊື່ຜູ້ເຂົ້າພັກ!" }]}
            >
              <Input
                placeholder="ປ້ອນຊື່ຜູ້ເຂົ້າພັກ"
                style={{ borderRadius: "4px" }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="guestPhone"
              label="ເບີໂທຜູ້ເຂົ້າພັກ"
              rules={[
                { required: true, message: "ກະລຸນາປ້ອນເບີໂທຜູ້ເຂົ້າພັກ!" },
                {
                  pattern: /^[0-9]{8,10}$/,
                  message: "ເບີໂທຕ້ອງມີ 8-10 ຕົວເລກ!",
                },
              ]}
            >
              <Input
                placeholder="ປ້ອນເບີໂທ (8-10 ຕົວເລກ)"
                style={{ borderRadius: "4px" }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="checkInDate"
              label="ວັນທີ່ເຊັກອິນ"
              rules={[{ required: true, message: "ກະລຸນາເລືອກວັນທີ່ເຊັກອິນ!" }]}
            >
              <DatePicker
                placeholder="ເລືອກວັນທີ່"
                style={{ width: "100%", borderRadius: "4px" }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="checkOutDate"
              label="ວັນທີ່ເຊັກເອົາ"
              rules={[
                { required: true, message: "ກະລຸນາເລືອກວັນທີ່ເຊັກເອົາ!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("checkInDate") < value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      "ວັນທີ່ເຊັກເອົາຕ້ອງຫຼັງວັນທີ່ເຊັກອິນ!"
                    );
                  },
                }),
              ]}
            >
              <DatePicker
                placeholder="ເລືອກວັນທີ່"
                style={{ width: "100%", borderRadius: "4px" }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="discount"
              label="ສ່ວນຫຼຸດ (ກີບ)"
              rules={[{ required: false }]}
            >
              <InputNumber
                min={0}
                placeholder="ປ້ອນສ່ວນຫຼຸດ (ຖ້າມີ)"
                style={{ width: "100%", borderRadius: "4px" }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="paymentAmount"
              label="ຈຳນວນເງິນທີ່ຮັບ (ກີບ)"
              rules={[
                { required: true, message: "ກະລຸນາປ້ອນຈຳນວນເງິນທີ່ຮັບ!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || value >= totalAmount) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      "ຈຳນວນເງິນຕ້ອງຫຼາຍກວ່າຫຼືເທົ່າກັບຍອດທັງໝົດ!"
                    );
                  },
                }),
              ]}
            >
              <InputNumber
                min={0}
                placeholder="ປ້ອນຈຳນວນເງິນທີ່ຮັບ"
                style={{ width: "100%", borderRadius: "4px" }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="isAdvanceBooking"
              label="ການຈອງລ່ວງໜ້າ"
              valuePropName="checked"
            >
              <Checkbox>ຈອງລ່ວງໜ້າ</Checkbox>
            </Form.Item>
          </Col>
        </Row>

        <TotalAmount>ຍອດທັງໝົດ: {totalAmount.toLocaleString()} ກີບ</TotalAmount>
        <ChangeAmount>
          ເງິນທອນ: {changeAmount.toLocaleString()} ກີບ
        </ChangeAmount>

        <div style={{ textAlign: "right", marginTop: 24 }}>
          <CancelButton onClick={onCancel} style={{ marginRight: 12 }}>
            ຍົກເລີກ
          </CancelButton>

          <SubmitButton type="primary" htmlType="submit">
            {bookingStatus === 'booked' && <><CiBookmarkCheck style={{ marginRight: 8 }} /> ຢືນຢັນການຈອງ </>}
            {bookingStatus === 'checkIn' && <><LoginOutlined style={{ marginRight: 8 }} /> ເຊັກອິນ </>}
            
          </SubmitButton>
        </div>
      </Form>
    </FormContainer>
  );
};

export default BookingForm;
