const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    roomNumber: { type: String, required: true, unique: true },
    airConditioning: {
      type: String,
      enum: ["Air", "Fan"], // แอร์ หรือ พัดลม
      required: true,
    },
    amenities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Amenities', default:null }],
    type: { type: String, required: true }, // เช่น Single, Double, Suite
    price: { type: Number, required: true },
    status: {
      type: String,
      enum: ["available", "booked","checked-in", "maintenance"],
      default: "available",
    },
  },
  { timestamps: true }
);

roomSchema.set('toObject', { virtuals: true });
roomSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model("Room", roomSchema);
