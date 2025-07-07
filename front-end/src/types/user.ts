// src/types/user.ts
export interface User {
    id?: string; // ObjectId จาก MongoDB จะแปลงเป็น string ใน frontend
    name: string;
    profileImage: string;
    username: string;
    password: string; // ใน frontend อาจไม่เก็บ password จริง (เก็บเป็น placeholder หรือ hash)
    role: "admin" | "receptionist" | "guest";
    createdAt?: Date; // จาก timestamps
    updatedAt?: Date; // จาก timestamps
  }

export interface UserFilters {
  role: string;
  name: string;
}


export interface UserLogin {
  id: string;
  name: string;
  username: string;
  role: "admin" | "receptionist" | "guest";
  profileImage?: string;
}
