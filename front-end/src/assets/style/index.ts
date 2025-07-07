import styled from "styled-components";
 
export const CheckButton = styled.button<{status:string}>`
  background-color:${(props) => (props.status === 'checkIn' ? '#52c41a' : props.status === 'booked' ? "#f5222d" : '#ff9c33')} ; /* เขียวสดใสจาก Ant Design */
  color: #fff;
  border: none; /* ลบขอบเพื่อความทันสมัย */
  border-radius: 6px; /* มุมโค้งมนขึ้นเล็กน้อย */
  padding: 8px 16px; /* เพิ่ม padding เพื่อให้ดูนุ่มนวล */
  font-size: 14px; /* ขนาดตัวอักษรที่อ่านง่าย */
  font-weight: 500; /* น้ำหนักตัวอักษรปานกลาง */
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* เงาอ่อนๆ */
  transition: all 0.3s ease; /* รวม transition ทั้ง background, transform, shadow */

  &:hover {
    background-color:${(props) => (props.status === 'checkIn' ? '#52c41a' : props.status === 'booked' ? "#f5222d" : '#ff9c33')}; /* เขียวอ่อนขึ้นเมื่อ hover */
    transform: translateY(-2px); /* ลอยขึ้นเล็กน้อย */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15); /* เงาเข้มขึ้น */
  }

  &:active {
    transform: translateY(0); /* กลับสู่ตำแหน่งเดิมเมื่อกด */
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1); /* เงาลดลง */
  }

  &:disabled {
    background-color: #d9d9d9; /* สีเทาเมื่อ disabled */
    cursor: not-allowed;
    box-shadow: none;
  }
`;