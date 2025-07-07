const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const path = require("path");
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");
const roomRoutes = require("./routes/roomRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

const app = express();
app.use(bodyParser.json());
app.use(morgan("tiny"));
app.use(cors());
// app.use(
//   cors({
//     origin: "http://localhost:5173", // หรือ domain ของ frontend
//     optionsSuccessStatus: 200,
//   })
// );
app.options("*", cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

// ให้ Express ให้บริการไฟล์ภาพที่ถูกอัปโหลด
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Routes
app.use("/api/users", userRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/upload", uploadRoutes);

// Default Route
app.get("/", (req, res) => {
  res.send("Welcome to Hotel Management API! 🏨");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
