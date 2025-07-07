const mongoose = require("mongoose");

// models/Booking.js
const bookingSchema = new mongoose.Schema(
  {
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    guestName: { type: String, required: true },
    guestPhone: { type: String, required: true },
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    discount: { type: Number, default: 0 },
    totalCost: { type: Number, required: true }, // ราคาก่อนหักส่วนลด
    finalAmount: { type: Number, required: true }, // ราคาหลังหักส่วนลด
    amountReceived: { type: Number, required: true },
    changeAmount: { type: Number, default: 0 },
    isAdvanceBooking: { type: Boolean, default: false },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
    status: {
      type: String,
      enum: ["booked", "checked-in", "checked-out", "cancelled"],
      default: "booked",
    },
  },
  { timestamps: true }
);

bookingSchema.set("toObject", { virtuals: true });
bookingSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Booking", bookingSchema);
