// src/types/booking.ts
export interface Booking {
    id?: String;
    guestName: string;
    guestPhone: string;
    roomId: string;
    checkInDate: Date;
    checkOutDate: Date;
    daysStayed: number;
    totalCost: number;
    discount: number;
    finalAmount: number;
    changeAmount: number;
    amountReceived: number;
    isAdvanceBooking: boolean;
    paymentStatus: "pending" | "paid" | "partial";
    status: "booked" | "cancelled" | "completed" | 'checked-in' | 'checked-out';
    createdAt?: Date; // จาก timestamps
    updatedAt?: Date; // จาก timestamps
  }
  
  export interface Room {
    id: string;
    name: string;
    pricePerNight: number;
    isAvailable: boolean;
    maxCapacity: number;
  }


  export interface BookingFilter {
    guestName?: string;
    guestPhone?: string;
    status?: string;
  }