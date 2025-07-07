const mongoose = require("mongoose");

const AmenitiesSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, default: 0, required: true },
    unit: { type: String, required: true },
    note: String,
  },
  { timestamps: true }
);

AmenitiesSchema.set("toObject", { virtuals: true });
AmenitiesSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Amenities", AmenitiesSchema);
