const { default: mongoose } = require("mongoose");
const Booking = require("../models/BookingModel");
const RoomModel = require("../models/RoomModel");

// CREATE: Book a room
exports.createBooking = async (req, res) => {
  try {
    // ดึงข้อมูลจาก req.body
    const {
      roomId,
      guestName,
      guestPhone,
      checkInDate,
      checkOutDate,
      discount,
      totalAmount,
      paymentAmount,
      changeAmount,
      isAdvanceBooking,
    } = req.body;

    // ตรวจสอบข้อมูลที่จำเป็น
    if (!roomId || !guestName || !guestPhone || !checkInDate || !checkOutDate) {
      return res
        .status(400)
        .json({ message: "ກະລຸນາປ້ອນຂໍ້ມູນທີ່ຈຳເປັນໃຫ້ຄົບຖ້ວນ" });
    }

    const createdAt = new Date();
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    // ตรวจสอบวันที่
    if (checkIn >= checkOut) {
      return res
        .status(400)
        .json({ message: "ວັນທີເຊັກເອົ້າຕ້ອງຢູ່ຫຼັງວັນທີເຊັກອິນ" });
    }

    // ตรวจสอบสถานะห้องก่อนจอง
    const room = await RoomModel.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "ບໍ່ເຫັນຫ້ອງນີ້" });
    }

    // ตรวจสอบการจองซ้ำในช่วงเวลา (เงื่อนไขข้อ 3 และ 6)
    const existingBooking = await Booking.findOne({
      roomId,
      status: { $ne: "cancelled" }, // ไม่นับการจองที่ยกเลิก
      $or: [
        { checkInDate: { $lte: checkOut }, checkOutDate: { $gte: checkIn } },
      ],
    });
    if (existingBooking) {
      return res.status(400).json({
        message: "ຫ້ອງນີ້ຖືກຈອງແລ້ວໃນຊ່ວງວັນທີ",
        conflictingBooking: {
          checkInDate: existingBooking.checkInDate,
          checkOutDate: existingBooking.checkOutDate,
        },
      });
    }

    // ถ้าไม่ใช่การจองล่วงหน้า (isAdvanceBooking: false) ห้องต้องว่างเพื่อเช็คอิน
    if (!isAdvanceBooking && room.status !== "available") {
      return res
        .status(400)
        .json({ message: "ຫ້ອງນີ້ບໍ່ສາມາດເຊັກອິນໄດ້ໃນຕອນນີ້" });
    }

    // สร้าง booking ใหม่
    const booking = new Booking({
      userId: req.user ? req.user._id : userId,
      roomId,
      guestName,
      guestPhone,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      discount: discount || 0,
      totalCost: totalAmount + (discount || 0),
      finalAmount: totalAmount,
      amountReceived: paymentAmount,
      changeAmount: changeAmount || 0,
      isAdvanceBooking: isAdvanceBooking || false,
      paymentStatus: paymentAmount >= totalAmount ? "paid" : "pending", // ไม่มีมัดจำขั้นต่ำ
      status: isAdvanceBooking ? "booked" : "checked-in", // ถ้าไม่ใช่การจองล่วงหน้าให้เป็น checked-in
      createdAt,
    });

    // อัปเดตสถานะห้องเฉพาะกรณีเช็คอินทันที (เงื่อนไขข้อ 2 และ 5)
    if (!isAdvanceBooking) {
      await RoomModel.findByIdAndUpdate(
        roomId,
        { status: "checked-in" },
        { new: true }
      );
    } // ถ้าเป็น booked ไม่ต้องอัปเดตสถานะห้อง

    // บันทึก booking
    await booking.save();

    // ส่ง response กลับ
    res.status(201).json({
      message: isAdvanceBooking ? "ຈອງຫ້ອງສຳເລັດ" : "ເຊັກອິນສຳເລັດ",
      booking,
    });
  } catch (err) {
    console.error("Error creating booking:", err);
    res
      .status(400)
      .json({ message: err.message || "ເກີດຂໍ້ຜິດພາດໃນການຈອງຫ້ອງ" });
  }
};
// READ: Get all bookings of the user
exports.getUserBookings = async (req, res) => {
  try {
    const {
      guestName,
      guestPhone,
      status,
      page = 1,
      limit = 10,
      sort = "createdAt",
    } = req.query;

    let query = {};
    if (status) query.status = status;
    if (guestName) query.guestName = { $regex: guestName, $options: "i" }; // ค้นหาแบบ case-insensitive
    if (guestPhone) query.guestPhone = { $regex: guestPhone }; // ค้นหาแบบ case-insensitive

    // คำนวณ offset สำหรับ Pagination
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const bookings = await Booking.find(query)
      .populate( "roomId")
      .sort(sort) // เรียงลำดับตาม field ที่ระบุ (เช่น createdAt)
      .skip(skip)
      .limit(limitNum);

    // นับจำนวนผู้ใช้ทั้งหมดสำหรับ Pagination
    const total = await Booking.countDocuments(query);

    res.status(200).json({
      data: bookings,
      total: total,
      pagination: {
        current: pageNum,
        pageSize: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.getBookingsByRoomId = async (req, res) => {
  try {
    const { id } = req.params;

    // ตรวจสอบว่า roomId ถูกส่งมาหรือไม่
    if (!id) {
      return res.status(400).json({ message: "Please provide a valid roomId" });
    }

    // ตรวจสอบว่า roomId เป็น ObjectId ที่ถูกต้อง (ถ้าใช้ MongoDB)
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid roomId format" });
    }

    // ค้นหาการจองที่มี roomId และ status: 'checked-in'
    const bookings = await Booking.findOne({
      roomId: id,
      status: "checked-in",
    }).populate("roomId");

    // ถ้าไม่พบการจอง
    if (!bookings) {
      return res.status(404).json({
        message: "No active bookings found for this room",
      });
    }

    // ส่งข้อมูลการจองกลับ
    res.status(200).json(bookings);
  } catch (err) {
    console.error("Error in getBookingsByRoomId:", err); // Logging error
    res.status(500).json({
      message: "Failed to retrieve bookings",
      error: err.message,
    });
  }
};

// UPDATE: Cancel a booking
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: "cancelled" },
      { new: true }
    );
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.status(200).json({ message: "Booking cancelled", booking });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE: Remove a booking
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.checkOutBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    // ตรวจสอบการจอง
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "ບໍ່ເຫັນຂໍ້ມູນການຈອງ" });
    }

    // ตรวจสอบสถานะการจอง
    if (booking.status !== "checked-in") {
      return res.status(400).json({
        message: "ການຈອງນີ້ບໍ່ສາມາດເຊັກເອົ້າໄດ້",
        currentStatus: booking.status,
      });
    }

    // อัปเดตสถานะการจองเป็น 'checked-out'
    booking.status = "checked-out";
    await booking.save();

    // อัปเดตสถานะห้องเป็น 'available'
    await RoomModel.findByIdAndUpdate(
      booking.roomId,
      { status: "available" },
      { new: true }
    );

    res.status(200).json({
      message: "ເຊັກເອົ້າສຳເລັດ",
      booking,
    });
  } catch (err) {
    console.error("Error checking out booking:", err);
    res
      .status(400)
      .json({ message: err.message || "เกิดข้อผิดพลาดในการเช็คเอาท์" });
  }
};


