// src/types/room.ts
export interface Room {
    id?: string; // ObjectId จาก MongoDB จะแปลงเป็น string ใน frontend
    roomNumber: string;
    airConditioning: "Air" | "Fan";
    amenities: string[] | null; // Array ของ ObjectId (string) จาก Amenities
    type: string; // เช่น "Single", "Double", "Suite"
    price: number;
    status: "available" | "booked" | "maintenance" | "checked-in";
    createdAt?: Date; // จาก timestamps
    updatedAt?: Date; // จาก timestamps
  }
  
  export interface Amenity {
    _id: string;
    name: string;
    // เพิ่มฟิลด์อื่น ๆ ตามที่ต้องการจาก Amenities model
  }

 export interface RoomFilters {
    roomNumber: string;
    type: string;
    airConditioning: string;
    status: string;
 }