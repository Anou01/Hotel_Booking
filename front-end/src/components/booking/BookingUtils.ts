import { Room } from "../../types/booking";

export const calculateDaysStayed = (checkIn: Date, checkOut: Date): number => {
  const diffTime = checkOut.getTime() - checkIn.getTime();
  return Math.ceil(diffTime / (1000 * 3600 * 24)); // คำนวณเป็นวัน
};

export const calculateCost = (roomId: string, days: number, discount: number, rooms: Room[]): number => {
  const room = rooms.find((r) => r.id === roomId);
  if (!room) return 0;
  const total = room.pricePerNight * days;
  const final = total - discount;
  return final < 0 ? 0 : final; // ราคาหลังหักส่วนลดต้องไม่ติดลบ
};