exports.checkInBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    if (!bookingId) {
      return res.status(400).json({ message: 'Please provide a valid bookingId' });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'ບໍ່ເຫັນຫ້ອງນີ້' });
    }

    if (booking.status !== 'booked') {
      return res.status(400).json({
        message: 'ການຈອງນີ້ບໍ່ສາມາດເຊັກອິນໄດ້',
        currentStatus: booking.status,
      });
    }

    booking.status = 'checked-in';
    await booking.save();

    await RoomModel.findByIdAndUpdate(booking.roomId, { status: 'checked-in' }, { new: true });

    res.status(200).json({
      message: 'ເຊັກອິນສຳເລັດ',
      booking,
    });
  } catch (err) {
    console.error('Error checking in booking:', err);
    res.status(400).json({ message: err.message || 'เกิดข้อผิดพลาดในการเช็คอิน' });
  }
};

exports.getBookingStats = async (req, res) => {
  try {
    const stats = await Booking.aggregate([
      // ขั้นตอน 1: กรองเฉพาะ status: 'booked'
      {
        $match: {
          status: 'booked',
        },
      },
      // ขั้นตอน 2: จัดกลุ่มตามวันที่
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }, // แปลง createdAt เป็น string YYYY-MM-DD
          },
          count: { $sum: 1 }, // นับจำนวนการจองในแต่ละวัน
        },
      },
      // ขั้นตอน 3: ปรับรูปแบบผลลัพธ์
      {
        $project: {
          _id: 0, // ซ่อน _id
          date: '$_id', // ใช้ _id (วันที่) เป็น field date
          count: 1, // รักษา count
        },
      },
      // ขั้นตอน 4 (optional): เรียงตามวันที่
      {
        $sort: {
          date: 1, // เรียงจากเก่าไปใหม่
        },
      },
    ]);

    res.status(200).json(stats);
  } catch (err) {
    console.error('Error fetching booking stats:', err);
    res.status(500).json({ message: 'Failed to retrieve booking stats', error: err.message });
  }
};