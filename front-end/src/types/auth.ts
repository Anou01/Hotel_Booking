// src/types/auth.ts
export interface LoginResponse {
    message: string;
    token: string;
    user: {
      id: string;
      name: string;
      username: string;
      role: "admin" | "receptionist" | "guest"; // ตาม role ใน model ของคุณ
    };
  }
  
  export interface User {
    id: string;
    name: string;
    username: string;
    role: "admin" | "receptionist" | "guest";
    profileImage?: string;
  }


 export interface AuthContextType {
    user: User | null;
    setUser: (user: User | null) => void;
  }